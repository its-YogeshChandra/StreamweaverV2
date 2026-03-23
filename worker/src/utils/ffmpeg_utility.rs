use std::process::{Command, Stdio};

pub fn convert_to_wav(input_path: &str, output_path: &str) -> Result<(), String> {
//output directory  


//create the process command (optimize) 
let mut ffmpeg_mod = Command::new("ffmpeg");

//crete the option for the ffmpeg 
let options = [
    "-ar", "16000",
    "-ac", "1",
    "-acodec", "pcm_s16le",
];


//call the ffmpeg command to convert the audio to wav format 
ffmpeg_mod
 .arg("-i")
 .arg(input_path)
 .args(&options)
 .arg(output_path)
 .output();

let cmd = ffmpeg_mod.stdout(Stdio::piped()).stderr(Stdio::piped()).output();

//match the cmd 
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

//create struct to handle the bitrate
#[derive(Debug, Clone)]
pub struct VideoConfig {
    pub bitrate: String,
    pub maxrate: String,
    pub bufsize: String,
    pub scale_filter: String,
}

impl VideoConfig {
    // This method takes a string slice and returns the Config
    // We returns Option<Self> because the user might send an invalid resolution
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
            _ => None, // Handle invalid input
        }
    }
}



pub fn convert_to_hls(input_path: &str, output_path: &str) -> Result<(), String> {

//the output directory 



//create the process command
let mut ffmpeg_mod = Command::new("ffmpeg");

  //call the ffmpeg on video
    let options = [
        "-preset medium",
        "-crf 24",
        "-b:a 128k", // Audio bitrate
        "-ar 44100", // Audio sample rate
        "-start_number 0",
        "-hls_list_size 0",
        "-hls_playlist_type vod",
        "-f hls",
    ];

    //vector of options
    let mut vid_options: Vec<String> = Vec::new();
    for option in options {
        let individual_val = option.split_whitespace();
        for part in individual_val {
            vid_options.push(part.to_string());
        }
    }

    //get the bitrate , maxrate and buffer size accroding to the resolution by user
    let vidconfigval = match VideoConfig::from_resolution(&bitrate) {
        Some(cfg) => cfg,
        None => {
            //error handling
            VideoConfig::from_resolution("720p").unwrap()
        }
    };

    // 1. Add Bitrate
    vid_options.push("-b:v".to_string());
    vid_options.push(vidconfigval.bitrate);

    // 2. Add Maxrate
    vid_options.push("-maxrate".to_string());
    vid_options.push(vidconfigval.maxrate);

    // 3. Add Buffer Size
    vid_options.push("-bufsize".to_string());
    vid_options.push(vidconfigval.bufsize);

    // 4. Add Scale Filter
    vid_options.push("-vf".to_string());
    vid_options.push(vidconfigval.scale_filter);

    //5  Add the content
    vid_options.push("-hls_time".to_string());
    vid_options.push(content_length.to_string());

    //create the command
    let mut video_chunker = Command::new("ffmpeg");

    video_chunker
        .arg("-i")
        .arg(video_path)
        .arg("-c:v")
        .arg("libx264")
        .arg("-c:a")
        .arg("aac")
        .args(vid_options);

    // .arg(output_options)
    // .arg(vidoutput)
    // .stdout(Stdio::piped())
    // .stderr(Stdio::piped())
    // .output()
    // .expect("failed to run ffmped");

    let cmd = video_chunker
        .arg(final_destination)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .expect("failed to run ffmpeg");





}
