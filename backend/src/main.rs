use actix_web::{App, HttpServer, middleware::Logger};
use std::io::Result;
mod controller;

use crate::controller::upload_video;

//create the actix server 
#[actix_web::main]
async fn main() -> Result<()>{

HttpServer::new(||{
        App::new()
        .wrap(Logger::default())
        .service(upload_video)
 //all the routes of the controller
})
.bind(("0.0.0.0", 8080))?
.run()
.await 
}

