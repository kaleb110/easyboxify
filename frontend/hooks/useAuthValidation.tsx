import { useEffect } from 'react';
import axiosClient from '@/util/axiosClient';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const useAuthValidation = () => {
  const router = useRouter()
  const { authToken, setAuthToken, Logout, isLoading } = useAuthStore();

  useEffect(() => {
    const validateToken = async () => {
      if (!isLoading && !authToken) {
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
  }, [authToken, isLoading]);
};

export default useAuthValidation;