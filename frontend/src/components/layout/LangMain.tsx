"use client";

import type { ReactNode } from "react";
import { useLang } from "@/components/providers/LanguageProvider";

/**
 * عنصر اصلی صفحه که lang و dir را از زبان فعلی می‌گیرد.
 * <html> همیشه fa/rtl می‌ماند تا داشبورد و صفحه‌های دیگر به‌هم نریزند؛
 * فقط محدوده‌ی لندینگ جهتش عوض می‌شود.
 */
export default function LangMain({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { lang, dir } = useLang();
  return (
    <main lang={lang} dir={dir} className={className}>
      {children}
    </main>
  );
}
