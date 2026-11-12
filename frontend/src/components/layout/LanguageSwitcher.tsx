"use client";

import { FiGlobe } from "react-icons/fi";
import { useLang } from "@/components/providers/LanguageProvider";

export default function LanguageSwitcher() {
  const { lang, setLang, t, locked } = useLang();
  if (locked) return null;

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "fa" ? "en" : "fa")}
      aria-label={t.common.switchLanguageLabel}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1.5 text-xs font-medium text-cream/70 transition-colors duration-300 hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
    >
      <FiGlobe aria-hidden="true" />
      <span>{t.common.switchLanguageShort}</span>
    </button>
  );
}
