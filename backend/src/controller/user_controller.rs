use actix_web::{
    HttpResponse, Responder, http::StatusCode, post
};
use actix_multipart::form::{MultipartForm, tempfile::TempFile, text::Text};
use shared::{
    job_functions::Job,
    redis_jobs::{set_job, JobList},
    establish_connection,
};
use uuid::Uuid; 
use serde::Serialize;

#[derive(Debug, MultipartForm)]
pub struct UploadVideo {
    #[multipart(limit = "100mb")]
    video: TempFile,
    bitrate: Text<String>,
    content_length: Text<String>,
}

#[derive(Serialize)]
pub struct Response{
 job_id : String,
 status: String,
}



#[post("/upload")]
pub async fn upload_video (MultipartForm(form): MultipartForm<UploadVideo>) -> impl Responder {

   let file_name = form.video.file_name.unwrap().to_string();
      println!("File name: {}", file_name);
   
  let destination_folder = format!("../media/input/{}", file_name.clone());

   //write the video into the destination folder (optimise)
   form.video.file.persist(&destination_folder).unwrap(); 

   //call the establish connection(optimise)
   let mut conn = establish_connection().expect("Failed to connect to database");

   //create the job 
   let job = Job {
    id: Uuid::new_v4(),
    api_key_id: Uuid::new_v4(),
    status: "queued".to_string(),
    stage: None,
    progress: None,
    file_path: destination_folder,
    file_size: None,
    original_name: Some(file_name),
    threat_level: None,
    output_urls: None,
    metadata: None,
    error_message: None,
    created_at: None,
    updated_at: None,
   };

    //call the database function (optimise)
    let db_result = Job::create(&mut conn, &job).unwrap();

    println!("db_result: {}", db_result.file_path); 
    
    //update the name of the video to the id from the database
     //read the extension of the file
    let extension = db_result.file_path.split('.').last().unwrap();
    let new_file_path = format!("..media/input/{}.{}", db_result.id.to_string(), extension);
    std::fs::rename(&db_result.file_path, &new_file_path).unwrap();

    //call the redis 
    let job_list = JobList {
        job_id: db_result.id.to_string(),
        file_extension: extension.to_string(),
        bitrate: form.bitrate.to_string(),
        content_length: form.content_length.to_string(),
    };

    let redis_result = set_job(job_list);

    if redis_result.success == true {

    let response_payload = Response {
        job_id: db_result.id.to_string(),
        status: "pending".to_string(),
    };
    HttpResponse::Ok().status(StatusCode::from_u16(202).unwrap()).json(response_payload)            
    }else {
        HttpResponse::InternalServerError().body("Failed to upload video")
    }

}