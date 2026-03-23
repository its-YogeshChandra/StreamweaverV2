use redis::TypedCommands;
use uuid::Uuid;
use serde::{Serialize, Deserialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct Job {
    pub job_id: String,
    pub file_path : String,
}

pub struct Response {
    pub success: bool,    
}

pub fn set_job(payload: Job) -> Response{
    let client = redis::Client::open("redis://0.0.0.0:6379/").unwrap();
    //get a conneciton from the client 
    let mut con = client.get_connection().unwrap();
    let queue_name = "joblist";
      
    //convert the struct to json string 
    let json_string = serde_json::to_string(&payload).unwrap();  
     
     //push the element to the right
     let result = con.lpush(queue_name, json_string);
     
     //match the result (optimize)
     match result{
        Ok(_)=> {
          Response {
            success: true,
          }
        },
        Err(_)=> Response {
            success: false,
        },
     }
}
