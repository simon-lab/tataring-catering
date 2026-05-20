"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { id, type TranslationKey } from "./id";
import { btk } from "./btk";

type Locale = "id" | "btk";

const dictionaries: Record<Locale, Record<string, string>> = { id, btk };

interface LanguageContextValue {
  locale: Locale;
  toggle: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("id");

  useEffect(() => {
    const saved = localStorage.getItem("tataring-locale") as Locale | null;
    if (saved === "btk") setLocale("btk");
  }, []);

  const toggle = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "id" ? "btk" : "id";
      localStorage.setItem("tataring-locale", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey): string =>
      dictionaries[locale][key] ?? dictionaries.id[key] ?? key,
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
