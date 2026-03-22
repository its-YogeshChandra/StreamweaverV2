use actix_web::{
    web, get, post, HttpResponse, Responder
};
use actix_multipart::form::{json::Json as MpJson, tempfile::TempFile, MultipartForm};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Metadata {
    name: String,
}


#[derive(Debug, MultipartForm)]
struct UploadVideo {
    #[multipart(content_type = "video")]
    #[multipart(limit = "100mb")]
    video: TempFile,
   json_data: MpJson<Metadata> 
}


#[post("/upload")]
async fn upload_video (MultipartForm(form): MultipartForm<UploadVideo>) -> impl Responder {
    //check for the video file 
    let file = form.video;
    let file_name = form.json_data.name;

    //write this video in to the public folder
    let file_path = format!("public/{}", file_name);
    file.write_to(&file_path).await.unwrap();
    
    

    //create the controller for video upload 
    HttpResponse::Ok().body("Hello World")
}