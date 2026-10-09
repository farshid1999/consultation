/** کلیدهایی که سایت واقعاً استفاده می‌کند؛ ادمین فقط از بین همین‌ها انتخاب می‌کند */
export const SLIDER_KEY_OPTIONS = [
  { value: "why-sports-psychology", label: "چرا یوگبال (بخش «چرا روان‌شناسی ورزشی»)" },
  { value: "hero-cube", label: "مکعب صفحه‌ی اصلی (Hero) - حداکثر ۴ تصویر" },
];

/** حداکثر تعداد تصویر برای اسلایدرهایی که سقف دارند (بر اساس key) */
export const SLIDER_MAX_IMAGES: Record<string, number> = {
  "hero-cube": 4,
};