import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000", // API base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

// Request interceptor to include token in headers
axiosClient.interceptors.request.use(
  (config) => {
    const { authToken } = useAuthStore.getState(); // Get authToken from Zustand store
    console.log(authToken);
    
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`; // Add token to request headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle errors in request
  }
);

// Response interceptor to handle 401 Unauthorized (e.g., token expired)
axiosClient.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is expired or invalid, log the user out
      useAuthStore.getState().Logout();
    }
    return Promise.reject(error); // Handle errors in response
  }
);

// Refresh token interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired (401), try to refresh the token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Request a new access token using the refresh token
        const response = await axios.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );
        console.log(response);
        
        const newAccessToken = response.data.accessToken;


        // Update the access token in your Zustand store
        const { setAuthToken } = useAuthStore.getState();
        setAuthToken(newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        // If refreshing fails, log out the user
        const { Logout } = useAuthStore.getState();
        Logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
