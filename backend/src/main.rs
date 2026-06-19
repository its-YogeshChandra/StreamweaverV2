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

    // Clerk JWKS config — shared across all workers
    let jwks_url = env::var("CLERK_JWKS_URL").expect("CLERK_JWKS_URL not set");
    let allowed_origins: Vec<String> = env::var("ALLOWED_ORIGINS").expect("ALLOWED_ORIGINS not set").split(",").map(|s| s.to_string()).collect();
    let clerk = ClerkConfig {
        jwks_url,
        allowed_azp: allowed_origins,
        http: reqwest::Client::new(),
    };

    HttpServer::new(move ||{
        //setup basic cors — created per-worker because Cors doesn't impl Clone
        let cors_allowed_origin = env::var("ALLOWED_ORIGINS").expect("ALLOWED_ORIGIN not set");
            let cors = Cors::default()
            .allowed_origin(&cors_allowed_origin)
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
