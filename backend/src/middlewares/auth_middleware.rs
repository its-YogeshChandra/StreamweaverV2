//work before all functions decode the user token
use crate::utilities::{decode_headers, decode_jwt};
use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    error::ErrorUnauthorized,
    middleware::Next,
    Error, HttpMessage,
};

pub async fn decode_user(
    req: ServiceRequest,
    next: Next<impl MessageBody>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    //call the decode header
    match decode_headers(&req) {
        Ok(headers) => {
            //call decode jwt function
            let jwt = decode_jwt(headers);
            //return the user
            match jwt {
                Ok(user) => {
                    // store user data in request extensions so handlers can access it
                    req.extensions_mut().insert(user);
                    // forward to the next handler
                    next.call(req).await
                }
                Err(error) => {
                    Err(ErrorUnauthorized(format!("Invalid token: {}", error)))
                }
            }
        }
        Err(error) => {
            Err(ErrorUnauthorized(format!("Authorization failed: {}", error)))
        }
    }
}
