# Phase 2: Background Worker — Architecture Decisions

## Q1: Can we use Rust instead of Python for the worker?

**Yes, absolutely.** Here's the honest comparison:

### What Python gives you (from the README plan)
| Dependency | Python Ecosystem |
|---|---|
| Whisper | `whisper.cpp` has Python bindings (`pywhispercpp`) |
| FFmpeg | Called via `subprocess` — same in any language |
| YAKE / TextRank | Native Python NLP libraries |
| Redis consumer | `redis-py` with `BRPOP` |
| S3 upload | `boto3` |

### What Rust gives you instead
| Dependency | Rust Ecosystem |
|---|---|
| Whisper | `whisper-rs` crate — direct C bindings to `whisper.cpp` (no Python overhead) |
| FFmpeg | Called via `std::process::Command` — identical to Python's subprocess |
| YAKE / TextRank | ⚠️ No mature Rust equivalent. **But** you can use simple TF-IDF or call a small Python/Node script just for this step |
| Redis consumer | `redis` crate (you already have it!) with `BRPOP` |
| S3 upload | `aws-sdk-s3` or `rust-s3` crate |

### Verdict: **Go with Rust** ✅

| Factor | Python Worker | Rust Worker |
|---|---|---|
| **Memory** | ~30 MB Python runtime + libraries | ~5 MB Rust binary |
| **Single binary** | ❌ Needs Python + pip + venv | ✅ One compiled binary |
| **Docker image size** | ~800 MB+ (Python + FFmpeg + Whisper) | ~200-400 MB (static binary + FFmpeg + Whisper model) |
| **Type safety** | ❌ Runtime errors | ✅ Compile-time guarantees |
| **Shared code** | ❌ Duplicate DB models, Redis logic | ✅ Share crate with your backend |
| **Your expertise** | You're already writing Rust | ✅ No context switch |
| **NLP (YAKE/TextRank)** | ✅ Native | ⚠️ Limited — but solvable (see below) |

> **The NLP gap is small.** For chapter generation, you can:
> 1. Use a simple Rust TF-IDF implementation (the `rust-tfidf` or `nlprule` crate)
> 2. Use keyword frequency on sliding windows (trivial to implement)  
> 3. Or shell out to a tiny Python script just for the NLP step (hybrid approach)

---

## Q2: Separate Docker containers for FFmpeg/Whisper vs. running in the backend?

### Option A: Everything in the backend container ❌ BAD

```
┌──────────────────────────────┐
│  Backend Container           │
│  ├── Actix-Web API (~35 MB)  │
│  ├── Whisper.cpp (~388 MB)   │  ← One bad video = API goes down
│  ├── FFmpeg (~150 MB peak)   │
│  └── Total: ~570 MB          │
└──────────────────────────────┘
```

**Why this is dangerous:**
- FFmpeg segfaults on malformed video → **your API crashes**
- Whisper loads 388 MB into RAM → **API response times spike**
- A 30-min video takes 5 min to process → **thread starvation**
- You can't scale API and worker independently
- You can't set memory limits separately

### Option B: Separate worker container (same Rust binary, different entrypoint) ✅ GOOD

```
┌───────────────┐     ┌───────┐     ┌──────────────────────┐
│ Backend       │────▶│ Redis │◀────│ Worker               │
│ Container     │     │       │     │ Container             │
│ (~35 MB)      │     └───────┘     │                      │
│ Actix-Web API │                   │ ├── worker binary     │
└───────────────┘                   │ ├── FFmpeg (installed)│
                                    │ ├── whisper.cpp model │
                                    │ └── (~600 MB peak)    │
                                    └──────────────────────┘
```

**Why this is the way:**
- Worker crashes? API keeps serving `202 Accepted` and job status queries
- Redis retains the job → worker restarts → picks it back up
- You can set `deploy.resources.limits.memory: 768M` on the worker only
- Scale workers by adding more containers pulling from the same Redis queue
- Matches your original architecture perfectly

### Option C: Separate containers for FFmpeg AND Whisper individually ❌ OVERKILL

Don't do this. The 6-stage pipeline is sequential (audio → transcribe → chapters → threat → HLS → sprites). Splitting each tool into its own container adds:
- Inter-container file transfer overhead
- Orchestration complexity
- No real isolation benefit (they never run concurrently)

---

## Recommended Architecture: Rust Workspace

Structure your project as a **Cargo workspace** with a shared library:

```
sweaverV2/
├── Cargo.toml              # workspace root
├── backend/
│   ├── Cargo.toml          # depends on `shared`
│   └── src/
│       └── main.rs         # Actix-Web API
├── worker/
│   ├── Cargo.toml          # depends on `shared`
│   └── src/
│       └── main.rs         # BRPOP loop → 6-stage pipeline
└── shared/
    ├── Cargo.toml
    └── src/
        ├── lib.rs
        ├── db.rs           # Diesel models, connection
        ├── redis.rs        # Redis helpers (shared between API & worker)
        └── models.rs       # Shared types (JobList, etc.)
```

### Worker's `main.rs` (conceptual)

```rust
// Pseudocode — not runnable
fn main() {
    let redis = connect_redis();
    let db = connect_postgres();

    loop {
        // Blocking pop — waits for next job
        let job: JobList = redis.brpop("joblist");

        // Update status
        db.update_job_status(&job.job_id, "processing");

        // 6-stage pipeline
        let audio_path = extract_audio(&job.file_path);       // FFmpeg subprocess
        let transcript = transcribe(&audio_path);              // whisper-rs
        let chapters = generate_chapters(&transcript);         // TF-IDF sliding window
        let threat = detect_threats(&transcript);              // Regex + keyword scan
        let hls_output = transcode_hls(&job.file_path, &threat); // FFmpeg subprocess
        let sprites = generate_sprites(&job.file_path);        // FFmpeg subprocess

        // Upload to S3
        upload_to_s3(&job.job_id, &hls_output, &chapters, &sprites);

        // Update status
        db.update_job_status(&job.job_id, "completed");

        // Cleanup
        cleanup_local_files(&job.job_id);
    }
}
```

---

## Summary

| Decision | Recommendation |
|---|---|
| **Language** | 🦀 **Rust** — shared code, lower memory, single binary |
| **Container layout** | **Separate worker container** with FFmpeg + Whisper inside it |
| **Don't** | Run processing in the API container |
| **Don't** | Split FFmpeg and Whisper into separate containers |
| **Project structure** | Cargo workspace with `backend`, `worker`, and `shared` crates |
