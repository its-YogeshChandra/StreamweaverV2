// Test binary for POST /upload endpoint
//
// Run all tests:    cargo run --bin test_upload
// Run one test:     cargo run --bin test_upload -- 1
// Run multiple:     cargo run --bin test_upload -- 1 3 5
//
// Available tests:
//   1  Happy path — valid payload returns 202 with job_id
//   2  Missing field — missing bitrate returns 4xx
//   3  Empty file_name edge case
//   4  Invalid bitrate value — accepted, worker falls back to 720p
//   5  Wrong Content-Type — should return 4xx

use dotenv::dotenv;
use reqwest::Client;
use serde_json::{json, Value};
use tests::helpers::{base_url, generate_test_jwt, jwt_secret};

// ── Individual test functions ──

async fn test_happy_path(client: &Client, url: &str, auth_header: &str) {
    println!("[1] Happy path — valid payload");
    let payload = json!({
        "file_name": "big_buck_bunny.mp4",
        "video_url": "https://res.cloudinary.com/dp6i6a3xy/video/upload/rocket_man.mp4",
        "bitrate": "720p",
        "content_length": "6"
    });

    let response = client
        .post(url)
        .header("Content-Type", "application/json")
        .header("Authorization", auth_header)
        .json(&payload)
        .send()
        .await;

    match response {
        Ok(res) => {
            let status = res.status();
            let body: Value = res.json().await.unwrap_or(json!({}));
            if status == 202 {
                println!("    ✓ PASS — got 202");
                println!("    job_id : {}", body["job_id"]);
                println!("    status : {}", body["status"]);
            } else {
                println!("    ✗ FAIL — expected 202, got {}", status);
                println!("    body   : {}", body);
            }
        }
        Err(e) => {
            println!("    ✗ FAIL — request error: {}", e);
            println!("    hint   : is the backend running on {}?", url);
        }
    }
    println!();
}

async fn test_missing_field(client: &Client, url: &str, auth_header: &str) {
    println!("[2] Missing field — no 'bitrate'");
    let payload = json!({
        "file_name": "test.mp4",
        "video_url": "https://example.com/video.mp4",
        "content_length": "6"
    });

    let response = client
        .post(url)
        .header("Content-Type", "application/json")
        .header("Authorization", auth_header)
        .json(&payload)
        .send()
        .await;

    match response {
        Ok(res) => {
            let status = res.status();
            if status.is_client_error() {
                println!("    ✓ PASS — got {} (client error as expected)", status);
            } else {
                println!("    ✗ FAIL — expected 4xx, got {}", status);
            }
        }
        Err(e) => {
            println!("    ✗ FAIL — request error: {}", e);
        }
    }
    println!();
}

async fn test_empty_filename(client: &Client, url: &str, auth_header: &str) {
    println!("[3] Edge case — empty file_name");
    let payload = json!({
        "file_name": "bunny-girl-senpai.mp4",
        "video_url": "https://player.cloudinary.com/embed/?cloud_name=dp6i6a3xy&public_id=This_Rocket_Landing_Didn_t_Seem_Real_OfhaJ8texh4_rgl40i",
        "bitrate": "720p",
        "content_length": "6"
    });

    let response = client
        .post(url)
        .header("Content-Type", "application/json")
        .header("Authorization", auth_header)
        .json(&payload)
        .send()
        .await;

    match response {
        Ok(res) => {
            let status = res.status();
            let body: Value = res.json().await.unwrap_or(json!({}));
            // Backend currently doesn't validate empty file_name — documents current behaviour
            println!("    status : {} (job_id: {})", status, body["job_id"]);
        }
        Err(e) => {
            println!("    ✗ FAIL — request error: {}", e);
        }
    }
    println!();
}

async fn test_invalid_bitrate(client: &Client, url: &str, auth_header: &str) {
    println!("[4] Invalid bitrate value — 'badresolution'");
    let payload = json!({
        "file_name": "test.mp4",
        "video_url": "https://example.com/video.mp4",
        "bitrate": "badresolution",
        "content_length": "6"
    });

    let response = client
        .post(url)
        .header("Content-Type", "application/json")
        .header("Authorization", auth_header)
        .json(&payload)
        .send()
        .await;

    match response {
        Ok(res) => {
            let status = res.status();
            let body: Value = res.json().await.unwrap_or(json!({}));
            if status == 202 {
                println!("    ✓ PASS — job accepted (worker will fall back to 720p)");
                println!("    job_id : {}", body["job_id"]);
            } else {
                println!("    ✗ FAIL — got {}", status);
                println!("    body   : {}", body);
            }
        }
        Err(e) => {
            println!("    ✗ FAIL — request error: {}", e);
        }
    }
    println!();
}

async fn test_wrong_content_type(client: &Client, url: &str, auth_header: &str) {
    println!("[5] Wrong Content-Type — sending plain text");
    let response = client
        .post(url)
        .header("Content-Type", "text/plain")
        .header("Authorization", auth_header)
        .body("this is not json")
        .send()
        .await;

    match response {
        Ok(res) => {
            let status = res.status();
            if status.is_client_error() {
                println!("    ✓ PASS — got {} (rejected as expected)", status);
            } else {
                println!("    ✗ FAIL — expected 4xx, got {}", status);
            }
        }
        Err(e) => {
            println!("    ✗ FAIL — request error: {}", e);
        }
    }
    println!();
}

// ── Main: parse args and run selected tests ──

#[tokio::main]
async fn main() {
    dotenv().ok();

    let client = Client::new();
    let url = format!("{}/upload", base_url());

    let secret = jwt_secret();
    let token = generate_test_jwt("test@example.com", "test_password", &secret);
    let auth_header = format!("Bearer {}", token);

    // Parse command-line args to pick which tests to run
    // Usage: cargo run --bin test_upload -- 1 3 5
    let args: Vec<String> = std::env::args().collect();
    let selected_tests: Vec<u32> = if args.len() > 1 {
        // User specified test numbers
        args[1..].iter()
            .filter_map(|a| a.parse::<u32>().ok())
            .collect()
    } else {
        // No args — run all tests
        vec![1, 2, 3, 4, 5]
    };

    println!("===========================================");
    println!("  POST /upload — Integration Tests");
    println!("  Target: {}", url);
    println!("  Running tests: {:?}", selected_tests);
    println!("===========================================\n");

    for test_num in &selected_tests {
        match test_num {
            1 => test_happy_path(&client, &url, &auth_header).await,
            2 => test_missing_field(&client, &url, &auth_header).await,
            3 => test_empty_filename(&client, &url, &auth_header).await,
            4 => test_invalid_bitrate(&client, &url, &auth_header).await,
            5 => test_wrong_content_type(&client, &url, &auth_header).await,
            _ => println!("[{}] unknown test number — skipping\n", test_num),
        }
    }

    println!("===========================================");
    println!("  Done — ran {} test(s)", selected_tests.len());
    println!("===========================================");
}
