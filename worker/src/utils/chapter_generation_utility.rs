use dotenv::dotenv;
use std::env;

//call the google api for generating the chapters out of the vtt file (audio transcript)
pub fn generate_chapters(){

    //load the .env file 
    dotenv().ok();

    //get the api key from the .env file 
    let api_key = env::var("GOOGLE_API_KEY").expect("GOOGLE_API_KEY not found");

    //call the google api 
   

}