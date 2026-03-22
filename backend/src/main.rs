use actix_web::{App, HttpServer, middleware::Logger};
use std::io::Result;


//create the actix server 
#[actix_web::main]
async fn main() -> Result<()>{

HttpServer::new(||{
        App::new()
        .wrap(Logger::default())
 //all the routes of the controller
})
.bind(("0.0.0.0", 8080))?
.run()
.await 
}

