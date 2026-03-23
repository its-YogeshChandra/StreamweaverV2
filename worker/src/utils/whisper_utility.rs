use std::process::{Command, Stdio};

//function to convert the audio to the text using the whisper model 
pub fn transcriber(input_path: &str, output_path: &str) -> Result<(), String> {
 
 //create the process command 
 let mut whisper_mod = Command::new("whisper");

 //call the whisper command to convert the audio to text 
 whisper_mod
  .arg("-f")
  .arg(input_path)
  .arg("-o")
  .arg(output_path)
  .output();

 let cmd = whisper_mod.stdout(Stdio::piped()).stderr(Stdio::piped()).output();

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
