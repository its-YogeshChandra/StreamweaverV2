use actix_web::{App, HttpServer, middleware::{Logger, from_fn}, http::header};
use std::io::Result;
mod controller;
mod utilities;
mod middlewares;

use actix_cors::Cors;
use shared::establish_connection;
use crate::controller::upload_video;
use middlewares::decode_user;


//create the actix server 
#[actix_web::main]
async fn main() -> Result<()>{

    establish_connection().expect("Failed to connect to database");

    HttpServer::new(||{
        //setup basic cors — created per-worker because Cors doesn't impl Clone
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![header::AUTHORIZATION, header::CONTENT_TYPE])
            .max_age(3600);

        App::new()
        .wrap(Logger::default())
        .wrap(from_fn(decode_user))
        .wrap(cors)
        .service(upload_video)

 //all the routes of the controller
})
.bind(("0.0.0.0", 8080))?
.run()
.await 

}

