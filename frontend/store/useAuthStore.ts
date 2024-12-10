"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  authToken: string | null;
  isLoading: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  setAuthToken: (token: string) => void;
  Logout: () => void;
  checkAuth: () => Promise<boolean>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      authToken: null,
      isLoading: true, // Start with loading true
      setLoading: (loading) => set({ isLoading: loading }),
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setAuthToken: (token) => {
        localStorage.setItem("authToken", token);
        set({ authToken: token, isAuthenticated: true });
      },
      Logout: () => {
        localStorage.removeItem("authToken");
        set({ isAuthenticated: false, authToken: null });
      },
      checkAuth: async () => {
        const token = localStorage.getItem("authToken");
        set({
          isAuthenticated: !!token,
          authToken: token,
          isLoading: false,
        });
        return !!token;
      },
    }),
    { name: "auth-storage" }
  )
);
