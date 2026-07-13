use actix_web::{
    HttpResponse, Responder, http::StatusCode, post, get, web,
};
use shared::{
    job_functions::Job,
    redis_jobs::{set_job, JobList},
    establish_connection,
    JobEvent,
    get_client,
};
use uuid::Uuid; 
use serde::{Deserialize, Serialize};
use crate::utilities::AuthenticatedUser;
use futures::StreamExt;
use actix_web::web::Bytes;


#[derive(Deserialize, Serialize)]
pub struct RequestPayload {
    pub file_name: String,
    pub video_url: String,
    pub bitrate: String,
    pub content_length: String,
}
  

#[derive(Serialize)]
pub struct Response{
 job_id : String,
 status: String,
}

//have to change the controller 
//rather then multipart data use simple json data 

#[post("/upload")]
pub async fn upload_video (user: AuthenticatedUser, payload: web::Json<RequestPayload>) -> impl Responder {

    println!("Authenticated user: {}", user.0.sub);

   let RequestPayload { file_name, video_url, bitrate, content_length} = payload.into_inner();

   //clone video_url before it gets moved into the Job struct
   let video_url_for_redis = video_url.clone();

   //call the establish connection(optimise)
   let mut conn = establish_connection().expect("Failed to connect to database");

   //create the job 
   let job = Job {
    id: Uuid::new_v4(),
    api_key_id: Uuid::new_v4(),
    status: "queued".to_string(),
    stage: None,
    progress: None,
    file_path: video_url,
    file_size: None,
    original_name: Some(file_name.clone()),
    threat_level: None,
    output_urls: None,
    metadata: None,
    error_message: None,
    created_at: None,
    updated_at: None,
   };

    //call the database function (optimise)
    let db_result = Job::create(&mut conn, &job).unwrap();

    println!("db_result: {}", db_result.file_path); 

    //extract extension from file_name (e.g. "test_video.mp4" → "mp4")
    let extension = file_name.split('.').last().unwrap_or("mp4").to_string();

    //call the redis 
    let job_list = JobList {
        job_id: db_result.id.to_string(),
        file_extension: extension,
        video_url: video_url_for_redis,
        bitrate,
        content_length,
    };

    let redis_result = set_job(job_list);

    if redis_result.success == true {

    let response_payload = Response {
        job_id: db_result.id.to_string(),
        status: "pending".to_string(),
    };
    HttpResponse::Ok().status(StatusCode::from_u16(202).unwrap()).json(response_payload)            
    }else {
        HttpResponse::InternalServerError().body("Failed to upload video")
    }

}

#[get("/jobs/{job_id}/events")]
pub async fn get_job_events(path: web::Path<String>) -> HttpResponse {
    let job_id = path.into_inner();

    // Connect to Redis pub/sub
    let client = get_client();
    let mut pubsub = client.get_async_pubsub().await.unwrap();
    pubsub.subscribe("job_events").await.unwrap();

    let msg_stream = pubsub.on_message();

    // Transform the Redis message stream into an SSE byte stream
    // unfold carries (stream, job_id) as state, yields SSE-formatted Bytes
    let sse_stream = futures::stream::unfold(
        (msg_stream, job_id),
        |(mut stream, job_id)| async move {
            while let Some(msg) = stream.next().await {
                let payload: String = match msg.get_payload() {
                    Ok(p) => p,
                    Err(_) => continue,
                };

                let job_event: JobEvent = match serde_json::from_str(&payload) {
                    Ok(e) => e,
                    Err(_) => continue,
                };

                // Only send events for the requested job
                if job_event.job_id != job_id {
                    continue;
                }

                let is_terminal = job_event.stage == "job completed"
                    || job_event.stage == "download failed";

                // Format as SSE: "data: <json>\n\n"
                let sse_data = format!("data: {}\n\n", payload);
                let bytes: Result<Bytes, actix_web::Error> = Ok(Bytes::from(sse_data));

                if is_terminal {
                    // Return the final event, but pass None to end the stream
                    return Some((bytes, (stream, job_id)));
                }

                return Some((bytes, (stream, job_id)));
            }

            // Stream ended (Redis disconnected)
            None
        },
    );

    HttpResponse::Ok()
        .append_header(("Content-Type", "text/event-stream"))
        .append_header(("Cache-Control", "no-cache"))
        .append_header(("Connection", "keep-alive"))
        .streaming(sse_stream)
}