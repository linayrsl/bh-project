import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "he",
    debug: true,
    lng: "he",

    keySeparator: ".",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
