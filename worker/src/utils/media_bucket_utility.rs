//get the data from the redis client 

//download the video from media bucket 

//load the data into temp folder 

//return the essential data back 

pub async fn get_from_media_bucket(media_url : &str, job_id : &str) -> Result<(), Box<dyn std::error::Error>> {
 //get the data from the media bucket 
 let media_file = reqwest::get(media_url).await?.bytes().await?;
    Ok(())
}