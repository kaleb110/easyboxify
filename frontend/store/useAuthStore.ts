import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  authToken: string | null;
  setIsAuthenticated: (auth: boolean) => void;
  setAuthToken: (token: string) => void;
  Logout: () => void;
  checkAuth: () => void;
}

// Create the Zustand store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false, // Initialize as false
      authToken: null, // Initialize as null
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setAuthToken: (token) => {
        localStorage.setItem("authToken", token); // Save token to localStorage
        set({ authToken: token, isAuthenticated: true }); // Set both authToken and isAuthenticated
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
