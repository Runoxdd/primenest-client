import axios from "axios";

const apiRequest = axios.create({
  // This will look for a variable in Vercel, otherwise use localhost
  baseURL: "https://primenest-client.vercel.app/",
  withCredentials: true,
});

export default apiRequest;