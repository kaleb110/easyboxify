import { useEffect } from 'react';
import axiosClient from '@/util/axiosClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
const useAuthValidation = () => {
  const router = useRouter()
  const { authToken, setAuthToken, Logout } = useAuthStore();

  useEffect(() => {
    const validateToken = async () => {
      if (!authToken) {
        try {
          // Try to refresh the token if it's not present or possibly invalid
          const response = await axiosClient.post("/auth/refresh", {}, { withCredentials: true });
          const newAccessToken = response.data.accessToken;
          setAuthToken(newAccessToken); // Update token in Zustand store
        } catch (error) {
          console.error("Token refresh failed:", error);
          Logout(); // Logout if refresh fails
          router.replace("/landing")
        }
      }
    };

    validateToken();
  }, [authToken, setAuthToken, Logout]);
};

export default useAuthValidation;
