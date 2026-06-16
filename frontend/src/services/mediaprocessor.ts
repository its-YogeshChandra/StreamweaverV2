//take the data from form and chunk the video 
import {v4 as uuidv4} from 'uuid';
import ApiService from './apiservice';

const mediaProcessor = async (data: FormData) => {

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

    //call the api to push the data into the cloudinary 
    const chunkUrl: string[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i*optimalChunkSize;
      const end = Math.min(start + optimalChunkSize, filesize);
      const chunkBlob = video.slice(start, end);
      const contentRange = `bytes ${start}-${end-1}/${filesize}`

      const secureUrl = await ApiService.uploadToMediaBucket()
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
