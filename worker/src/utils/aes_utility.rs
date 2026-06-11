//file create the aes 128 key
use std::process::Command;
use std::fs;
use std::path::Path;

/// Generates a 16-byte AES-128 key + IV using `openssl rand`,
/// writes `enc.key` (raw bytes) and `enc.keyinfo` (FFmpeg key-info file)
/// into `../media/output/playlist/{job_id}/`.
///
/// Returns the path to the keyinfo file so the caller can pass it
/// to FFmpeg via `-hls_key_info_file`.
pub fn generate_aes_key(job_id: &str, key_server_url: &str) -> Result<String, String> {

    // ── 1. Output directory (same folder the .m3u8 + .ts chunks live in) ──
    let out_dir = format!("../media/output/playlist/{}", job_id);
    fs::create_dir_all(&out_dir)
        .map_err(|e| format!("failed to create playlist dir: {}", e))?;

    // ── 2. Generate 16-byte hex key via openssl ──
    let key_output = Command::new("openssl")
        .args(["rand", "-hex", "16"])
        .output()
        .map_err(|e| format!("failed to run openssl for key: {}", e))?;

    if !key_output.status.success() {
        return Err(format!(
            "openssl rand (key) failed: {}",
            String::from_utf8_lossy(&key_output.stderr)
        ));
    }
    let key_hex = String::from_utf8_lossy(&key_output.stdout).trim().to_string();

    // ── 3. Generate 16-byte hex IV via openssl ──
    let iv_output = Command::new("openssl")
        .args(["rand", "-hex", "16"])
        .output()
        .map_err(|e| format!("failed to run openssl for IV: {}", e))?;

    if !iv_output.status.success() {
        return Err(format!(
            "openssl rand (IV) failed: {}",
            String::from_utf8_lossy(&iv_output.stderr)
        ));
    }
    let iv_hex = String::from_utf8_lossy(&iv_output.stdout).trim().to_string();

    // ── 4. Convert hex key to raw 16 bytes and write enc.key ──
    let key_bytes = hex_to_bytes(&key_hex)?;
    let key_file_path = Path::new(&out_dir).join("enc.key");
    fs::write(&key_file_path, &key_bytes)
        .map_err(|e| format!("failed to write enc.key: {}", e))?;

    // ── 5. Build the key-info file (3 lines) ──
    //   Line 1: URL the player fetches the key from
    //   Line 2: local path FFmpeg reads the key from
    //   Line 3: IV in hex
    let key_url = format!("{}/{}/enc.key", key_server_url.trim_end_matches('/'), job_id);
    let keyinfo_content = format!(
        "{}\n{}\n{}",
        key_url,
        key_file_path.display(),
        iv_hex
    );

    let keyinfo_path = Path::new(&out_dir).join("enc.keyinfo");
    fs::write(&keyinfo_path, keyinfo_content)
        .map_err(|e| format!("failed to write enc.keyinfo: {}", e))?;

    println!("[aes] key generated for job {}", job_id);
    println!("[aes]   key (hex) : {}", key_hex);
    println!("[aes]   iv  (hex) : {}", iv_hex);
    println!("[aes]   keyinfo   : {}", keyinfo_path.display());

    Ok(keyinfo_path.to_string_lossy().to_string())
}

/// Converts a hex string (e.g. "aabbccdd...") to a Vec<u8> of raw bytes.
fn hex_to_bytes(hex: &str) -> Result<Vec<u8>, String> {
    if hex.len() % 2 != 0 {
        return Err("hex string has odd length".to_string());
    }
    (0..hex.len())
        .step_by(2)
        .map(|i| {
            u8::from_str_radix(&hex[i..i + 2], 16)
                .map_err(|e| format!("invalid hex at position {}: {}", i, e))
        })
        .collect()
}
