import { apiClient } from "@/lib/axios";
import type { Lang } from "@/locales";

export const siteViewService = {
  /** زبان انتخابی بازدیدکننده را در بک‌اند ثبت می‌کند (POST sitesetting/site-view/) */
  saveLanguage: async (language: Lang): Promise<void> => {
    await apiClient.post("sitesetting/site-view/", { language });
  },
};
