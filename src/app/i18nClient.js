import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import ja from '../locales/ja.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'ja',
    debug: true,
    resources: {
      en: {
        translation: en,
      },
      ja: {
        translation: ja,
      },
    },
  });

export default i18n;