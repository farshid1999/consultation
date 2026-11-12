"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANG,
  LANG_COOKIE,
  LANG_COOKIE_MAX_AGE,
  dirOf,
  messages,
  type Lang,
  type Messages,
} from "@/locales";
import { siteViewService } from "@/services/siteViewService";

interface LanguageContextValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  isRtl: boolean;
  t: Messages;
  setLang: (lang: Lang) => void;
  /** true یعنی این بخش از سایت دو زبانه نیست و دکمه‌ی تغییر زبان نشان داده نمی‌شود */
  locked: boolean;
}

/**
 * مقدار پیش‌فرض (بدون Provider) فارسی و قفل است؛ بنابراین کامپوننت‌هایی مثل
 * Navbar که در صفحه‌های دیگر (مثلاً /line/[id]) هم استفاده می‌شوند، بدون
 * هیچ تغییری مثل قبل فارسی کار می‌کنند.
 */
const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  dir: dirOf(DEFAULT_LANG),
  isRtl: true,
  t: messages[DEFAULT_LANG],
  setLang: () => {},
  locked: true,
});

interface LanguageProviderProps {
  initialLang: Lang;
  children: ReactNode;
}

export function LanguageProvider({
  initialLang,
  children,
}: LanguageProviderProps) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax`;
    // ثبت انتخاب زبان در بک‌اند (فقط برای آمار)؛ خطای آن نباید روی UI اثر بگذارد
    siteViewService.saveLanguage(next).catch(() => {});
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: dirOf(lang),
      isRtl: lang === "fa",
      t: messages[lang],
      setLang,
      locked: false,
    }),
    [lang, setLang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
