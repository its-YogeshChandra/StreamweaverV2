use actix_web::{
    HttpResponse, Responder, http::StatusCode, post, web
};
use actix_multipart::form::{MultipartForm, tempfile::TempFile, text::Text};
use shared::{
    job_functions::Job,
    redis_jobs::{set_job, JobList},
    establish_connection,
};
use uuid::Uuid; 
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct RequestPayload {
    pub file_name: String,
    pub video_url: String,
    pub bitrate: String,
    pub content_length: String,
}


#[derive(Serialize)]
pub struct Response{
 job_id : String,
 status: String,
}

//have to change the controller 
//rather then multipart data use simple json data 

#[post("/upload")]
pub async fn upload_video (payload: web::Json<RequestPayload>) -> impl Responder {

   let RequestPayload { file_name, video_url, bitrate, content_length} = payload.into_inner();

   //call the establish connection(optimise)
   let mut conn = establish_connection().expect("Failed to connect to database");

   //create the job 
   let job = Job {
    id: Uuid::new_v4(),
    api_key_id: Uuid::new_v4(),
    status: "queued".to_string(),
    stage: None,
    progress: None,
    file_path: video_url,
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

    //call the redis 
    let job_list = JobList {
        job_id: db_result.id.to_string(),
        file_extension: db_result.file_path.to_string(),
        bitrate,
        content_length,
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