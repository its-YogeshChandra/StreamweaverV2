use tokio::fs::{self, File};
use tokio::io::AsyncReadExt;
use aws_sdk_s3::primitives::ByteStream;
use dotenv::dotenv;
use std::env;

//cloudflare r2 for the bucket  
pub async fn upload_to_cloud(job_id: &str) -> Result<(), String> {
    dotenv().ok();
    
    // HLS: per-job folder at ../media/output/playlist/{job_id}/
    let hls_output_path = format!("../media/output/playlist/{}", job_id);

    // Sprites and chapters are flat directories — files are named {job_id}.png / {job_id}.json
    let sprite_output_path = "../media/output/sprites".to_string();
    let chapter_output_path = "../media/output/chapters".to_string();

    // (path_on_disk, s3_category_prefix, filter_by_job_id)
    // HLS folder already belongs entirely to this job — upload everything in it
    // Sprites/chapters are shared dirs — filter by job_id filename prefix
    let upload_targets: Vec<(String, &str, bool)> = vec![
        (hls_output_path,     "hls",      false), // all files inside belong to this job
        (sprite_output_path,  "sprites",  true),  // filter by job_id
        (chapter_output_path, "chapters", true),  // filter by job_id
    ];

    //load the r2 endpoint url
    let endpoint_url = env::var("R2_ENDPOINT_URL")
        .map_err(|_| "R2_ENDPOINT_URL not set".to_string())?;

    //load r2 credentials explicitly from env
    let access_key = env::var("R2_ACCESS_KEY_ID")
        .map_err(|_| "R2_ACCESS_KEY_ID not set".to_string())?;
    let secret_key = env::var("R2_SECRET_ACCESS_KEY")
        .map_err(|_| "R2_SECRET_ACCESS_KEY not set".to_string())?;

    let credentials = aws_sdk_s3::config::Credentials::new(
        &access_key,
        &secret_key,
        None,  // session token
        None,  // expiry
        "r2-env",
    );

    //load the s3 client pointed at cloudflare r2
    let shared_config = aws_config::defaults(aws_config::BehaviorVersion::latest())
        .endpoint_url(&endpoint_url)
        .region(aws_config::Region::new("auto"))
        .credentials_provider(credentials)
        .load()
        .await;

    let s3_config = aws_sdk_s3::config::Builder::from(&shared_config)
        .force_path_style(true)
        .build();

    let client = aws_sdk_s3::Client::from_conf(s3_config);

    //bucket name
    let bucket_name = env::var("R2_BUCKET_NAME")
        .map_err(|_| "R2_BUCKET_NAME not set".to_string())?;
    
    //loop through each target directory
    for (dir_path, category, filter_by_job_id) in &upload_targets {

        let mut entries = fs::read_dir(&dir_path).await
            .map_err(|e| format!("failed to read directory {}: {}", dir_path, e))?;

        while let Some(entry) = entries.next_entry().await
            .map_err(|e| format!("failed to read entry in {}: {}", dir_path, e))? 
        {
            let file_path = entry.path();

            // skip subdirectories — only upload files
            if !file_path.is_file() {
                continue;
            }

            let filename = match file_path.file_name().and_then(|f| f.to_str()) {
                Some(name) => name.to_string(),
                None => continue,
            };

            // for shared dirs, only upload files belonging to this job
            if *filter_by_job_id && !filename.starts_with(job_id) {
                continue;
            }

            //read the file into a buffer
            let mut main_file = File::open(&file_path).await
                .map_err(|e| format!("failed to open file {:?}: {}", file_path, e))?;
            let metadata = fs::metadata(&file_path).await
                .map_err(|e| format!("failed to read metadata for {:?}: {}", file_path, e))?;

            let mut file_buffer = Vec::with_capacity(metadata.len() as usize);
            main_file.read_to_end(&mut file_buffer).await
                .map_err(|e| format!("failed to read file {:?}: {}", file_path, e))?;

            let body_stream = ByteStream::from(file_buffer);

            // S3 key: {job_id}/{category}/{filename}
            let s3_key = format!("{}/{}/{}", job_id, category, filename);

            println!("uploading {} -> s3://{}/{}", file_path.display(), bucket_name, s3_key);

            client
                .put_object()
                .bucket(&bucket_name)
                .key(&s3_key)
                .body(body_stream)
                .send()
                .await
                .map_err(|e| {
                    // print full error chain so the root dispatch cause is visible
                    eprintln!("[upload] PUT failed for key: {}", s3_key);
                    eprintln!("[upload] error (Display): {}", e);
                    eprintln!("[upload] error (Debug):   {:?}", e);
                    // walk the source chain
                    let mut source = std::error::Error::source(&e);
                    while let Some(cause) = source {
                        eprintln!("[upload]   caused by: {:?}", cause);
                        source = cause.source();
                    }
                    format!("failed to upload {}: {:?}", s3_key, e)
                })?;

            println!("uploaded: {}", s3_key);
        }
    }
    Ok(())
}
