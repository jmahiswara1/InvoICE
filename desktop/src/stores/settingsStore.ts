import { create } from "zustand";

interface SettingsState {
  language: "id" | "en";
  currency: string;
  theme: "light" | "dark" | "system";
  setLanguage: (lang: "id" | "en") => void;
  setCurrency: (currency: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: "id",
  currency: "IDR",
  theme: "system",
  setLanguage: (language) => set({ language }),
  setCurrency: (currency) => set({ currency }),
  setTheme: (theme) => set({ theme }),
}));
