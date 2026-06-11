use std::env;

//function to decode the headers 
use actix_web::{post, HttpRequest, HttpResponse};
use jsonwebtoken::{DecodingKey, Validation, decode};
use reqwest::header::Entry::Vacant;
use serde::{Deserialize, Serialize};

#[derive(Debug,Clone)]
pub struct JwtToken {
    pub value : String
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AuthVal{
    pub email:  String,
    pub password: String,
}



fn decode_headers(req: &HttpRequest) -> Result<JwtToken, String> {
    // Get the headers from the request
    let headers = req.headers();
    let auth_header = headers.get("Authorization");
    
    match auth_header {
        Some(value) => {
            if value.is_empty() {
                return Err("Authorization header is empty".to_string());
            }
            
            // Convert value to string
            let auth_str = value.to_str();

            match auth_str {
                Ok(val) => {
                    if let Some(token) = val.strip_prefix("Bearer ") {
                        let trimmed_token = token.trim();
        
                        if !trimmed_token.is_empty() {
                            // Return the safely wrapped token
                            return Ok(JwtToken { value: trimmed_token.to_string() });
                        } else {
                            return Err("Token is empty after trimming".to_string());
                        }
                    } else {
                        return Err("Invalid authorization format, missing 'Bearer ' prefix".to_string());
                    }
                }, 
                Err(error) => {
                    return Err(format!("Failed to parse header as string: {}", error));
                }
            }
        }, 
        None => {
            return Err("Authorization header not found".to_string());
        }
    }
}


pub fn decode_jwt (token : JwtToken) -> Result<AuthVal, Box<dyn std::error::Error>> {
    let key = env::var("JWT_SECRET").expect("JWT_SECRET not found");
    let decoding_key = DecodingKey::from_secret(key.as_bytes());
    let validation = Validation::default(); 

     //decode the jwt token 
    match decode::<AuthVal>(
        token.value
        , &decoding_key
        , &validation
    ) {
        Ok(token_data) => {
            println!("Token decoded successfully: {:?}", token_data);
            return Ok(token_data.claims);
        }
        Err(error) => {
            println!("Error decoding token: {:?}", error);
            return Err(Box::new(error));
        }
    };

}

