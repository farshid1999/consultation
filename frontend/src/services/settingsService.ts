// services/settingsService.ts

import { apiClient } from "@/lib/axios";
import type { BackgroundMusic } from "@/types";

export const settingsService = {
  async getBackgroundMusic(): Promise<BackgroundMusic> {
    const { data } = await apiClient.get<BackgroundMusic>("sitesetting/background-music/");
    return data;
  },

  async updateBackgroundMusic(payload: FormData): Promise<BackgroundMusic> {
    // استفاده از PUT یا PATCH بسته به نیاز، اما چون ویو شما POST را برای آپدیت هم هندل می‌کند:
    const { data } = await apiClient.post<BackgroundMusic>("sitesetting/background-music/", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};