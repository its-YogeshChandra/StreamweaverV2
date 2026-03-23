use redis::TypedCommands;
use serde::{Serialize, Deserialize};

//can put the optimize things into one section 
#[derive(Deserialize, Serialize, Debug)]
pub struct JobList {
    pub job_id: String,
    pub file_path : String,
}

pub struct RedisResponse {
    pub success: bool,    
}

pub fn set_job(payload: JobList) -> RedisResponse{
    let client = redis::Client::open("redis://127.0.0.1:6379/").unwrap();
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
          RedisResponse {
            success: true,
          }
        },
        Err(_)=> RedisResponse {
            success: false,
        },
     }
}

pub fn get_job() -> Option<JobList> {
    let client = redis::Client::open("redis://127.0.0.1:6379/").unwrap();
    let mut con = client.get_connection().unwrap();
    let queue_name = "joblist";

    // Blocking pop from the right (FIFO order with LPUSH)
    let result: redis::RedisResult<(String, String)> = redis::cmd("BRPOP")
        .arg(queue_name)
        .arg(0) // 0 = block indefinitely
        .query(&mut con);

    match result {
        Ok((_key, value)) => {
            let job: JobList = serde_json::from_str(&value).unwrap();
            Some(job)
        },
        Err(_) => None,
    }
}
