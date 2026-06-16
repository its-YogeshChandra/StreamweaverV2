use std::env;

//function to decode the headers 
use actix_web::{dev::{ServiceRequest}};
use jsonwebtoken::{DecodingKey, Validation, Algorithm, decode, decode_header};
use serde::{Deserialize, Serialize};

#[derive(Debug,Clone)]
pub struct JwtToken {
    pub value : String
}

/// Clerk session token claims
/// Clerk uses RS256 and these are the standard claims in their session JWTs
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ClerkClaims {
    pub sub: String,           // User ID (e.g., "user_2x...")
    #[serde(default)]
    pub azp: Option<String>,   // Authorized party (your app's origin)
    pub exp: usize,            // Expiration timestamp
    pub iat: usize,            // Issued-at timestamp
    #[serde(default)]
    pub iss: Option<String>,   // Issuer (Clerk Frontend API URL)
    #[serde(default)]
    pub nbf: Option<usize>,    // Not-before timestamp
}



pub fn decode_headers(req: &ServiceRequest) -> Result<JwtToken, String> {
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


/// Decode and verify a Clerk JWT using the PEM public key from CLERK_PEM_PUBLIC_KEY env var.
/// 
/// To get your PEM public key:
/// 1. Go to Clerk Dashboard → Configure → API Keys
/// 2. Copy the PEM Public Key 
/// 3. Set it as CLERK_PEM_PUBLIC_KEY env var (keep the BEGIN/END lines)
pub fn decode_jwt(token: JwtToken) -> Result<ClerkClaims, Box<dyn std::error::Error>> {
    let pem_key = env::var("CLERK_PEM_PUBLIC_KEY")
        .map_err(|_| "CLERK_PEM_PUBLIC_KEY env var not found. Set it to your Clerk instance's PEM public key.")?;

    // Clerk uses RS256
    let decoding_key = DecodingKey::from_rsa_pem(pem_key.as_bytes())
        .map_err(|e| format!("Failed to parse PEM public key: {}", e))?;

    let mut validation = Validation::new(Algorithm::RS256);
    // Clerk tokens don't have a standard "aud" claim by default, 
    // so disable audience validation (azp is used instead)
    validation.validate_aud = false;

    match decode::<ClerkClaims>(
        &token.value,
        &decoding_key,
        &validation,
    ) {
        Ok(token_data) => {
            println!("Clerk token decoded successfully for user: {}", token_data.claims.sub);
            Ok(token_data.claims)
        }
        Err(error) => {
            println!("Error decoding Clerk token: {:?}", error);
            Err(Box::new(error))
        }
    }
}
