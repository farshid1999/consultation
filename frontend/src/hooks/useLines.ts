// hooks/useLines.ts

import { useQuery } from "@tanstack/react-query";
import { lineService } from "@/services/linesService"; // مسیر را چک کنید
import type { LineListParams } from "@/types";

export const QUERY_KEYS = {
  lines: (params?: LineListParams) => ["lines", params],
  // تغییر تایپ id به string | number
  lineDetail: (id: string | number) => ["line", id],
};

export function useLines(params?: LineListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.lines(params),
    queryFn: () => lineService.list(params),
  });
}

export function useLineDetail(id: string | number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.lineDetail(id!),
    // حذف casting اضافی، اجازه می‌دهیم سرویس خودش هندل کند
    queryFn: () => lineService.detail(id!),
    enabled: !!id,
  });
}