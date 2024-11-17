// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  Logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
      Logout: () => {
        set({ isAuthenticated: false });
        localStorage.removeItem("authToken");
      },
    }),
    { name: "auth-storage" } // Persist the state in localStorage
  )
);
