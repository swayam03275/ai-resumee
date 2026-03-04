import { API_PATHS } from "../utils/ApiPaths";
import axiosInstance from "../utils/axiosInstance";

/**
 * Sends a prompt to the backend AI endpoint (Gemini).
 * @param {Array} contents - The Gemini `contents` array
 * @returns {Promise<Object>} The raw Gemini API response data
 */
export const generateWithAI = async (contents) => {
  const response = await axiosInstance.post(API_PATHS.AI.GENERATE, {
    contents,
  });
  return response.data;
};
