// types/content.ts

export interface MediaInput {
  file?: File | Blob; // فایل آپلودی یا صدای ضبط شده
  text?: string; // توضیحات اختیاری برای مدیا
}

export interface ContentCreateInput {
  line: string | number; // ID لاین
  title: string;
  text?: string;
  parent?: number | null;
  member_ids: (string | number)[]; // لیست ID اعضای انتخاب شده
  media: MediaInput[]; // آرایه‌ای از فایل‌ها و صداها
}