import { API_PATHS } from "./ApiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage= async (imageFile) => {
    const formData = new FormData();
    //appned image file to form data
    formData.append('image',imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formData, {
            headers : {
                'Content-Type' : 'multipart/form-data',  //set header for the file upload
            },
        });
        return response.data;
    } catch (error) {
        console.error(`error uploading the image`,error);
        throw error; //rethrow error for handeling
        
    }
}

export default uploadImage;