import { create } from "zustand";

interface UIState {
  showUpgradeModal: boolean;
  setShowUpgradeModal: (value: boolean) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showUpgradeModal: false,
  setShowUpgradeModal: (value: boolean) => set({ showUpgradeModal: value }),
  errorMessage: "",
  setErrorMessage: (message: string) => set({ errorMessage: message }),
}));
