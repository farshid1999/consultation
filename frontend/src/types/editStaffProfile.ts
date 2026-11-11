// types/staff.ts

export interface Address {
  id?: number;
  country: string;
  province: string;
  city: string;
  street: string;
  postal_code?: string | null;
  description?: string | null;
}

export interface Information {
  id?: string;
  title: string;
  text?: string | null;
  file?: string | File | null;
  children?: Information[];
}


export interface StaffProfile {
  phone_number: string;
  email?: string | null;
  national_id?: string | null;
  land_line?: string | null;
  degree?: string | null;
  job?: string | null;
  bio?: string | null;
  birth_date?: string | null;
  avatar?: string | null;

  // آبجکت‌های کامل برای نمایش و ویرایش راحت‌تر
  address?: Address | null;
  informations?: Information[];
}

export type StaffProfileUpdateInput = FormData; // چون فایل داریم، مستقیما FormData می‌فرستیم