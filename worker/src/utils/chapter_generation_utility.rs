use dotenv::dotenv;
use std::env;
use reqwest::{self};
use std::time::Duration;
use serde_json::json;

//call the google api for generating the chapters out of the vtt file (audio transcript)
pub async fn generate_chapters(job_id: &str) -> Result<(), String> {

    //load the .env file 
    dotenv().ok();

    //get the api key from the .env file 
   let api_key = env::var("API_KEY").map_err(|_| "API_KEY not set".to_string())?;

    //call the google api 
  let base_url = std::env::var("API_URL").map_err(|_| "API_URL not set".to_string())?;
  let model_name = std::env::var("MODEL_NAME").map_err(|_| "MODEL_NAME not set".to_string())?;
  
  //create the target url
  let target_url = format!(
    "{}{}:generateContent?key={}",
    base_url,
    model_name,
    api_key
  );
   
   //read the file for the system instruction
   let system_instruction = std::fs::read_to_string("../config/chapter_system_prompt.txt")
       .map_err(|e| format!("failed to read chapter_system_prompt.txt: {}", e))?;
      
  //give the path to the output dir
  let path = "../media/output/chapters";
  std::fs::create_dir_all(path).map_err(|e| format!("failed to create output/chapters directory: {}", e))?;
  let output_path = format!("{}/{}.text", path, job_id);
  
  //read the content payload
   let content_payload_path = format!("../media/processing/transcript/{}.vtt", job_id); 
   let content_payload = std::fs::read_to_string(&content_payload_path)
       .map_err(|e| format!("failed to read VTT file {}: {}", content_payload_path, e))?;
   
   //build the http client 
   let client = reqwest::Client::builder()
       .timeout(Duration::from_secs(60))
       .build()
       .map_err(|e| format!("failed to build http client: {}", e))?;

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
        "response_mime_type": "text/plain",
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
   .map_err(|e| format!("Gemini request failed: {}", e))?;

  //parse the json response
  let response_json: serde_json::Value = response
      .json()
      .await
      .map_err(|e| format!("failed to parse Gemini response: {}", e))?;

  if let Some(text) = response_json["candidates"][0]["content"]["parts"][0]["text"].as_str() {
      //save the output in the output file
      std::fs::write(&output_path, text)
          .map_err(|e| format!("failed to write chapters to {}: {}", output_path, e))?;
      println!("chapters saved to {}", output_path);
  } else {
      // Print the full response so you can debug what Gemini actually returned
      eprintln!("[chapter_generation] unexpected Gemini response structure for job {}:", job_id);
      eprintln!("{}", serde_json::to_string_pretty(&response_json).unwrap_or_else(|_| response_json.to_string()));
      return Err(format!("Gemini did not return expected text field for job {}", job_id));
  }

  Ok(())

}