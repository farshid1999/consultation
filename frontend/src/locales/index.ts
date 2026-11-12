import fa from "./fa.json";
import en from "./en.json";

export type Lang = "fa" | "en";

/** fa.json منبع اصلی ساختار است؛ en.json باید دقیقاً همین کلیدها را داشته باشد. */
export type Messages = typeof fa;

export const messages: Record<Lang, Messages> = { fa, en };

export const DEFAULT_LANG: Lang = "fa";
export const LANG_COOKIE = "lang";
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const isLang = (value: unknown): value is Lang =>
  value === "fa" || value === "en";

export const dirOf = (lang: Lang): "rtl" | "ltr" =>
  lang === "fa" ? "rtl" : "ltr";

/** جایگزینی {n} و {title} و ... داخل متن‌های ترجمه */
export function format(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? `{${key}}`),
  );
}
