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

        // Update status to processing
        let job_id: Uuid = job.job_id.parse().expect("Failed to parse job_id to uuid");
        let update_job_request = UpdateJobRequest {
            job_id: job_id.clone(),
            status: "processing".to_string(),
            stage: "downloading media".to_string(),
        };

        Job::update_job_status(&mut db_conn, update_job_request)
            .map_err(|_| std::io::Error::new(std::io::ErrorKind::Other, "Failed to update job status"))?;

        // Download from media bucket
        let destination_folder = format!("./temp_media/{}", &job.job_id);
        match get_from_media_bucket(&job.file_extension, &job.job_id, &destination_folder).await {
            Ok(_) => {
                println!("[main] media downloaded for job {}", &job.job_id);
            }
            Err(e) => {
                eprintln!("[main] Failed to get media from bucket: {}", e);
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
        let audio_dest = destination_folder.clone();

        let audio_handle = tokio::spawn(async move {
            // Step 1: Extract audio to WAV
            println!("[audio] starting WAV extraction for job {}", &audio_job_id);
            let wav_result = tokio::task::spawn_blocking({
                let jid = audio_job_id.clone();
                let dest = audio_dest.clone();
                move || convert_to_wav(&jid, &audio_file_ext, &dest)
            }).await;

            match wav_result {
                Ok(Ok(_)) => {
                    println!("[audio] WAV extraction complete for job {}", &audio_job_id);
                }
                Ok(Err(e)) => {
                    eprintln!("[audio] WAV extraction failed for job {}: {}", &audio_job_id, e);
                    return;
                }
                Err(e) => {
                    eprintln!("[audio] WAV extraction task panicked for job {}: {}", &audio_job_id, e);
                    return;
                }
            }

            // Step 2: Transcribe with Whisper
            println!("[audio] starting transcription for job {}", &audio_job_id);
            match transcriber(&audio_job_id).await {
                Ok(_) => {
                    println!("[audio] transcription complete for job {}", &audio_job_id);
                }
                Err(e) => {
                    eprintln!("[audio] transcription failed for job {}: {}", &audio_job_id, e);
                    return;
                }
            }

            // Step 3: Generate chapters with Gemini
            println!("[audio] starting chapter generation for job {}", &audio_job_id);
            match generate_chapters(&audio_job_id).await {
                Ok(_) => {
                    println!("[audio] chapter generation complete for job {}", &audio_job_id);
                }
                Err(e) => {
                    eprintln!("[audio] chapter generation failed for job {}: {}", &audio_job_id, e);
                    // chapters are non-critical, don't return early
                }
            }
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
            let keyinfo_path = match generate_aes_key(&video_job_id) {
                Ok(result) => {
                    println!("[video] AES key ready for job {}", &video_job_id);
                    result.keyinfo_path
                }
                Err(e) => {
                    eprintln!("[video] AES key generation failed for job {}: {}", &video_job_id, e);
                    return;
                }
            };

            // Step 2: HLS transcode (with encryption) and Sprite generation run in parallel
            let hls_job_id = video_job_id.clone();
            let hls_file_ext = video_file_ext.clone();
            let hls_keyinfo = keyinfo_path.clone();

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
                }
                Ok(Err(e)) => {
                    eprintln!("[video] HLS transcode failed for job {}: {}", &video_job_id, e);
                }
                Err(e) => {
                    eprintln!("[video] HLS transcode task panicked for job {}: {}", &video_job_id, e);
                }
            }

            // Check sprite result
            match sprite_result {
                Ok(Ok(_)) => {
                    println!("[video] sprite + VTT generation complete for job {}", &video_job_id);
                }
                Ok(Err(e)) => {
                    eprintln!("[video] sprite generation failed for job {}: {}", &video_job_id, e);
                }
                Err(e) => {
                    eprintln!("[video] sprite task panicked for job {}: {}", &video_job_id, e);
                }
            }
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
        println!("[main] uploading outputs for job {}", &job.job_id);
        match upload_to_cloud(&job.job_id).await {
            Ok(_) => {
                println!("[main] upload complete for job {}", &job.job_id);
            }
            Err(e) => {
                eprintln!("[main] upload failed for job {}: {}", &job.job_id, e);
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

        println!("[main] ✓ job {} fully processed", &job.job_id);
    }
}
