// services/contentService.ts

import { apiClient } from "@/lib/axios";
import { extractApiError } from "@/services/api/errors";
import type { ContentCreateInput } from "@/types";
import {CONTENT_ENDPOINTS} from "@/services/api/endpoints"; // تایپ را بعداً تعریف می‌کنیم



export const contentService = {
  async create(payload: ContentCreateInput): Promise<any> {
    try {
      // تبدیل آبجکت به FormData برای ارسال فایل‌ها
      const formData = new FormData();

      // فیلدهای ساده
      formData.append("line", payload.line.toString());
      if (payload.title) formData.append("title", payload.title);
      if (payload.text) formData.append("text", payload.text);
      if (payload.parent) formData.append("parent", payload.parent.toString());

      // member_ids (آرایه‌ای از IDها)
      payload.member_ids?.forEach((id) => {
        formData.append("member_ids", id.toString());
      });

      // media (آرایه‌ای از فایل‌ها و متن‌ها)
      payload.media?.forEach((mediaItem, index) => {
        if (mediaItem.file) {
          // اگر فایل Blob (صوت) یا File باشد
          formData.append(`media[${index}][file]`, mediaItem.file);
        }
        if (mediaItem.text) {
          formData.append(`media[${index}][text]`, mediaItem.text);
        }
      });

      const { data } = await apiClient.post(CONTENT_ENDPOINTS.create, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },
};