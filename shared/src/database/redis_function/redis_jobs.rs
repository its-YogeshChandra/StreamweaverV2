use redis::{AsyncCommands, ErrorKind::{Client, InvalidClientConfig}, TypedCommands};
use serde::{Serialize, Deserialize};
use std::env;
use tokio::sync::broadcast;
use futures::StreamExt;

//can put the optimize things into one section 
#[derive(Deserialize, Serialize, Debug)]
pub struct JobList {
    pub job_id: String,
    pub file_extension: String,
    pub video_url: String,
    pub bitrate: String,
    pub content_length: String,
}

//for broadcasting purposes

//struct creation
#[derive(Deserialize, Serialize, Debug)] 
pub struct JobEvent {
 pub job_id: String, 
 pub stage: String, 
 pub branch: String,
 pub level : String,
 pub timestamp: u64, 
}


impl JobEvent {
    
    pub fn new(job_id: String, stage: String, branch: String, level: String, timestamp: u64) -> Self {
        JobEvent {
            job_id,
            stage,
            branch,
            level,
            timestamp,
        }
    }

    pub async fn publish_job_event(&self, client: redis::Client, job_event: JobEvent) -> redis::RedisResult<()> {
        //get a conneciton from the client 
        let mut con = client.get_multiplexed_async_connection().await?;

        //publish the event : 

        //createe event string (payload should be in string format)
        let event_string = serde_json::to_string(&job_event).unwrap();
        
        //call the publish function 
        let _: () = con.publish("job_events", event_string).await?;
        
        Ok(())
    }
}



pub async fn subscribe_and_relay (client: redis::Client, tx:broadcast::Sender<JobEvent>) -> redis::RedisResult<()>{
    // now we can receive messages on `sub` from any publisher

    let mut pubsub = client.get_async_pubsub().await?;
    pubsub.subscribe("job_events").await?;

    let mut stream_value = pubsub.on_message();

    while let Some(msg) = stream_value.next().await {
        let payload: String = msg.get_payload()?;
        
        // Deserialize the JSON payload into a JobEvent and broadcast it
        if let Ok(job_event) = serde_json::from_str::<JobEvent>(&payload) {
            let _ = tx.send(job_event);
        }
       } 
        
    Ok(())
}

pub struct RedisResponse {
    pub success: bool,    
}

pub fn set_job(payload: JobList) -> RedisResponse{
    let redis_url  = env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379/".to_string()); 
    let client = redis::Client::open(redis_url).unwrap();
    //get a conneciton from the client 
    let mut con = client.get_connection().unwrap();
    let queue_name = "joblist";
      
    //convert the struct to json str_ing 
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
    let redis_url  = env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379/".to_string()); 
    let client = redis::Client::open(redis_url).unwrap();
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

