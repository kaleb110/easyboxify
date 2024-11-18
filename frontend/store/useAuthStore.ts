"use client"
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  Logout: () => void;
  checkAuth: () => void;
}

// Create the Zustand store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      Logout: () => {
        set({ isAuthenticated: false });
        localStorage.removeItem("authToken");
      },
      checkAuth: () => {
        // Check if there's a token in localStorage
        const token = localStorage.getItem("authToken");
        if (token) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    { name: "auth-storage" } // Persist the state in localStorage
  )
);

// Custom hook to initialize authentication state on app load
export const useAuthInit = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
};
