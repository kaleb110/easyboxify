import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

// Custom hook to initialize authentication state on app load
export const useAuthInit = () => {
  const { checkAuth } = useAuthStore(); // Access checkAuth method from Zustand store

  useEffect(() => {
    checkAuth(); // Sync Zustand state with the token in localStorage on app load
  }, [checkAuth]); // Only run on component mount
};
