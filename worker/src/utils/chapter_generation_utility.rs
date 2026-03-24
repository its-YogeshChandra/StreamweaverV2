use dotenv::dotenv;
use std::env;
use reqwest::{self};
use std::time::Duration;
use serde_json::json;

//call the google api for generating the chapters out of the vtt file (audio transcript)
pub async fn generate_chapters(job_id: &str){

    //load the .env file 
    dotenv().ok();

    //get the api key from the .env file 
   let api_key = env::var("API_KEY").expect("API_KEY");

    //call the google api 
  let base_url = std::env::var("API_URL").expect("API_URL issue");
  let model_name = std::env::var("MODEL_NAME").expect("MODEL_NAME issue");
  
  //create the target url
  let target_url = format!(
    "{}{}:generateContent?key={}",
    base_url,
    model_name,
    api_key
  );
   
   //read the file for the system instruction
   let system_instruction = std::env::var("SYSTEM_PROMPT").expect("SYSTEM_PROMPT issue").to_string(); 
      
  //give the path to the output dir
  let path = "media/output/chapters";
  let output_path = format!("{}/{}.json", path, job_id);
  
  //read the content payload
   let content_payload_path = format!("media/process/transcript/{}.vtt", job_id); 
   let content_payload = std::fs::read_to_string(content_payload_path).expect("failed to read content payload");
   
   //build the http client 
   let client = reqwest::Client::builder().timeout(Duration::from_secs(60)).build().expect("failed to build http client");

   //construct the message
  let payload = json!({
    "systemInstruction": {
        "parts": [{
            "text": system_instruction
        }]
    }, 
    "contents": [{
        "parts": [{
            "text": content_payload
        }]
    }], 
    "generationConfig": {
        "response_mime_type": "application/json",
        "temperature": 0.4,
    }
  });

   //send the request to the client 
   let response = 
   client
   .post(target_url)
   .header("Content-Type", "application/json")
   .header("Authorization", format!("Bearer {}", api_key))
   .json(&payload)
   .send()
   .await
   .expect("failed to send request");

  //parse the json response 
  let response_json : serde_json::Value = response.json().await.unwrap();

  if let Some(text) = response_json["candidates"][0]["content"]["parts"][0]["text"].as_str() {
   //save the output in the output file  
    std::fs::write(output_path, text).expect("failed to write to file");
 }
  else {
  }

}