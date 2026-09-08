// services/dashboardService.ts

import { apiClient } from "@/lib/axios";
import type { DashboardStats } from "@/types";

export const dashboardService = {
  async getStats(days: number = 30): Promise<DashboardStats> {
    const { data } = await apiClient.get<DashboardStats>("operations/admin", {
      params: { days },
    });
    return data;
  },
};