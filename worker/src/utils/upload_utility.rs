


//cloudflare r2 for the bucket  

pub async fn upload_to_cloud(job_id: &str) -> Result<(), String> {
    //get the hls output
    let hls_output_path = "media/output/video";
    let sprite_output_path = "media/output/sprites";
    let chapter_output_path = "media/output/chapters";
   
    //put the path into a vector 
    let paths = vec![hls_output_path, sprite_output_path, chapter_output_path];
    
    //load the s3 client 
    let config = aws_config::load_from_env().await;
     //create the client 
     let client = aws_sdk_s3::Client::new(&config);
    
    //loop through the vector and upload each file to the cloud
    for path in paths {
       //read the file from each path 
            //read the file whose name match the job id
       let file = tokio::fs::read_dir(path).into_iter().filter(|x| x.file_name() == job_id).next().unwrap(); 

       //upload it into the cloud 
       let result = client.complete_multipart_upload().bucket(input).send().await;
       
       //match the result 
       match result {
        Ok(_) => {
            println!("File uploaded successfully");
        }
        Err(e) => {
            println!("Error uploading file: {}", e);
        }
        }

    }

}




