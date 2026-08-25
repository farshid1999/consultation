// hooks/useLines.ts

import { useQuery } from "@tanstack/react-query";
import { lineService } from "@/services/linesService"; // مسیر را چک کنید
import type { LineListParams,LineMemberListParams } from "@/types";

export const QUERY_KEYS = {
  lines: (params?: LineListParams) => ["lines", params],
  // تغییر تایپ id به string | number
  lineDetail: (id: string | number) => ["line", id],
  lineMembers: (lineId: string | number, params?: LineMemberListParams) => ["line-members", lineId, params],
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

export function useLineMembers(lineId: string | number | null, params?: LineMemberListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.lineMembers(lineId!, params),
    queryFn: () => lineService.getMembers(lineId!, params),
    enabled: !!lineId,
  });
}