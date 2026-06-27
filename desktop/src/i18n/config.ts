import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import id from "./locales/id.json";
import en from "./locales/en.json";

export const supportedLanguages = ["id", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageNames: Record<SupportedLanguage, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

i18n.use(initReactI18next).init({
  resources: {
    id: { translation: id },
    en: { translation: en },
  },
  lng: "id",
  fallbackLng: "id",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
