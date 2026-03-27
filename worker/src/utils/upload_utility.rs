use tokio::fs::{self, File};
use tokio::io::AsyncReadExt;
use aws_sdk_s3::primitives::ByteStream;
use dotenv::dotenv;
use std::env;

//cloudflare r2 for the bucket  
pub async fn upload_to_cloud(job_id: &str) -> Result<(), String> {
    dotenv().ok();
    
    //get the hls output
    let hls_output_path = "media/output/video";
    let sprite_output_path = "media/output/sprites";
    let chapter_output_path = "media/output/chapters";
   
    //put the path into a vector 
    let paths = vec![hls_output_path, sprite_output_path, chapter_output_path];
    
    //load the s3 client 
    let config = aws_config::load_from_env().await;
     let client = aws_sdk_s3::Client::new(&config);

    //bucket name 
    let bucket_name = env::var("BUCKET_NAME").unwrap();
    
    //loop through the vector and upload each file to the cloud
    for path in paths {
       //read the file from eacjh path 
       let mut entries = fs::read_dir(path).await.unwrap();
      
        //fix the thing
        while let Some(entry) = entries.next_entry().await.unwrap() {
        
        //entry in the entries 
        let file_path = entry.path();

        if file_path.is_file(){
            if let Some(filename) = file_path.file_name().and_then(|f| f.to_str()) {
               if filename.contains(job_id){

                //read the file 
                let mut main_file = File::open(&file_path).await.unwrap();
                let metadata = fs::metadata(&file_path).await.unwrap();

                let mut file_buffer = Vec::with_capacity(metadata.len() as usize); 
                 
                //read entire file into buffer
                main_file.read_to_end(&mut file_buffer).await.unwrap();
                let body_stream = ByteStream::from(file_buffer); 

                //construct the s3 key: job_id/category
                let s3_key = format!("{}/{}/{}", job_id, path, filename);

                //the result of the client 
                let result = client.put_object().bucket(&bucket_name).key(&s3_key).body(body_stream).send().await;

                match result {
                    Ok(value) => {
                        println!("File uploaded successfully");
                     
                    }
                    Err(e) => {
                        println!("Error uploading file: {}", e);
                    }
                }
               } 
            }
            else{
                //throw the error if no file is present 
            }
        }

 }

    }
    Ok(())
}