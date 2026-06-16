import axios from "axios";

export interface RequestPayload {
    file_name: string,
    video_url: string,
    bitrate: string,
    content_length: string,
}

export interface MediaBucketRequestPayload {
    file_name: string,
    mediaFile: Blob,
    resourceType: string,
    contentRange?: string | null,
    uploadId?: string | null,
}

//create the class component and extend the api service file 
class ApiSystem {
    baseURL: string;
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }


    async uploadToMediaBucket(payload :MediaBucketRequestPayload){

        const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
        if (!uploadPreset){
            throw new Error("Upload preset not found");
        }
        
        try { 
        const formData = new FormData();
        formData.append("file", payload.mediaFile);
        formData.append("upload_preset", uploadPreset) 
        const headers: Record<string, string> = {
            "Content-Type": "multipart/form-data",
        };

        //only add chunk upload headers when provided 
        if ( payload.uploadId) {
            headers['X-Unique-Upload-Id'] = payload.uploadId;
        }
        if ( payload.contentRange) {
            headers['Content-Range'] = payload.contentRange;
        }       

        const response = await axios.post(`${this.baseURL}/upload`, formData, {
            headers,
            onUploadProgress: (progressEvent) => {
                if (!progressEvent.total) {
                    throw new Error("Upload progress total not found");
                };
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Upload Progress (${payload.file_name}):`, percentCompleted);
            }
        });
        return response.data.secure_url;
        
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
