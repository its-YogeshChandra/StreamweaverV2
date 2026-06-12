use reqwest::Client;


pub async fn get_from_media_bucket(media_url : &str, job_id : &str, destination_folder_path: &str) -> Result<(), Box<dyn std::error::Error>> {
  let client = Client::new();
  let response = client.get(media_url).send().await?;

  if !response.status().is_success() { 
    return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "Failed to download media")));
  }
  //read the response and write into destination folder 
  let media = response.bytes().await?;
  tokio::fs::write(destination_folder_path, &media).await?;
  
     Ok(())
}