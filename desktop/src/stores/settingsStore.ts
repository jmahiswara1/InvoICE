import { create } from "zustand";
import { persist } from "zustand/middleware";
import { i18n } from "@/i18n";

type Theme = "light" | "dark" | "system";

interface SettingsState {
  language: "id" | "en";
  currency: string;
  theme: Theme;
  exchangeRate: number;
  invoicePrefix: string;
  taxRate: number;
  autoBackupEnabled: boolean;
  reminderDays: number;
  reminderNotifications: boolean;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  licenseKey: string | null;
  licenseType: "free" | "paid";
  lastSyncAt: string | null;
  setLanguage: (lang: "id" | "en") => void;
  setCurrency: (currency: string) => void;
  setTheme: (theme: Theme) => void;
  setExchangeRate: (rate: number) => void;
  setInvoicePrefix: (prefix: string) => void;
  setTaxRate: (rate: number) => void;
  setAutoBackupEnabled: (enabled: boolean) => void;
  setReminderDays: (days: number) => void;
  setReminderNotifications: (enabled: boolean) => void;
  setBusinessInfo: (info: {
    businessName: string;
    businessAddress: string;
    businessEmail: string;
    businessPhone: string;
  }) => void;
  setLicenseKey: (key: string | null) => void;
  setLicenseType: (type: "free" | "paid") => void;
  setLastSyncAt: (at: string | null) => void;
  applyTheme: () => void;
  applyLanguage: () => void;
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
      exchangeRate: 1,
      invoicePrefix: "INV",
      taxRate: 11,
      autoBackupEnabled: true,
      reminderDays: 3,
      reminderNotifications: true,
      businessName: "",
      businessAddress: "",
      businessEmail: "",
      businessPhone: "",
      licenseKey: null,
      licenseType: "free",
      lastSyncAt: null,
      setLanguage: (language) => {
        set({ language });
        i18n.changeLanguage(language);
      },
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => {
        set({ theme });
        applyThemeToDom(theme);
      },
      setExchangeRate: (exchangeRate) => set({ exchangeRate }),
      setInvoicePrefix: (invoicePrefix) => set({ invoicePrefix }),
      setTaxRate: (taxRate) => set({ taxRate }),
      setAutoBackupEnabled: (autoBackupEnabled) => set({ autoBackupEnabled }),
      setReminderDays: (reminderDays) => set({ reminderDays }),
      setReminderNotifications: (reminderNotifications) =>
        set({ reminderNotifications }),
      setBusinessInfo: (info) =>
        set({
          businessName: info.businessName,
          businessAddress: info.businessAddress,
          businessEmail: info.businessEmail,
          businessPhone: info.businessPhone,
        }),
      setLicenseKey: (licenseKey) => set({ licenseKey }),
      setLicenseType: (licenseType) => set({ licenseType }),
      setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
      applyTheme: () => {
        applyThemeToDom(get().theme);
      },
      applyLanguage: () => {
        i18n.changeLanguage(get().language);
      },
    }),
    {
      name: "invoice-settings",
      onRehydrateStorage: () => (state) => {
        if (state) {
          i18n.changeLanguage(state.language);
        }
      },
    }
  )
);
