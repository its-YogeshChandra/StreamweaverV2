import axios from "axios";
interface RequestPayload {

}
//create the class component and extend the api service file 
class ApiSystem {
    baseURL: string;
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }


    async uploadToMediaBucket(file: File){
        //get the cloudinary url
        //push the files in chunks to the cloudinary
        try { 
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(`${this.baseURL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
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
