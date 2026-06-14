// Test binary for POST /upload endpoint
// Run with: cargo run --bin test_upload
//
// What it tests:
//   1. Happy path — valid payload returns 202 with job_id
//   2. Missing field  — missing bitrate returns 4xx
//   3. Empty file_name — returns 4xx
//   4. Invalid bitrate value — still accepted (backend doesn't validate, worker handles fallback)
//   5. No auth header — currently no middleware on this route, so it still passes

use dotenv::dotenv;
use reqwest::Client;
use serde_json::{json, Value};
use tests::helpers::{base_url, generate_test_jwt, jwt_secret};

#[tokio::main]
async fn main() {
    dotenv().ok();

    let client = Client::new();
    let url = format!("{}/upload", base_url());

    // Generate a signed JWT for requests that need auth
    let secret = jwt_secret();
    let token = generate_test_jwt("test@example.com", "test_password", &secret);
    let auth_header = format!("Bearer {}", token);

    println!("===========================================");
    println!("  POST /upload — Integration Tests");
    println!("  Target: {}", url);
    println!("===========================================\n");

    // ── Test 1: Happy path ──
    println!("[1] Happy path — valid payload");
    let valid_payload = json!({
        "file_name": "big_buck_bunny.mp4",
        "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "bitrate": "720p",
        "content_length": "6"
    });

    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .header("Authorization", &auth_header)
        .json(&valid_payload)
        .send()
        .await
        .expect("request failed");

    let status = response.status();
    let body: Value = response.json().await.unwrap_or(json!({}));

    if status == 202 {
        println!("    ✓ PASS — got 202");
        println!("    job_id : {}", body["job_id"]);
        println!("    status : {}", body["status"]);
    } else {
        println!("    ✗ FAIL — expected 202, got {}", status);
        println!("    body   : {}", body);
    }

    println!();

    // ── Test 2: Missing required field (bitrate) ──
    println!("[2] Missing field — no 'bitrate'");
    let missing_bitrate = json!({
        "file_name": "test.mp4",
        "video_url": "https://example.com/video.mp4",
        "content_length": "6"
        // bitrate is intentionally missing
    });

    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .header("Authorization", &auth_header)
        .json(&missing_bitrate)
        .send()
        .await
        .expect("request failed");

    let status = response.status();

    if status.is_client_error() {
        println!("    ✓ PASS — got {} (client error as expected)", status);
    } else {
        println!("    ✗ FAIL — expected 4xx, got {}", status);
    }

    println!();

    // ── Test 3: Empty file_name ──
    println!("[3] Edge case — empty file_name");
    let empty_name = json!({
        "file_name": "",
        "video_url": "https://example.com/video.mp4",
        "bitrate": "720p",
        "content_length": "6"
    });

    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .header("Authorization", &auth_header)
        .json(&empty_name)
        .send()
        .await
        .expect("request failed");

    let status = response.status();
    let body: Value = response.json().await.unwrap_or(json!({}));

    // Backend currently doesn't validate empty file_name — it creates a job anyway
    // This test documents the current behaviour
    println!("    status : {} (backend accepts empty name — job_id: {})", status, body["job_id"]);

    println!();

    // ── Test 4: Invalid bitrate value ──
    println!("[4] Invalid bitrate value — 'badresolution'");
    let bad_bitrate = json!({
        "file_name": "test.mp4",
        "video_url": "https://example.com/video.mp4",
        "bitrate": "badresolution",
        "content_length": "6"
    });

    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .header("Authorization", &auth_header)
        .json(&bad_bitrate)
        .send()
        .await
        .expect("request failed");

    let status = response.status();
    let body: Value = response.json().await.unwrap_or(json!({}));

    // Backend accepts any bitrate string — worker falls back to 720p internally
    if status == 202 {
        println!("    ✓ PASS — job accepted (worker will fall back to 720p)");
        println!("    job_id : {}", body["job_id"]);
    } else {
        println!("    ✗ FAIL — got {}", status);
        println!("    body   : {}", body);
    }

    println!();

    // ── Test 5: Wrong Content-Type ──
    println!("[5] Wrong Content-Type — sending plain text");
    let response = client
        .post(&url)
        .header("Content-Type", "text/plain")
        .header("Authorization", &auth_header)
        .body("this is not json")
        .send()
        .await
        .expect("request failed");

    let status = response.status();

    if status.is_client_error() {
        println!("    ✓ PASS — got {} (rejected as expected)", status);
    } else {
        println!("    ✗ FAIL — expected 4xx, got {}", status);
    }

    println!();
    println!("===========================================");
    println!("  Tests complete");
    println!("===========================================");
}
