import { apiClient } from "@/lib/axios";
import { SLIDER_ENDPOINTS } from "@/services/api/endpoints";
import type {
  PublicSlider,
  Slider,
  SliderCreateInput,
  SliderUpdateInput,
  SliderImage,
  SliderImageCreateInput,
  SliderImageUpdateInput,
  Paginated,
} from "@/types";

/**
 * مقادیر را به FormData تبدیل می‌کند (برای آپلود تصویر).
 * بک فیلدهای تخت می‌خواهد (image, caption_title, ...)، پس از buildFormData
 * پروژه که ساختار data + __FILE__ دارد استفاده نمی‌کنیم.
 */
function toFormData(payload: Record<string, unknown>): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File || value instanceof Blob) {
      fd.append(key, value);
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
}

/** لیست ادمین ممکن است صفحه‌بندی شده یا آرایه‌ی ساده باشد؛ هر دو را آرایه می‌کنیم. */
function normalizeList<T>(data: Paginated<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}

export const sliderService = {
  // ── عمومی ───────────────────────────────────────────────────────────
  /** اگر اسلایدر فعال نباشد یا وجود نداشته باشد (۴۰۴)، null برمی‌گرداند. */
  getPublic: async (key: string): Promise<PublicSlider | null> => {
    try {
      const res = await apiClient.get<PublicSlider>(
        SLIDER_ENDPOINTS.public(key)
      );
      return res.data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  },

  // ── مدیریتی: اسلایدر ────────────────────────────────────────────────
  list: async (): Promise<Slider[]> => {
    const res = await apiClient.get<Paginated<Slider> | Slider[]>(
      SLIDER_ENDPOINTS.list
    );
    return normalizeList(res.data);
  },

  detail: async (id: number | string): Promise<Slider> => {
    const res = await apiClient.get<Slider>(SLIDER_ENDPOINTS.detail(id));
    return res.data;
  },

  create: async (data: SliderCreateInput): Promise<Slider> => {
    const res = await apiClient.post<Slider>(SLIDER_ENDPOINTS.list, data);
    return res.data;
  },

  update: async (
    id: number | string,
    data: SliderUpdateInput
  ): Promise<Slider> => {
    const res = await apiClient.patch<Slider>(
      SLIDER_ENDPOINTS.detail(id),
      data
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<void> => {
    await apiClient.delete(SLIDER_ENDPOINTS.detail(id));
  },

  // ── مدیریتی: تصاویر ─────────────────────────────────────────────────
  createImage: async (
    sliderId: number | string,
    data: SliderImageCreateInput
  ): Promise<SliderImage> => {
    const res = await apiClient.post<SliderImage>(
      SLIDER_ENDPOINTS.imageCreate(sliderId),
      toFormData({ ...data }),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  updateImage: async (
    id: number | string,
    data: SliderImageUpdateInput
  ): Promise<SliderImage> => {
    // اگر عکس جدید هست multipart، وگرنه JSON ساده
    if (data.image instanceof File) {
      const res = await apiClient.patch<SliderImage>(
        SLIDER_ENDPOINTS.imageDetail(id),
        toFormData({ ...data }),
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    }
    const res = await apiClient.patch<SliderImage>(
      SLIDER_ENDPOINTS.imageDetail(id),
      data
    );
    return res.data;
  },

  deleteImage: async (id: number | string): Promise<void> => {
    await apiClient.delete(SLIDER_ENDPOINTS.imageDetail(id));
  },
};