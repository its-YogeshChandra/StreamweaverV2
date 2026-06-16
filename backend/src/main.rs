use actix_web::{App, HttpServer, middleware::Logger, http::header, web};
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
    let clerk = ClerkConfig {
        jwks_url: "https://stirred-foxhound-51.clerk.accounts.dev/.well-known/jwks.json".to_string(),
        allowed_azp: vec![
            "http://localhost:3000".to_string(),
        ],
        http: reqwest::Client::new(),
    };

    HttpServer::new(move ||{
        //setup basic cors — created per-worker because Cors doesn't impl Clone
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
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
