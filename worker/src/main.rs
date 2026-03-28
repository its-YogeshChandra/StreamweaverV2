mod utils;
//import the functions from the utils module 
use crate::utils::ffmpeg_utility::{convert_to_wav, convert_to_hls, generate_sprites};
use crate::utils::whisper_utility::transcriber;
use crate::utils::generate_chapters;
use crate::utils::upload_to_cloud;
use crate::utils::file_cleaner_utility;
use shared::redis_jobs::{get_job, JobList};
use shared::database::establish_connection;
use shared::Job;
use shared::UpdateJobRequest;
use uuid::Uuid;
use tokio;


#[::tokio::main]
async fn main() {

    //loop constantly 
    loop {
     //connect to the database 
        let mut db_conn = establish_connection().unwrap();
   
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

        Job::update_job_status(&mut db_conn, update_job_request).unwrap();
        
        // 6-stage pipeline
        convert_to_wav(&job.job_id, &job.file_extension).unwrap(); // FFmpeg subprocess
        transcriber(&job.job_id).await.unwrap();  // whisper-server HTTP call
        if let Err(e) = generate_chapters(&job.job_id).await {
            eprintln!("[main] chapter generation failed for job {}: {}", &job.job_id, e);
        }
        
        //set the system for multiple job id and file extension (not optimal approach but it works)
        let job_id_clone = job.job_id.clone();
        let job_id_clone2 = job.job_id.clone();
        let file_extension_clone = job.file_extension.clone();
        let file_extension_clone2 = job.file_extension.clone();


        //let threat = detect_threats(&transcript);              // Regex + keyword scan
      let hls_handle = tokio::task::spawn_blocking(move || convert_to_hls(&job.bitrate, &job.content_length, &job_id_clone, &file_extension_clone).unwrap()); // FFmpeg subprocess
 
        let sprite_handle = tokio::task::spawn_blocking(move || generate_sprites(&job_id_clone2, &file_extension_clone2).unwrap()); // FFmpeg subprocess
        
        let (hls_result , sprite_result) = tokio::join!(hls_handle, sprite_handle);

        //check if the hls_result or sprite_result is error
        if hls_result.is_err() {
            eprintln!("[main] hls conversion failed for job {}: {}", &job.job_id, hls_result.err().unwrap());
        }
        if sprite_result.is_err() {
            eprintln!("[main] sprite generation failed for job {}: {}", &job.job_id, sprite_result.err().unwrap());
        }

        // Upload to S3
        upload_to_cloud(&job.job_id).await.unwrap();
        let job_id :Uuid = job.job_id.parse().unwrap(); 
        let update_job_request = UpdateJobRequest {
            job_id: job_id.clone(),
            status: "completed".to_string(),
            stage: "completed".to_string(),
        };     

        //update the job  
        Job::update_job_status(&mut db_conn, update_job_request).unwrap();
        
        // Cleanup
        file_cleaner_utility(&job.job_id).await.unwrap();
    }
} 


