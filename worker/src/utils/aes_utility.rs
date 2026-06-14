//file create the aes 128 key and store in database
use std::process::Command;
use std::fs;
use std::path::Path;
use shared::database::establish_connection;
use shared::EncryptionKey;
use uuid::Uuid;

// Return struct so the caller gets the keyinfo path
pub struct AesKeyResult {
    pub keyinfo_path: String,
    pub key_hex: String,
    pub iv_hex: String,
}

/// Generates a 16-byte AES-128 key + IV using `openssl rand`,
/// writes `enc.key` (raw bytes) and `enc.keyinfo` (FFmpeg key-info file)
/// into `../media/output/playlist/{job_id}/`.
/// Also stores the key in the database for later serving.
/// Returns the keyinfo path so the caller can pass it
/// to FFmpeg via `-hls_key_info_file`.

pub fn generate_aes_key(job_id: &str) -> Result<AesKeyResult, String> {

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
    //   Line 1: URL the player fetches the key from (placeholder until key server is built)
    //   Line 2: local path FFmpeg reads the key from
    //   Line 3: IV in hex
    let key_url = format!("http://localhost:8080/v1/keys/{}", job_id);
    let keyinfo_content = format!(
        "{}\n{}\n{}",
        key_url,
        key_file_path.display(),
        iv_hex
    );

    let keyinfo_path = Path::new(&out_dir).join("enc.keyinfo");
    fs::write(&keyinfo_path, &keyinfo_content)
        .map_err(|e| format!("failed to write enc.keyinfo: {}", e))?;

    // ── 6. Store the key + IV in the database ──
    let job_uuid: Uuid = job_id.parse()
        .map_err(|e| format!("failed to parse job_id as UUID: {}", e))?;

    // combine key + IV bytes together for storage (first 16 = key, next 16 = IV)
    let iv_bytes = hex_to_bytes(&iv_hex)?;
    let mut combined_bytes = key_bytes.clone();
    combined_bytes.extend_from_slice(&iv_bytes);

    let mut db_conn = establish_connection()
        .map_err(|e| format!("failed to connect to database: {}", e))?;

    match EncryptionKey::create(&mut db_conn, job_uuid, 0, combined_bytes) {
        Ok(_) => {
            println!("[aes] key stored in database for job {}", job_id);
        }
        Err(e) => {
            return Err(format!("failed to store encryption key in database: {}", e));
        }
    }

    println!("[aes] key generated for job {}", job_id);
    println!("[aes]   key (hex) : {}", key_hex);
    println!("[aes]   iv  (hex) : {}", iv_hex);
    println!("[aes]   keyinfo   : {}", keyinfo_path.display());

    let result = AesKeyResult {
        keyinfo_path: keyinfo_path.to_string_lossy().to_string(),
        key_hex,
        iv_hex,
    };

    Ok(result)
}



/// Converts a hex string (e.g. "aabbccdd...") to a Vec<u8> of raw bytes.
fn hex_to_bytes(hex: &str) -> Result<Vec<u8>, String> {
    if hex.len() % 2 != 0 {
        return Err("hex string has odd length".to_string());
    }

    let mut bytes = Vec::with_capacity(hex.len() / 2);
    let mut i = 0;
    while i < hex.len() {
        let byte = u8::from_str_radix(&hex[i..i + 2], 16)
            .map_err(|e| format!("invalid hex at position {}: {}", i, e))?;
        bytes.push(byte);
        i += 2;
    }
    Ok(bytes)
}
