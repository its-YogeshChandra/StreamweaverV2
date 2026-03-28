use reqwest;
use std::time::Duration;
use dotenv::dotenv;
use std::env;

/// Transcribes audio by sending the WAV file to the whisper-server
/// running at WHISPER_SERVER_URL (default: http://localhost:4000)
/// via the /inference endpoint with multipart form data.
/// Saves the VTT output to media/processing/transcription/{job_id}.vtt
pub async fn transcriber(job_id: &str) -> Result<(), String> {
    dotenv().ok();

    // whisper-server URL — defaults to localhost:4000 (Docker container)
    let whisper_url = env::var("WHISPER_SERVER_URL")
        .unwrap_or_else(|_| "http://localhost:4000".to_string());

    let inference_url = format!("{}/inference", whisper_url);

    // input WAV file path
    let input_path = format!("../media/processing/audio/{}.wav", job_id);

    // output VTT file path
    let output_dir = "../media/processing/transcript";
    let output_path = format!("{}/{}.vtt", output_dir, job_id);

    // ensure the output directory exists
    std::fs::create_dir_all(output_dir)
        .map_err(|e| format!("failed to create transcription dir: {}", e))?;

    // read the WAV file into bytes
    let file_bytes = std::fs::read(&input_path)
        .map_err(|e| format!("failed to read WAV file {}: {}", input_path, e))?;

    // build the multipart form
    let file_part = reqwest::multipart::Part::bytes(file_bytes)
        .file_name(format!("{}.wav", job_id))
        .mime_str("audio/wav")
        .map_err(|e| format!("failed to set mime type: {}", e))?;

    let form = reqwest::multipart::Form::new()
        .part("file", file_part)
        .text("response_format", "vtt");

    // send to whisper-server
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(300)) // transcription can be slow
        .build()
        .map_err(|e| format!("failed to build HTTP client: {}", e))?;

    let response = client
        .post(&inference_url)
        .multipart(form)
        .send()
        .await
        .map_err(|e| format!("whisper-server request failed: {}", e))?;

    // check response status
    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(format!("whisper-server returned {}: {}", status, body));
    }

    // save the VTT response to file
    let vtt_content = response.text().await
        .map_err(|e| format!("failed to read whisper response: {}", e))?;

    std::fs::write(&output_path, &vtt_content)
        .map_err(|e| format!("failed to write VTT file: {}", e))?;

    println!("transcription saved to {}", output_path);
    Ok(())
}
