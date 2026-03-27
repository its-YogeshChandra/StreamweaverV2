//main script file 
mod utils;
use crate::utils::ffmpeg_utility::{convert_to_wav, convert_to_hls, generate_sprites};
use crate::utils::whisper_utility::transcriber;
use crate::utils::generate_chapters;
use crate::utils::upload_to_cloud;
use shared::redis_jobs::{get_job, JobList};
use shared::database::establish_connection;
use shared::Job;
use shared::UpdateJobRequest;
use uuid::Uuid;



#[::tokio::main]
async fn main() {

    //connect to the database 
    let mut db_conn = establish_connection().unwrap();

    //loop constantly 
    loop {
        
        // Blocking pop — waits for next job (optimize)
        let job: JobList = get_job().unwrap(); 
        
        // Update status
        //create the update job request payload 
        let job_id :Uuid = job.job_id.parse().unwrap(); 
        let update_job_request = UpdateJobRequest {
            job_id: job_id.clone(),
            status: "processing".to_string(),
            stage: "extracting audio".to_string(),
        };      
        Job::update_job_status(&mut db_conn, update_job_request);

        // 6-stage pipeline
        let audio_path = convert_to_wav(&job.job_id, &job.file_extension); // FFmpeg subprocess
        let transcript = transcriber(&job.job_id);  // whisper-rs
        let chapters = generate_chapters(&job.job_id);   
        
        //save threat detection for now                                     // TF-IDF sliding window
        //let threat = detect_threats(&transcript);              // Regex + keyword scan
        let hls_output = convert_to_hls(&job.bitrate, &job.content_length, &job.job_id, &job.file_extension); // FFmpeg subprocess
 
        let sprites = generate_sprites(&job.job_id, &job.file_extension);        // FFmpeg subprocess

        // Upload to S3
        upload_to_cloud(&job.job_id).await.unwrap();
       
        let job_id :Uuid = job.job_id.parse().unwrap(); 
        let update_job_request = UpdateJobRequest {
            job_id: job_id.clone(),
            status: "completed".to_string(),
            stage: "completed".to_string(),
        };     

        //update the job  
        Job::update_job_status(&mut db_conn, update_job_request);
        
        // Cleanup
        cleanup_local_files(&job.job_id);
    }
} 


