use actix_web::{App, HttpServer, middleware::{Logger, from_fn}};
use std::io::Result;
mod controller;
mod utilities;
mod middlewares;

use shared::establish_connection;
use crate::controller::upload_video;
use middlewares::decode_user;

//create the actix server 
#[actix_web::main]
async fn main() -> Result<()>{

establish_connection().expect("Failed to connect to database");

HttpServer::new(||{
        App::new()
        .wrap(Logger::default())
        .wrap(from_fn(decode_user))
        .service(upload_video)
 //all the routes of the controller
})
.bind(("0.0.0.0", 8080))?
.run()
.await 

}

