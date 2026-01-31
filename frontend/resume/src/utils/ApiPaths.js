// Automatically detect API URL based on environment
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:8000");

//utils/apiPath.js

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", //signup
    LOGIN: "/api/auth/login", //authenticate user and return jwt token
    GET_PROFILE: "/api/auth/profile", //get loggin-in user details
  },

  RESUME: {
    CREATE: "/api/resume", //POST - create a new resume
    GET_ALL: "/api/resume", //GET - get all resume of logged-in user
    GET_BY_ID: (id) => `/api/resume/${id}`, //get - get a specific resume
    UPDATE: (id) => `/api/resume/${id}`, //PUT - update a reusme
    DELETE: (id) => `/api/resume/${id}`, //DELETE
    UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`, //PUT - upload resume profile images
  },
};
