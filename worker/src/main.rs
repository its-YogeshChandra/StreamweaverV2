mod utils;
//import the functions from the utils module
use crate::utils::ffmpeg_utility::{convert_to_wav, convert_to_hls, generate_sprites};
use crate::utils::whisper_utility::transcriber;
use crate::utils::generate_chapters;
use crate::utils::upload_to_cloud;
use crate::utils::file_cleaner_utility;
use crate::utils::media_bucket_utility::get_from_media_bucket;
use crate::utils::aes_utility::generate_aes_key;
use shared::redis_jobs::{get_job, JobList};
use shared::database::establish_connection;
use shared::Job;
use shared::UpdateJobRequest;
use uuid::Uuid;
use tokio;
use shared::{JobEvent, get_client, publish_job_event};

/// Publish a job event to Redis pub/sub. Errors are logged, never propagated.
async fn emit_event(job_id: &str, stage: &str, branch: &str, level: &str) {
    let client = get_client();
    let event = JobEvent::new(
        job_id.to_string(),
        stage.to_string(),
        branch.to_string(),
        level.to_string(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs(),
    );
    if let Err(e) = publish_job_event(client, event).await {
        eprintln!("[event] Failed to publish job event: {:?}", e);
    }
}

#[::tokio::main]
async fn main() -> std::io::Result<()>{

    //loop constantly
    loop {
     //connect to the database
        let mut db_conn = establish_connection()
            .map_err(|_| std::io::Error::new(std::io::ErrorKind::Other, "Failed to connect to database"))?;

        // Blocking pop — waits for next job
        let job: JobList = match get_job(){
            Some(job) => job,
            None => {
                continue;
            }
        };

        // ── Event: Job picked ──
        emit_event(&job.job_id, "job picked", "main", "info").await;
        
        // Update status to processing
        let job_id: Uuid = job.job_id.parse().expect("Failed to parse job_id to uuid");
        let update_job_request = UpdateJobRequest {
            job_id: job_id.clone(),
            status: "processing".to_string(),
            stage: "downloading media".to_string(),
        };

        Job::update_job_status(&mut db_conn, update_job_request)
            .map_err(|e| {
                eprintln!("[main] Failed to update job status: {:?}", e);
                std::io::Error::new(std::io::ErrorKind::Other, format!("Failed to update job status: {}", e))
            })?;

        // ── Event: Downloading media ──
        emit_event(&job.job_id, "downloading media", "main", "info").await;

        // ── Download from media bucket ──
        // Save to ../media/input/{job_id}.{ext} — this is where both branches expect the file
        let input_file_path = format!("../media/input/{}.{}", &job.job_id, &job.file_extension);

        // create the input directory if it doesn't exist
        std::fs::create_dir_all("../media/input")
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, format!("Failed to create input dir: {}", e)))?;

        match get_from_media_bucket(&job.video_url, &job.job_id, &input_file_path).await {
            Ok(_) => {
                println!("[main] media downloaded to {}", &input_file_path);
                emit_event(&job.job_id, "media downloaded", "main", "info").await;
            }
            Err(e) => {
                eprintln!("[main] Failed to download media for job {}: {}", &job.job_id, e);
                // Mark job as failed and skip to next job
                let update_failed = UpdateJobRequest {
                    job_id: job_id.clone(),
                    status: "failed".to_string(),
                    stage: "download failed".to_string(),
                };
                let _ = Job::update_job_status(&mut db_conn, update_failed);
                emit_event(&job.job_id, "download failed", "main", "error").await;
                continue;
            }
        };

        // ──────────────────────────────────────────────────────────
        //  PARALLEL PIPELINE
        //
        //  Branch A (audio):  WAV extract → Whisper → Chapters
        //  Branch B (video):  AES key gen → HLS (encrypted) + Sprites/VTT
        //
        //  These two branches have zero dependency on each other.
        //  They run concurrently and we wait for both to finish.
        // ──────────────────────────────────────────────────────────

        // ── Branch A: Audio pipeline (async) ──
        let audio_job_id = job.job_id.clone();
        let audio_file_ext = job.file_extension.clone();
        let audio_input = input_file_path.clone();

        let audio_handle = tokio::spawn(async move {
            // Step 1: Extract audio to WAV
            println!("[audio] starting WAV extraction for job {}", &audio_job_id);
            emit_event(&audio_job_id, "wav extraction started", "audio", "info").await;
            let wav_result = tokio::task::spawn_blocking({
                let jid = audio_job_id.clone();
                let input = audio_input.clone();
                move || convert_to_wav(&jid, &audio_file_ext, &input)
            }).await;

            match wav_result {
                Ok(Ok(_)) => {
                    println!("[audio] WAV extraction complete for job {}", &audio_job_id);
                    emit_event(&audio_job_id, "wav extraction complete", "audio", "info").await;
                }
                Ok(Err(e)) => {
                    eprintln!("[audio] WAV extraction failed for job {}: {}", &audio_job_id, e);
                    emit_event(&audio_job_id, "wav extraction failed", "audio", "error").await;
                    return;
                }
                Err(e) => {
                    eprintln!("[audio] WAV extraction task panicked for job {}: {}", &audio_job_id, e);
                    emit_event(&audio_job_id, "wav extraction panicked", "audio", "error").await;
                    return;
                }
            }

            // Step 2: Transcribe with Whisper
            println!("[audio] starting transcription for job {}", &audio_job_id);
            emit_event(&audio_job_id, "transcription started", "audio", "info").await;
            match transcriber(&audio_job_id).await {
                Ok(_) => {
                    println!("[audio] transcription complete for job {}", &audio_job_id);
                    emit_event(&audio_job_id, "transcription complete", "audio", "info").await;
                }
                Err(e) => {
                    eprintln!("[audio] transcription failed for job {}: {}", &audio_job_id, e);
                    emit_event(&audio_job_id, "transcription failed", "audio", "error").await;
                    return;
                }
            }

            // Step 3: Generate chapters with Gemini
            println!("[audio] starting chapter generation for job {}", &audio_job_id);
            emit_event(&audio_job_id, "chapter generation started", "audio", "info").await;
            match generate_chapters(&audio_job_id).await {
                Ok(_) => {
                    println!("[audio] chapter generation complete for job {}", &audio_job_id);
                    emit_event(&audio_job_id, "chapter generation complete", "audio", "info").await;
                }
                Err(e) => {
                    eprintln!("[audio] chapter generation failed for job {}: {}", &audio_job_id, e);
                    emit_event(&audio_job_id, "chapter generation failed", "audio", "warning").await;
                    // chapters are non-critical, don't return early
                }
            }

            emit_event(&audio_job_id, "audio pipeline complete", "audio", "info").await;
        });

        // ── Branch B: Video pipeline (AES → HLS + Sprites in parallel) ──
        let video_job_id = job.job_id.clone();
        let video_job_id2 = job.job_id.clone();
        let video_file_ext = job.file_extension.clone();
        let video_file_ext2 = job.file_extension.clone();
        let video_bitrate = job.bitrate.clone();
        let video_content_length = job.content_length.clone();

        let video_handle = tokio::spawn(async move {
            // Step 1: Generate AES encryption key (synchronous, fast)
            println!("[video] generating AES key for job {}", &video_job_id);
            emit_event(&video_job_id, "aes key generation started", "video", "info").await;
            let keyinfo_path = match generate_aes_key(&video_job_id) {
                Ok(result) => {
                    println!("[video] AES key ready for job {}", &video_job_id);
                    emit_event(&video_job_id, "aes key ready", "video", "info").await;
                    result.keyinfo_path
                }
                Err(e) => {
                    eprintln!("[video] AES key generation failed for job {}: {}", &video_job_id, e);
                    emit_event(&video_job_id, "aes key generation failed", "video", "error").await;
                    return;
                }
            };

            // Step 2: HLS transcode (with encryption) and Sprite generation run in parallel
            let hls_job_id = video_job_id.clone();
            let hls_file_ext = video_file_ext.clone();
            let hls_keyinfo = keyinfo_path.clone();

            emit_event(&video_job_id, "hls transcode started", "video", "info").await;
            emit_event(&video_job_id, "sprite generation started", "video", "info").await;

            let hls_handle = tokio::task::spawn_blocking(move || {
                println!("[video] starting encrypted HLS transcode for job {}", &hls_job_id);
                convert_to_hls(
                    &video_bitrate,
                    &video_content_length,
                    &hls_job_id,
                    &hls_file_ext,
                    &hls_keyinfo,
                )
            });

            let sprite_handle = tokio::task::spawn_blocking(move || {
                println!("[video] starting sprite + VTT generation for job {}", &video_job_id2);
                generate_sprites(&video_job_id2, &video_file_ext2)
            });

            // Wait for both HLS and sprites to finish
            let (hls_result, sprite_result) = tokio::join!(hls_handle, sprite_handle);

            // Check HLS result
            match hls_result {
                Ok(Ok(_)) => {
                    println!("[video] HLS transcode complete for job {}", &video_job_id);
                    emit_event(&video_job_id, "hls transcode complete", "video", "info").await;
                }
                Ok(Err(e)) => {
                    eprintln!("[video] HLS transcode failed for job {}: {}", &video_job_id, e);
                    emit_event(&video_job_id, "hls transcode failed", "video", "error").await;
                }
                Err(e) => {
                    eprintln!("[video] HLS transcode task panicked for job {}: {}", &video_job_id, e);
                    emit_event(&video_job_id, "hls transcode panicked", "video", "error").await;
                }
            }

            // Check sprite result
            match sprite_result {
                Ok(Ok(_)) => {
                    println!("[video] sprite + VTT generation complete for job {}", &video_job_id);
                    emit_event(&video_job_id, "sprite generation complete", "video", "info").await;
                }
                Ok(Err(e)) => {
                    eprintln!("[video] sprite generation failed for job {}: {}", &video_job_id, e);
                    emit_event(&video_job_id, "sprite generation failed", "video", "error").await;
                }
                Err(e) => {
                    eprintln!("[video] sprite task panicked for job {}: {}", &video_job_id, e);
                    emit_event(&video_job_id, "sprite generation panicked", "video", "error").await;
                }
            }

            emit_event(&video_job_id, "video pipeline complete", "video", "info").await;
        });

        // ── Wait for both branches to complete ──
        let (audio_result, video_result) = tokio::join!(audio_handle, video_handle);

        // Log any task-level errors (panics)
        if let Err(e) = audio_result {
            eprintln!("[main] audio pipeline panicked for job {}: {}", &job.job_id, e);
        }
        if let Err(e) = video_result {
            eprintln!("[main] video pipeline panicked for job {}: {}", &job.job_id, e);
        }

        // ── Upload all outputs to R2 ──
        emit_event(&job.job_id, "uploading to cloud", "main", "info").await;
        println!("[main] uploading outputs for job {}", &job.job_id);
        match upload_to_cloud(&job.job_id).await {
            Ok(_) => {
                println!("[main] upload complete for job {}", &job.job_id);
                emit_event(&job.job_id, "upload complete", "main", "info").await;
            }
            Err(e) => {
                eprintln!("[main] upload failed for job {}: {}", &job.job_id, e);
                emit_event(&job.job_id, "upload failed", "main", "error").await;
            }
        }

        // ── Update job status to completed ──
        let job_id: Uuid = job.job_id.parse()
            .map_err(|_| std::io::Error::new(std::io::ErrorKind::Other, "Failed to parse job_id to uuid"))?;
        let update_job_request = UpdateJobRequest {
            job_id: job_id.clone(),
            status: "completed".to_string(),
            stage: "completed".to_string(),
        };

        Job::update_job_status(&mut db_conn, update_job_request)
            .map_err(|_| std::io::Error::new(std::io::ErrorKind::Other, "Failed to update job status"))?;

        // ── Cleanup local files ──
        match file_cleaner_utility(&job.job_id).await {
            Ok(_) => {
                println!("[main] cleanup complete for job {}", &job.job_id);
            }
            Err(e) => {
                eprintln!("[main] Failed to cleanup files: {}", e);
            }
        };

        emit_event(&job.job_id, "job completed", "main", "info").await;
        println!("[main] ✓ job {} fully processed", &job.job_id);
    }
}
