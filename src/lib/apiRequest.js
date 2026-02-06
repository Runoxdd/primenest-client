import axios from "axios";

const apiRequest = axios.create({
  // This will look for a variable in Vercel, otherwise use localhost
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8800/api",
  withCredentials: true,
});

export default apiRequest;