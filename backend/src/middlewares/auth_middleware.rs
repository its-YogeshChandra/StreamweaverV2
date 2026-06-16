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
    // extract and validate the bearer token from headers
    let headers = decode_headers(&req)
        .map_err(|e| ErrorUnauthorized(format!("Authorization failed: {}", e)))?;

    // decode and verify the Clerk JWT
    let claims = decode_jwt(headers)
        .map_err(|e| ErrorUnauthorized(format!("Invalid token: {}", e)))?;

    // store user claims in request extensions so handlers can access it
    req.extensions_mut().insert(claims);

    // forward to the next handler
    next.call(req).await
}
