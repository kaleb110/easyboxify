import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const useAuthInit = () => {
  const { checkAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkAuth();
    };
    init();
  }, []);
};
