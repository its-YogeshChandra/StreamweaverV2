# worker/Dockerfile — Multi-stage Rust build for worker
# Heaviest container: includes ffmpeg, openssl, libpq

# ---- Stage 1: Builder ----
FROM rust:1.91.1-bookworm AS builder

#working dir 
WORKDIR /app

# ── Dependency caching layer ──────────────────────────────────
# Copy only the Cargo manifests (workspace + each member)
COPY Cargo.toml Cargo.lock ./
COPY worker/Cargo.toml worker/Cargo.toml
COPY backend/Cargo.toml backend/Cargo.toml
COPY shared/Cargo.toml shared/Cargo.toml
COPY tests/Cargo.toml tests/Cargo.toml

# Create dummy/stub source files so `cargo build` can resolve
# the workspace and compile all *dependencies* without real code
RUN mkdir -p worker/src backend/src shared/src tests/src \
    && echo "fn main() {}" > worker/src/main.rs \
    && echo "fn main() {}" > backend/src/main.rs \
    && echo "" > shared/src/lib.rs \
    && echo "" > tests/src/lib.rs

# Build all dependencies (this layer is cached until Cargo.toml/lock change)
RUN cargo build --release -p worker

# Remove the dummy source files and compiled stubs (keep dep artifacts)
RUN rm -rf worker/src backend/src shared/src tests/src

# ── Real source build ─────────────────────────────────────────
# Copy the actual source code
COPY worker/ worker/
COPY shared/ shared/
COPY backend/ backend/
COPY tests/ tests/

# Touch the source files so Cargo knows they're newer than the stubs
RUN touch worker/src/main.rs shared/src/lib.rs

# Build the real worker binary (only your code recompiles, deps are cached)
RUN cargo build --release -p worker


# ---- Stage 2: Runtime ----
FROM debian:bookworm AS runtime

# Install runtime dependencies:
#   - ffmpeg:          WAV extraction, HLS transcode, sprite generation (includes ffprobe)
#   - openssl:         AES-128 key generation via `openssl rand`
#   - libpq5:          required by Diesel for PostgreSQL connections
#   - ca-certificates: required for HTTPS (Gemini API, Cloudflare R2, Whisper server)
RUN apt-get update && apt-get install -y --no-install-recommends \
  ffmpeg \
  openssl \
  libpq5 \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
# (adds defense-in-depth inside the container)
RUN useradd --create-home --shell /bin/bash appuser

# Set working dir — the worker binary uses relative paths like
# ../media/ and ../config/, so WORKDIR must be /app/worker
WORKDIR /app/worker

# Copy the compiled worker binary from builder
COPY --from=builder /app/target/release/worker ./worker

# Copy the system prompt used by chapter generation
COPY config/chapter_system_prompt.txt /app/config/chapter_system_prompt.txt

# Create the media directory structure at /app/media/
# (the worker accesses these via ../media/ relative paths from /app/worker/)
# In production, /app/media is a named volume mount from docker-compose
RUN mkdir -p /app/media/input \
             /app/media/processing/audio \
             /app/media/processing/transcript \
             /app/media/output/playlist \
             /app/media/output/sprites \
             /app/media/output/chapters

# Set ownership of app directories to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Run the worker (no port exposed — worker pulls jobs from Redis)
CMD ["./worker"]
