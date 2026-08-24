
export interface LineListParams {
  search?: string;
  // اگر در آینده صفحه‌بندی سمت سرور اضافه شد، این‌ها را فعال کن
  // page?: number;
  // ordering?: string;
}

// types/line.ts

export interface Media {
  id: string | number; // تغییر به union type
  text: string | null;
  file: string | null;
}

export interface Feature {
  id: string | number;
  title: string;
  text: string | null;
  media: Media | null;
  parent: string | number | null;
}

export interface LineChild {
  id: string | number;
  title: string;
  descriptions: string | null;
  parent: string | number | null;
  features: Feature[];
}

export interface LineDetail {
  id: string | number;
  title: string;
  descriptions: string | null;
  parent: string | number | null;
  features: Feature[];
  children: LineChild[];
}

// برای لیست هم همینطور
export interface Line {
  id: string | number;
  title: string;
  descriptions: string | null;
  parent: string | number | null;
  children: (string | number)[];
}