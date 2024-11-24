"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
interface AuthState {
  isAuthenticated: boolean;
  authToken: string | null; // Store the token
  setIsAuthenticated: (auth: boolean) => void;
  setAuthToken: (token: string) => void;
  Logout: () => void;
  checkAuth: () => void;
}

// Create the Zustand store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated:
        typeof window !== "undefined" && !!localStorage.getItem("authToken"),
      authToken: localStorage.getItem("authToken"), // Store the token here
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setAuthToken: (token) => {
        localStorage.setItem("authToken", token); // Store the token in localStorage
        set({ authToken: token });
      },
      Logout: () => {
        localStorage.removeItem("authToken");
        set({ isAuthenticated: false, authToken: null });
      },
      checkAuth: () => {
        const token = localStorage.getItem("authToken");
        if (token) {
          set({ isAuthenticated: true, authToken: token });
        } else {
          set({ isAuthenticated: false, authToken: null });
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
