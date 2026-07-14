import axios from "axios";

export interface RequestPayload {
    file_name: string,
    video_url: string,
    bitrate: string,
    content_length: string,
    chunk_size?: string,
}

export interface JobEvent {
    job_id: string;
    stage: string;
    branch: string;
    level: string;
    timestamp: number;
}

export interface MediaBucketRequestPayload {
    file_name: string,
    mediaFile: Blob,
    resourceType: string | "auto",
    contentRange?: string | null,
    uploadId?: string | null,
}

export interface CloudinaryUploadResponse {
    secure_url?: string;
    done?: boolean;
    [key: string]: unknown;
}

//create the class component and extend the api service file 
class ApiSystem {
    baseURL: string;
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    //function to upload the media to the bucket
    async uploadToMediaBucket(
        payload: MediaBucketRequestPayload,
        onChunkProgress?: (percent: number) => void,
    ): Promise<CloudinaryUploadResponse> {
       const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/${payload.resourceType || "video"}/upload`;

        const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
        if (!uploadPreset){
            throw new Error("Upload preset not found");
        }
        
        try { 
        const formData = new FormData();
        formData.append("file", payload.mediaFile);
        formData.append("upload_preset", uploadPreset) 
        const headers: Record<string, string> = {};

        //only add chunk upload headers when provided 
        if ( payload.uploadId) {
            headers['X-Unique-Upload-Id'] = payload.uploadId;
        }
        if ( payload.contentRange) {
            headers['Content-Range'] = payload.contentRange;
        }       

        const response = await axios.post(url, formData, {
            headers,
            onUploadProgress: (progressEvent) => {
                if (!progressEvent.total) return;
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onChunkProgress?.(percentCompleted);
            }
        });

        // Return the full response data — intermediate chunks return {done: false},
        // only the final chunk returns {done: true, secure_url: "..."}
        return response.data;
        
        }catch (error){
            console.error("Error uploading file:", error);
            throw error;
        }
    }

//function to create job 
    async createJob(payload: RequestPayload, token: string) {

        try {
        // token is passed in from the caller via Clerk's useAuth().getToken()
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };

      const response = await axios.post(`${this.baseURL}/upload`, payload, {
            headers,
        });
        return response.data;
     }
        catch (error){
        console.error("Error creating job:", error);
        throw error;
    }
}

//function to get job logs from the server 
async getJobLogs(
    jobId: string,
    token: string,
    onEvent: (event: JobEvent) => void,
): Promise<void> {
    const response = await fetch(`${this.baseURL}/jobs/${jobId}/events`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-cache",
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Response body is not readable");

    const decoder = new TextDecoder();
    let buffer = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Accumulate chunks — SSE frames end with \n\n
            buffer += decoder.decode(value, { stream: true });

            // Each complete SSE frame is separated by a blank line
            const frames = buffer.split("\n\n");

            // The last element is an incomplete frame — keep it in the buffer
            buffer = frames.pop() ?? "";

            for (const frame of frames) {
                // Each frame can have multiple lines; find the "data:" line
                for (const line of frame.split("\n")) {
                    if (!line.startsWith("data:")) continue;
                    const json = line.slice(5).trim();
                    try {
                        const event: JobEvent = JSON.parse(json);
                        onEvent(event);
                    } catch {
                        console.warn("[SSE] Failed to parse event:", json);
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}
}

//get the base url from the env file || will get latch into proxying in future  
const ApiService = new ApiSystem(process.env.NEXT_PUBLIC_API_URL || "https://api.streamweaver.seclan.live");
export default ApiService;
   