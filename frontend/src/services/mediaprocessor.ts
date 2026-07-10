//take the data from form and chunk the video 
import {v4 as uuidv4} from 'uuid';
import ApiService from './apiservice';
import { MediaBucketRequestPayload, RequestPayload } from './apiservice';

export interface MediaHandlerCallbacks {
    onLog?: (message: string) => void;
    onProgress?: (percent: number) => void;
}

const mediaHandler = async (data: FormData, token: string, callbacks?: MediaHandlerCallbacks) => {
    const log = (msg: string) => callbacks?.onLog?.(msg);
    const progress = (pct: number) => callbacks?.onProgress?.(pct);

    //get the video
     const video = data.get("mediaFile");
    
     if (!video || !(video instanceof File)) {
        log("[ERROR] No video file found or invalid file type");
        throw new Error("No video file or not a file type");
    }

    const filesize = video.size;
    const filesizeMB = (filesize / (1024 * 1024)).toFixed(2);
    const optimalChunkSize = getOptimalChunkSize(filesize);
    const chunkSizeMB = (optimalChunkSize / (1024 * 1024)).toFixed(2);
    const totalChunks = Math.ceil(filesize / optimalChunkSize);
    const uniqueUploadId = createUniqueId();
    const fileName = `sweaverV2/${uniqueUploadId}/${video.name}`;

    log(`[INIT] Analyzing file: ${video.name} (${filesizeMB} MB)`);
    log(`[INIT] Optimal chunk size: ${chunkSizeMB} MB | Total chunks: ${totalChunks}`);
    log(`[INIT] Upload ID: ${uniqueUploadId}`);
    log(`[INIT] Target path: ${fileName}`);
    log(`[SYS] Establishing connection to media bucket...`);

    progress(0);

    // Upload all chunks sequentially — only the final chunk returns a secure_url
    for (let i = 0; i < totalChunks; i++) {
      const start = i * optimalChunkSize;
      const end = Math.min(start + optimalChunkSize, filesize);
      const chunkBlob = video.slice(start, end);
      const contentRange = `bytes ${start}-${end - 1}/${filesize}`;
      const chunkSizeKB = ((end - start) / 1024).toFixed(1);

      log(`[CHUNK] Uploading chunk ${i + 1}/${totalChunks} — ${contentRange} (${chunkSizeKB} KB)`);

      //create the media payload 
      const payload: MediaBucketRequestPayload = {
          file_name: fileName,
          mediaFile: chunkBlob,
          resourceType: "video",
          contentRange,
          uploadId: uniqueUploadId,
      }

      //call the api to push data into bucket
      try {
        const response = await ApiService.uploadToMediaBucket(payload, (chunkPercent) => {
            // Per-chunk upload progress → map to overall progress
            const overallPercent = Math.round(((i + chunkPercent / 100) / totalChunks) * 100);
            progress(overallPercent);
        });

        log(`[CHUNK] Chunk ${i + 1}/${totalChunks} uploaded successfully ✓`);

        // Intermediate chunks return {done: false} — only the final chunk 
        // returns {done: true, secure_url: "..."}
        if (i < totalChunks - 1) {
          // Not the last chunk — just continue to next
          continue;
        }

        // Final chunk — extract secure_url
        const secureUrl = response.secure_url;
        if (!secureUrl) {
          log(`[ERROR] Cloudinary did not return a secure_url after final chunk`);
          throw new Error("Cloudinary did not return a secure_url after final chunk upload");
        }

        progress(100);
        log(`[BUCKET] All ${totalChunks} chunks uploaded successfully`);
        log(`[BUCKET] Secure URL received from media bucket`);

        //call the createjob api to create the job (only after full upload)
        const resolutionValue = (data.get("resolution") as string) || "1080p";
        const chunkSizeValue = (data.get("chunkSize") as string) || "6s";

        log(`[JOB] Creating transcoding job — resolution: ${resolutionValue}, segment: ${chunkSizeValue}`);

        const createJobPayload: RequestPayload = {
          video_url: secureUrl,
          bitrate: resolutionValue,
          content_length: filesize.toString(),
          file_name: fileName,
          chunk_size: chunkSizeValue,
        };

        const job_response = await ApiService.createJob(createJobPayload, token);
        if (!job_response) {
          log(`[ERROR] Failed to create transcoding job`);
          throw new Error("Failed to create job");
        }

        log(`[JOB] Transcoding job created successfully`);
        log(`[SYS] Pipeline initialization complete`);
        return job_response;

      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        log(`[ERROR] Chunk ${i + 1}/${totalChunks} failed: ${errMsg}`);
        throw error;
      }
    }
} 

function getOptimalChunkSize(totalBytes:number) {
  const MB = 1024 * 1024;
  
  if (totalBytes <= 50 * MB) return 5 * MB;
  if (totalBytes <= 500 * MB) return 10 * MB;
  if (totalBytes <= 2000 * MB) return 25 * MB;
  
  return 50 * MB; // For anything massive, cap at 50-100MB
}

function createUniqueId(){
  // create 
  return uuidv4();
}

export { mediaHandler }