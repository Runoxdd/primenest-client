import axios from "axios";

const apiRequest = axios.create({
  // This will look for a variable in Vercel, otherwise use localhost
  baseURL: "https://primenest-api-vus0.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;