


//cloudflare r2 for the bucket  
pub fn upload_to_cloud(job_id: &str) -> Result<(), String> {
    
    //get the hls output
    let hls_output_path = "media/output/video";
    let sprite_output_path = "media/output/sprites";
    let chapter_output_path = "media/output/chapters";
   
    //put the path into a vector 
    let paths = vec![hls_output_path, sprite_output_path, chapter_output_path];

    //loop through the vector and upload each file to the cloud
    for path in paths {
       //read the file from each path 
            //read the file whose name match the job id 
        

       //upload it into the cloud 
    }

}




