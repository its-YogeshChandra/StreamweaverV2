//main script file 
mod utils;
use crate::utils::ffmpeg_utility::{convert_to_wav, convert_to_hls};
use crate::utils::whisper_utility::transcribe;
use shared::redis_jobs::{get_job, JobList};
fn main() {

    //connect to the database 
    let db = connect_postgres();

    //loop constantly 
    loop {
        
        // Blocking pop — waits for next job (optimize)
        let job: JobList = get_job().unwrap(); 
        
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


