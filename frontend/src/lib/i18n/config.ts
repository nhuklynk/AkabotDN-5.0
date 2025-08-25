import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import vi from "./locales/vi.json";
import en from "./locales/en.json";

let isInitialized = false;

export const initI18n = (): typeof i18n => {
  if (!isInitialized) {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: "vi",
        supportedLngs: ["vi", "en"],
        defaultNS: "common",
        ns: ["common"],
        resources: {
          vi: { common: vi },
          en: { common: en },
        },
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ["querystring", "localStorage", "cookie", "navigator"],
          caches: ["localStorage", "cookie"],
        },
      });
    isInitialized = true;
  }
  return i18n;
};

export default i18n;


