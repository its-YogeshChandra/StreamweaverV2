//main script file 
mod utils;
use crate::utils::ffmpeg_utility::{convert_to_wav, convert_to_hls};
use crate::utils::whisper_utility::transcribe;
use shared::redis_jobs::get_job;

fn main() {
    println!("Hello, world!");

    //for the money 


}
