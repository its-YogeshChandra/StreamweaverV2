//work before all functions decode the user token
use actix_web::{HttpRequest, HttpResponse, Responder};
use crate::utilities::{decode_headers, decode_jwt, AuthVal};

pub fn decode_user (req: &HttpRequest)-> Result<AuthVal, Box<dyn std::error::Error>> {
    //call the decode header
    match decode_headers(req) {
        Ok(headers) => {
            //call decode jwt function
            let jwt = decode_jwt(headers);
            //return the user
            match jwt {
                Ok(user) => {
                 Ok(user)   
                }
                Err(error) => {
                  Err(error)  
                }
            }
             }
        Err(error) => {
            Err(error.into())
        }
    }   
    }