import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://primenest-api-vus0.onrender.com/api", 
  withCredentials: true,
});

// Add this interceptor to catch the EXACT error on your phone
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiRequest;