import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://primenest-api-vus0.onrender.com/api", 
  withCredentials: true,
});

// Request interceptor to add Authorization header for cross-domain auth
apiRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch errors
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiRequest;