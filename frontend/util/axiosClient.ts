import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore"; // Import the auth store

// Replace this with your backend URL
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Add a request interceptor to include the token
axiosClient.interceptors.request.use(
  (config) => {
    const { authToken } = useAuthStore.getState(); // Get token from Zustand store
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`; // Add token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration or other errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized (e.g., token expired or invalid)
      const { Logout } = useAuthStore.getState();
      Logout(); // Log out the user if the token is invalid or expired
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
