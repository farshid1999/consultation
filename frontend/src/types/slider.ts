// ── عمومی (خروجی SliderPublicSerializer) ──────────────────────────────
export interface PublicSliderImage {
  id: number;
  image: string; // URL تصویر
  caption_title: string;
  caption_text: string;
  order: number;
}

export interface PublicSlider {
  key: string;
  title: string;
  interval_seconds: number;
  images: PublicSliderImage[];
}

// ── مدیریتی (خروجی SliderAdminSerializer) ─────────────────────────────
export interface Slider {
  id: string;
  image: string;
  caption_title: string;
  caption_text: string;
  order: number;
  is_active: boolean;
}

export interface Slider {
  id: number;
  key: string;
  title: string;
  is_active: boolean;
  start_at: string | null; // ISO datetime
  end_at: string | null;   // ISO datetime
  interval_seconds: number;
  images: SliderImage[];
}

// ── ورودی‌ها ───────────────────────────────────────────────────────────
export interface SliderCreateInput {
  key: string;
  title?: string;
  is_active?: boolean;
  start_at?: string | null;
  end_at?: string | null;
  interval_seconds?: number;
}

export type SliderUpdateInput = Partial<SliderCreateInput>;

export interface SliderImageCreateInput {
  image: File;
  caption_title?: string;
  caption_text?: string;
  order?: number;
  is_active?: boolean;
}

export type SliderImageUpdateInput = Partial<
  Omit<SliderImageCreateInput, "image">
> & {
  image?: File; // اگر ارسال نشود، عکس قبلی می‌ماند
};