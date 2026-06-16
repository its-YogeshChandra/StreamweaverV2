import axios from "axios";

export interface RequestPayload {
    file_name: string,
    video_url: string,
    bitrate: string,
    content_length: string,
}

export interface MediaBucketRequestPayload {
    file_name: string,
    mediaFile: File,
    resourceType: string,
    contentRange?: number | null,
    uploadId?: string | null,
}

//create the class component and extend the api service file 
class ApiSystem {
    baseURL: string;
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }


    async uploadToMediaBucket(payload :MediaBucketRequestPayload){
        //get the cloudinary url
        //push the files in chunks to the cloudinary
        //get uploadPreset from the env 
        const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
        if (!uploadPreset){
            throw new Error("Upload preset not found");
        }
        
        try { 
        const formData = new FormData();
        formData.append("file", payload.mediaFile);
        formData.append("upload_preset", uploadPreset) 
        const headers = {
            "Content-Type": "multipart/form-data",
        };
        //only add chunk upload headers when provided

        
        const response = await axios.post(`${this.baseURL}/upload`, formData, {
            headers,
        });
        return response.data;
        
        }catch (error){
            console.error("Error uploading file:", error);
            throw error;
        }
    }


    async createJob(payload: RequestPayload, token: string) {

        try {
        // token is passed in from the caller via Clerk's useAuth().getToken()
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };

      const response = await axios.post(`${this.baseURL}/jobs/create`, payload, {
            headers,
        });
        return response.data;
     }
        catch (error){
        console.error("Error creating job:", error);
        throw error;
    }
}

}

//get the base url from the env file || will get latch into proxying in future  
const ApiService = new ApiSystem("http://localhost:5000");
export default ApiService;
