use actix_web::{
    post, HttpResponse, Responder
};
use actix_multipart::form::{MultipartForm, tempfile::TempFile};
use crate::database::model_functions::job_functions::Job;
use crate::establish_connection;
use uuid::Uuid;

#[derive(Debug, MultipartForm)]
pub struct UploadVideo {
    #[multipart(limit = "100mb")]
    video: TempFile,
}


#[post("/upload")]
pub async fn upload_video (MultipartForm(form): MultipartForm<UploadVideo>) -> impl Responder {

   let file_name = form.video.file_name.unwrap().to_string();
      println!("File name: {}", file_name);
   
  let destination_folder = format!("public/{}", file_name.clone());

   //write the video into the destination folder (optimise)
   form.video.file.persist(&destination_folder).unwrap(); 

   //call the establish connection(optimise)
   let mut conn = establish_connection().expect("Failed to connect to database");

   //create the job 
   let job = Job {
    id: Uuid::new_v4(),
    api_key_id: Uuid::new_v4(),
    status: "pending".to_string(),
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

//call the redis 


HttpResponse::Ok().body("Video uploaded successfully")            

}