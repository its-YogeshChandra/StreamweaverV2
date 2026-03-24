use dotenv::dotenv;
use std::env;
use reqwest::{self};
use std::time::Duration;

//call the google api for generating the chapters out of the vtt file (audio transcript)
pub async fn generate_chapters(){

    //load the .env file 
    dotenv().ok();

    //get the api key from the .env file 
    let api_key = env::var("API_KEY").expect("API_KEY");

    //call the google api 
  let base_url = std::env::var("API_URL").expect("API_URL issue"); 
  
   //build the http client 
   let client = reqwest::Client::builder().timeout(Duration::from_secs(60)).build().expect("failed to build http client");

   //construct the message
   
  //have to give the model name 
  let model_name = "gemini-2.5-flash";

   //send the request to the client 
   let response = 
   client
   .post(base_url)
   .header("Content-Type", "application/json")
   .header("Authorization", format!("Bearer {}", api_key))
   .json(&payload)
   .send()
   .await
   .expect("failed to send request");

   
}