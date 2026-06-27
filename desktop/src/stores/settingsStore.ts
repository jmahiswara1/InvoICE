import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface SettingsState {
  language: "id" | "en";
  currency: string;
  theme: Theme;
  setLanguage: (lang: "id" | "en") => void;
  setCurrency: (currency: string) => void;
  setTheme: (theme: Theme) => void;
  applyTheme: () => void;
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

export function applyThemeToDom(theme: Theme) {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: "id",
      currency: "IDR",
      theme: "system",
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => {
        set({ theme });
        applyThemeToDom(theme);
      },
      applyTheme: () => {
        applyThemeToDom(get().theme);
      },
    }),
    {
      name: "invoice-settings",
    }
  )
);
