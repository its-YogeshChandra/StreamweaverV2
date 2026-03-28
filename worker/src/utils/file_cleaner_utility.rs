//utility function to clear the local files after upload
use tokio::fs::{self};

pub async fn file_cleaner_utility(job_id: &str) -> Result<(), String> {

    // Delete the per-job HLS folder entirely (directory + all .ts and .m3u8 inside)
    let hls_job_dir = format!("../media/output/playlist/{}", job_id);
    match fs::remove_dir_all(&hls_job_dir).await {
        Ok(_) => println!("deleted hls folder: {}", hls_job_dir),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {},
        Err(e) => eprintln!("failed to delete hls folder {}: {}", hls_job_dir, e),
    }

    // Flat directories — delete only files belonging to this job
    let flat_dirs = [
        "../media/input",
        "../media/processing/audio",
        "../media/processing/transcript",
        "../media/output/sprites",
        "../media/output/chapters",
    ];

    for dir in &flat_dirs {
        let mut entries = match fs::read_dir(dir).await {
            Ok(e) => e,
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                continue; // directory doesn't exist, skip silently
            }
            Err(e) => {
                eprintln!("failed to read dir {}: {}", dir, e);
                continue;
            }
        };

        while let Some(entry) = entries.next_entry().await
            .map_err(|e| format!("failed to read entry in {}: {}", dir, e))?
        {
            let file_path = entry.path();

            if !file_path.is_file() {
                continue;
            }

            let filename = match file_path.file_name().and_then(|f| f.to_str()) {
                Some(name) => name.to_string(),
                None => continue,
            };

            // only delete files belonging to this job
            if !filename.starts_with(job_id) {
                continue;
            }

            match fs::remove_file(&file_path).await {
                Ok(_) => println!("deleted: {}", file_path.display()),
                Err(e) => eprintln!("failed to delete {:?}: {}", file_path, e),
            }
        }
    }

    Ok(())
}
