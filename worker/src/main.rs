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
        generate_chapters(&job.job_id).await;   
        
        //let threat = detect_threats(&transcript);              // Regex + keyword scan
        convert_to_hls(&job.bitrate, &job.content_length, &job.job_id, &job.file_extension).unwrap(); // FFmpeg subprocess
 
        generate_sprites(&job.job_id, &job.file_extension).unwrap();        // FFmpeg subprocess

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


