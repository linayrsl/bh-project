import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import enTexts from "./locales/en/translation.json";
import heTexts from "./locales/he/translation.json";

const resources = {
  en: {
    translation: enTexts
  },
  he: {
    translation: heTexts
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["path"],
      lookupFromPathIndex: 0,
      checkWhitelist: true,
      checkForSimilarInWhitelist: false,
    },
    resources,

    fallbackLng: "he",
    debug: true,
    keySeparator: ".",
    whitelist: ["he", "en"],
    interpolation: {
      escapeValue: false
    }
  });

export {i18n};
