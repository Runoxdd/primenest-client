import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://primenest-api-vus0.onrender.com/api", 
  withCredentials: true,
});

export default apiRequest;