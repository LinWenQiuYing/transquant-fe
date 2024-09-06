import enUS from "@transquant/ui/locale/en-US";
import zhCN from "@transquant/ui/locale/zh-CN";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "zh",
    resources: {
      en: {
        translation: enUS,
      },
      zh: {
        translation: zhCN,
      },
    },
  });

export default i18n;
