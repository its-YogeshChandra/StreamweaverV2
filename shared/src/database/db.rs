use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

pub fn establish_connection() -> Result<PgConnection, diesel::result::Error> {
  dotenv().ok();  
 let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
  
  let connection = PgConnection::establish(&database_url);

  Ok(connection.expect("error connecting to database"))
}
