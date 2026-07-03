use actix_web::{App, HttpServer, middleware::Logger, http::header, web};
use std::env;
use std::io::Result;
mod controller;
mod utilities;

use actix_cors::Cors;
use shared::establish_connection;
use crate::controller::upload_video;
use crate::utilities::ClerkConfig;

//create the actix server 
#[actix_web::main]
async fn main() -> Result<()>{

    establish_connection().expect("Failed to connect to database");

    // Clerk JWKS config
    let jwks_url = env::var("CLERK_JWKS_URL").expect("CLERK_JWKS_URL not set");
    // Single allowed origin — used for both CORS and Clerk azp
    let allowed_origin = env::var("ALLOWED_ORIGINS").expect("ALLOWED_ORIGIN not set");
    let clerk = ClerkConfig {
        jwks_url,
        allowed_azp: vec![allowed_origin.clone()],
        http: reqwest::Client::new(),
    };

    HttpServer::new(move ||{
        let cors = Cors::default()
            .allowed_origin(&allowed_origin)
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![header::AUTHORIZATION, header::CONTENT_TYPE])
            .max_age(3600);

        App::new()
        .app_data(web::Data::new(clerk.clone()))
        .wrap(Logger::default())
        .wrap(cors)
        .service(upload_video)
 //all the routes of the controller
})
.bind(("0.0.0.0", 8080))?
.run()
.await 

}
