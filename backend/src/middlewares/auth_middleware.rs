//work before all functions decode the user token
use crate::utilities::{decode_headers, decode_jwt};
use actix_web::{
    body::{EitherBody, MessageBody},
    dev::{ServiceRequest, ServiceResponse},
    middleware::Next,
    Error, HttpMessage, HttpResponse,
};

pub async fn decode_user<B: MessageBody + 'static>(
    req: ServiceRequest,
    next: Next<B>,
) -> Result<ServiceResponse<EitherBody<B>>, Error> {
    // extract and validate the bearer token from headers
    let headers = match decode_headers(&req) {
        Ok(h) => h,
        Err(e) => {
            let (http_req, _) = req.into_parts();
            // Return Ok so the response flows back through CORS middleware
            // which then attaches Access-Control-Allow-Origin headers
            return Ok(ServiceResponse::new(
                http_req,
                HttpResponse::Unauthorized()
                    .json(serde_json::json!({ "error": format!("Authorization failed: {}", e) })),
            )
            .map_into_right_body());
        }
    };

    // decode and verify the Clerk JWT
    let claims = match decode_jwt(headers) {
        Ok(c) => c,
        Err(e) => {
            let (http_req, _) = req.into_parts();
            return Ok(ServiceResponse::new(
                http_req,
                HttpResponse::Unauthorized()
                    .json(serde_json::json!({ "error": format!("Invalid token: {}", e) })),
            )
            .map_into_right_body());
        }
    };

    // store user claims in request extensions so handlers can access it
    req.extensions_mut().insert(claims);

    // forward to the next handler, wrap body in Left variant of EitherBody
    let res = next.call(req).await?;
    Ok(res.map_into_left_body())
}
