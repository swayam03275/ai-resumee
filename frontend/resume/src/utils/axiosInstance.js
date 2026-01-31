import axios from 'axios';
import { BASE_URL } from './ApiPaths';

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers: {
        "Content-Type" : "application/json",
        Accept: "application/json",
    },
    withCredentials:true
});

//request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        return config

    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response Interceptor
axiosInstance.interceptors.response.use(
    (response)=> {
        return response;
    },
    (error) => {
        //handle common error globally
        if (error.response) {
            if (error.response.status===401){
                //Redirect to login page
                window.location.href= "/";
            }else if (error.response.status === 500){
                console.error("server error pls try again later.");
            }
        }else if (error.code === 'ECONNABORTED'){
            console.log("Request timeout. Please try again.");
            
        }
        return Promise.reject(error);
    }
);

    export default axiosInstance