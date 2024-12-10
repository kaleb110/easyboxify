import { useEffect } from 'react';
import axiosClient from '@/util/axiosClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const useAuthValidation = () => {
  const router = useRouter()
  const { authToken, setAuthToken, Logout, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const validateToken = async () => {
      // Only try to refresh if we're not explicitly logged out
      if (!isLoading && !authToken && isAuthenticated) {
        try {
          const response = await axiosClient.post("/auth/refresh", {}, { withCredentials: true });
          const newAccessToken = response.data.accessToken;
          setAuthToken(newAccessToken);
        } catch (error) {
          console.error("Token refresh failed:", error);
          Logout();
          router.replace("/landing")
        }
      }
    };

    validateToken();
  }, [authToken, isLoading, isAuthenticated]);
};

export default useAuthValidation;