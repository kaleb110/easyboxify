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
      isAuthenticated:
        typeof window !== "undefined" && !!localStorage.getItem("authToken"),
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      Logout: () => {
        localStorage.removeItem("authToken");
        set({ isAuthenticated: false });
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
  const { setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if token is available on load
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]);
};