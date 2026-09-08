// hooks/useDashboard.ts

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export const QUERY_KEYS = {
  dashboardStats: (days: number) => ["dashboard-stats", days],
};

export function useDashboardStats(days: number = 30) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardStats(days),
    queryFn: () => dashboardService.getStats(days),
    staleTime: 1000 * 60 * 5, // 5 دقیقه کش
  });
}