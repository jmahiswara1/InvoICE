import i18n from "./config";

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

export { i18n };
export type { SupportedLanguage } from "./config";
export { supportedLanguages, languageNames } from "./config";
