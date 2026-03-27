//utility function to clear the local files
use dotenv::dotenv;
use tokio::fs::{self, File};

pub async fn file_cleaner_utility(job_id: &str) -> Result<(), String> {
    dotenv().ok();
    
    //get the hls output
    let hls_output_path = "media/output/video";
    let sprite_output_path = "media/output/sprites";
    let chapter_output_path = "media/output/chapters";
   
    //put the path into a vector 
    let paths = vec![hls_output_path, sprite_output_path, chapter_output_path];
    
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
                //remove the file from the dir 
                fs::remove_file(&file_path).await.unwrap();

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
