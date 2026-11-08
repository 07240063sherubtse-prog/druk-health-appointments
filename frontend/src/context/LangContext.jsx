import { createContext, useContext, useState } from 'react';
import en from '../i18n/en.json';
import dz from '../i18n/dz.json';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const dictionaries = { en, dz };

  const t = (key) => {
    const parts = key.split('.');
    let value = dictionaries[language];
    for (const part of parts) {
      value = value?.[part];
    }
    return value || key;
  };

  return <LangContext.Provider value={{ language, setLanguage, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
