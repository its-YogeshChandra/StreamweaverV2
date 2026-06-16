//take the data from form and chunk the video 
import {v4 as uuidv4} from 'uuid';
import ApiService from './apiservice';
import { MediaBucketRequestPayload, RequestPayload } from './apiservice';
const mediaHandler = async (data: FormData, token: string) => {

    //get the video

     const video = data.get("mediaFile");
    //chunk it according to the media size
    if (!video || !(video instanceof File)) {
        throw new Error("No video file or not a file type");
    }

    const filesize = video.size;
    const optimalChunkSize = getOptimalChunkSize(filesize);
    const totalChunks = Math.ceil(filesize / optimalChunkSize);
    const uniqueUploadId = createUniqueId();
    const fileName = `sweaverV2/${uniqueUploadId}/${video.name}`;

    const chunkUrl: string[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i*optimalChunkSize;
      const end = Math.min(start + optimalChunkSize, filesize);
      const chunkBlob = video.slice(start, end);
      const contentRange = `bytes ${start}-${end-1}/${filesize}`

      //create the media payload 
      const payload: MediaBucketRequestPayload = {
          file_name: fileName,
          mediaFile: chunkBlob,
          resourceType: "video",
          contentRange,
          uploadId: uniqueUploadId,
      }

      //call the api to push data into bucket and get  secure url 
      const secureUrl = await ApiService.uploadToMediaBucket(payload)
      if(!secureUrl){
          throw new Error("Failed to upload chunk");
      }
      chunkUrl.push(secureUrl);

      //call the createjob api to create the job
      const createJobPayload: RequestPayload = {
        video_url: secureUrl,
        bitrate: "360p",
        content_length: filesize.toString(),
        file_name: fileName,
      };


      const job_response = await ApiService.createJob(createJobPayload, token);
      if(!job_response){
        throw new Error("Failed to create job");
      }
      return job_response;

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
