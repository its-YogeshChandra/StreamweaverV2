use actix_web::{
    post, HttpResponse, Responder
};
use actix_multipart::form::{MultipartForm, tempfile::TempFile, text::Text};

#[derive(Debug, MultipartForm)]
pub struct UploadVideo {
    #[multipart(limit = "100mb")]
    video: TempFile,
}


#[post("/upload")]
pub async fn upload_video (MultipartForm(form): MultipartForm<UploadVideo>) -> impl Responder {


   let file_name = form.video.file_name.unwrap().to_string();
      println!("File name: {}", file_name);
   
  let destination_folder = format!("public/{}", file_name);

   //write the video into the destination folder 
   form.video.file.persist(&destination_folder).unwrap(); 

HttpResponse::Ok().body("Video uploaded successfully")            
        //create the controller for video upload 
}