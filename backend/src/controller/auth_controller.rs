//function to decode the headers 
use actix_web::{post, HttpRequest, HttpResponse};
use jsonwebtoken::{decode};

#[derive(Debug,Clone)]
pub struct JwtToken {
    pub value : String
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