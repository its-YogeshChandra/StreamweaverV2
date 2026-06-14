use std::process::{Command, Stdio};
use std::path::Path;
use std::fs;
use std::io::Write;

// ── Audio extraction ──

pub fn convert_to_wav(job_id: &str, file_extension: &str, input_folder: &str) -> Result<(), String> {
    //output directory
    let path = "../media/processing/audio/";
    fs::create_dir_all(path)
        .map_err(|e| format!("failed to create audio dir: {}", e))?;

    //name for the output file
    let output_file_name = format!("{}{}.wav", path, job_id);

    //build and run the ffmpeg command (single execution — fixes the double-run bug)
    let cmd = Command::new("ffmpeg")
        .arg("-hide_banner")
        .arg("-y")
        .arg("-i")
        .arg(input_folder)
        .arg("-ar").arg("16000")
        .arg("-ac").arg("1")
        .arg("-acodec").arg("pcm_s16le")
        .arg(&output_file_name)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output();

    match cmd {
        Ok(output) => {
            if output.status.success() {
                Ok(())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).to_string())
            }
        }
        Err(e) => Err(e.to_string()),
    }
}

// ── Video config for resolution-based bitrates ──

#[derive(Debug, Clone)]
pub struct VideoConfig {
    pub bitrate: String,
    pub maxrate: String,
    pub bufsize: String,
    pub scale_filter: String,
}

impl VideoConfig {
    pub fn from_resolution(resolution: &str) -> Option<Self> {
        match resolution {
            "8K" | "8k" | "4320p" => Some(Self {
                bitrate: "80000k".to_string(),
                maxrate: "85000k".to_string(),
                bufsize: "160000k".to_string(),
                scale_filter: "scale=-2:4320".to_string(),
            }),
            "4K" | "4k" | "2160p" => Some(Self {
                bitrate: "45000k".to_string(),
                maxrate: "48000k".to_string(),
                bufsize: "90000k".to_string(),
                scale_filter: "scale=-2:2160".to_string(),
            }),
            "1440p" | "2K" | "2k" => Some(Self {
                bitrate: "16000k".to_string(),
                maxrate: "17000k".to_string(),
                bufsize: "32000k".to_string(),
                scale_filter: "scale=-2:1440".to_string(),
            }),
            "1080p" => Some(Self {
                bitrate: "8000k".to_string(),
                maxrate: "8560k".to_string(),
                bufsize: "16000k".to_string(),
                scale_filter: "scale=-2:1080".to_string(),
            }),
            "720p" => Some(Self {
                bitrate: "2500k".to_string(),
                maxrate: "2675k".to_string(),
                bufsize: "5000k".to_string(),
                scale_filter: "scale=-2:720".to_string(),
            }),
            "480p" => Some(Self {
                bitrate: "1400k".to_string(),
                maxrate: "1498k".to_string(),
                bufsize: "2800k".to_string(),
                scale_filter: "scale=-2:480".to_string(),
            }),
            "360p" => Some(Self {
                bitrate: "800k".to_string(),
                maxrate: "856k".to_string(),
                bufsize: "1600k".to_string(),
                scale_filter: "scale=-2:360".to_string(),
            }),
            "240p" => Some(Self {
                bitrate: "400k".to_string(),
                maxrate: "428k".to_string(),
                bufsize: "800k".to_string(),
                scale_filter: "scale=-2:240".to_string(),
            }),
            "144p" => Some(Self {
                bitrate: "200k".to_string(),
                maxrate: "214k".to_string(),
                bufsize: "400k".to_string(),
                scale_filter: "scale=-2:144".to_string(),
            }),
            _ => None,
        }
    }
}

// ── HLS transcoding with AES-128 encryption ──

pub fn convert_to_hls(
    bitrate: &str,
    content_length: &str,
    job_id: &str,
    file_extension: &str,
    keyinfo_path: &str,
) -> Result<(), String> {

    //input file
    let input_path_file = format!("../media/input/{}.{}", job_id, file_extension);

    //the output directory — one subfolder per job
    let vidoutput_dir = format!("../media/output/playlist/{}", job_id);
    fs::create_dir_all(&vidoutput_dir)
        .map_err(|e| format!("failed to create playlist dir: {}", e))?;
    let final_destination = Path::new(&vidoutput_dir).join("index.m3u8");

    //get the bitrate config for the selected resolution (fallback to 720p)
    let vidconfigval = match VideoConfig::from_resolution(bitrate) {
        Some(cfg) => cfg,
        None => VideoConfig::from_resolution("720p").unwrap(),
    };

    //build the ffmpeg command
    let mut video_chunker = Command::new("ffmpeg");

    video_chunker
        .arg("-hide_banner")
        .arg("-y")
        .arg("-i").arg(&input_path_file)
        .arg("-c:v").arg("libx264")
        .arg("-c:a").arg("aac")
        .arg("-preset").arg("medium")
        .arg("-crf").arg("24")
        .arg("-b:a").arg("128k")
        .arg("-ar").arg("44100")
        .arg("-b:v").arg(&vidconfigval.bitrate)
        .arg("-maxrate").arg(&vidconfigval.maxrate)
        .arg("-bufsize").arg(&vidconfigval.bufsize)
        .arg("-vf").arg(&vidconfigval.scale_filter)
        .arg("-start_number").arg("0")
        .arg("-hls_time").arg(content_length)
        .arg("-hls_list_size").arg("0")
        .arg("-hls_playlist_type").arg("vod")
        // AES-128 encryption — FFmpeg reads enc.key and writes encrypted .ts chunks
        .arg("-hls_key_info_file").arg(keyinfo_path)
        .arg("-f").arg("hls");

    let cmd = video_chunker
        .arg(&final_destination)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output();

    match cmd {
        Ok(output) => {
            if output.status.success() {
                println!("[hls] encrypted HLS chunks created for job {}", job_id);
                Ok(())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).to_string())
            }
        }
        Err(e) => Err(e.to_string()),
    }
}

// ── Sprite generation with VTT ──

// Constants for sprite layout
const SPRITE_WIDTH: u32 = 320;
const SPRITE_COLUMNS: u32 = 10;
const SPRITE_FPS: u32 = 1; // one thumbnail per second

/// Gets the duration of a video in seconds using ffprobe.
fn get_video_duration(input_path: &str) -> Result<f64, String> {
    let output = Command::new("ffprobe")
        .arg("-hide_banner")
        .arg("-v").arg("error")
        .arg("-show_entries").arg("format=duration")
        .arg("-of").arg("default=noprint_wrappers=1:nokey=1")
        .arg(input_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("failed to run ffprobe: {}", e))?;

    if !output.status.success() {
        return Err(format!(
            "ffprobe failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    let duration_str = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let duration: f64 = duration_str.parse()
        .map_err(|e| format!("failed to parse duration '{}': {}", duration_str, e))?;

    Ok(duration)
}

/// Generates a tiled sprite PNG and a matching VTT file for seek thumbnails.
/// Flow:
///   1. ffprobe → get video duration
///   2. ffmpeg → generate sprite sheet (tiled PNG) at 1fps, 320px wide, 10 columns
///   3. ffprobe → get the actual thumbnail height (since we use scale=320:-1)
///   4. write the VTT file mapping each second to an xywh region in the sprite
pub fn generate_sprites(job_id: &str, file_extension: &str) -> Result<(), String> {

    //input path
    let input_path = format!("../media/input/{}.{}", job_id, file_extension);

    //output paths
    let output_dir = "../media/output/sprites";
    fs::create_dir_all(output_dir)
        .map_err(|e| format!("failed to create sprites dir: {}", e))?;

    let sprite_path = format!("{}/{}.png", output_dir, job_id);
    let vtt_path = format!("{}/{}.vtt", output_dir, job_id);

    // ── 1. Get video duration ──
    let duration = get_video_duration(&input_path)?;
    let total_frames = duration as u32; // 1fps → 1 frame per second
    if total_frames == 0 {
        return Err("video duration is 0, cannot generate sprites".to_string());
    }

    println!("[sprites] video duration: {:.1}s, total frames: {}", duration, total_frames);

    // ── 2. Calculate sprite grid dimensions ──
    let columns = SPRITE_COLUMNS;
    let rows = (total_frames + columns - 1) / columns; // ceiling division
    let tile_layout = format!("{}x{}", columns, rows);

    // ── 3. Generate the tiled sprite sheet ──
    let sprite_cmd = Command::new("ffmpeg")
        .arg("-hide_banner")
        .arg("-y")
        .arg("-i").arg(&input_path)
        .arg("-vf").arg(format!("fps={},scale={}:-1,tile={}", SPRITE_FPS, SPRITE_WIDTH, tile_layout))
        .arg("-frames:v").arg("1")
        .arg("-update").arg("1")
        .arg(&sprite_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output();

    match &sprite_cmd {
        Ok(output) => {
            if !output.status.success() {
                return Err(format!(
                    "sprite generation failed: {}",
                    String::from_utf8_lossy(&output.stderr)
                ));
            }
        }
        Err(e) => {
            return Err(format!("failed to run ffmpeg for sprites: {}", e));
        }
    }

    println!("[sprites] sprite sheet created: {}", sprite_path);

    // ── 4. Get the actual thumbnail height from the generated sprite ──
    // We use ffprobe on the sprite image to get its full dimensions,
    // then calculate per-thumbnail height from the grid
    let probe_output = Command::new("ffprobe")
        .arg("-hide_banner")
        .arg("-v").arg("error")
        .arg("-select_streams").arg("v:0")
        .arg("-show_entries").arg("stream=width,height")
        .arg("-of").arg("csv=s=x:p=0")
        .arg(&sprite_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("failed to run ffprobe on sprite: {}", e))?;

    if !probe_output.status.success() {
        return Err(format!(
            "ffprobe on sprite failed: {}",
            String::from_utf8_lossy(&probe_output.stderr)
        ));
    }

    // parse "WIDTHxHEIGHT" format (e.g. "3200x1800")
    let dimensions_str = String::from_utf8_lossy(&probe_output.stdout).trim().to_string();
    let parts: Vec<&str> = dimensions_str.split('x').collect();
    if parts.len() != 2 {
        return Err(format!("unexpected ffprobe dimensions output: {}", dimensions_str));
    }

    let sprite_total_width: u32 = parts[0].parse()
        .map_err(|e| format!("failed to parse sprite width: {}", e))?;
    let sprite_total_height: u32 = parts[1].parse()
        .map_err(|e| format!("failed to parse sprite height: {}", e))?;

    // calculate per-thumbnail dimensions
    let thumb_width = sprite_total_width / columns;
    let thumb_height = sprite_total_height / rows;

    println!("[sprites] sprite dimensions: {}x{}, thumb: {}x{}, grid: {}x{}",
        sprite_total_width, sprite_total_height,
        thumb_width, thumb_height,
        columns, rows
    );

    // ── 5. Generate the VTT file ──
    let sprite_filename = format!("{}.png", job_id);

    let mut vtt_file = fs::File::create(&vtt_path)
        .map_err(|e| format!("failed to create VTT file: {}", e))?;

    // write VTT header
    writeln!(vtt_file, "WEBVTT")
        .map_err(|e| format!("failed to write VTT header: {}", e))?;
    writeln!(vtt_file, "")
        .map_err(|e| format!("failed to write VTT blank line: {}", e))?;

    // write one cue per second
    let mut frame_index: u32 = 0;
    while frame_index < total_frames {
        // calculate the timestamp range for this thumbnail
        let start_seconds = frame_index;
        let end_seconds = frame_index + 1;
        if end_seconds > total_frames {
            break;
        }

        // format timestamps as HH:MM:SS.mmm
        let start_ts = format_vtt_timestamp(start_seconds);
        let end_ts = format_vtt_timestamp(end_seconds);

        // calculate the x,y position in the sprite sheet
        let col = frame_index % columns;
        let row = frame_index / columns;
        let x = col * thumb_width;
        let y = row * thumb_height;

        // write the VTT cue
        // format: sprite_filename#xywh=x,y,w,h
        writeln!(vtt_file, "{} --> {}", start_ts, end_ts)
            .map_err(|e| format!("failed to write VTT cue: {}", e))?;
        writeln!(vtt_file, "{}#xywh={},{},{},{}", sprite_filename, x, y, thumb_width, thumb_height)
            .map_err(|e| format!("failed to write VTT cue content: {}", e))?;
        writeln!(vtt_file, "")
            .map_err(|e| format!("failed to write VTT blank line: {}", e))?;

        frame_index += 1;
    }

    println!("[sprites] VTT file created: {} ({} cues)", vtt_path, total_frames);
    Ok(())
}

/// Formats a number of seconds into VTT timestamp format: HH:MM:SS.000
fn format_vtt_timestamp(total_seconds: u32) -> String {
    let hours = total_seconds / 3600;
    let minutes = (total_seconds % 3600) / 60;
    let seconds = total_seconds % 60;
    format!("{:02}:{:02}:{:02}.000", hours, minutes, seconds)
}
