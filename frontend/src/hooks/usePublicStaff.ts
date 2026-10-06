import { useQuery } from "@tanstack/react-query";
import { publicStaffService } from "@/services/publicStaffService";
import type { PublicStaffListParams } from "@/types/publicStaff";

export const publicStaffKeys = {
  all: ["public-staff"] as const,
  list: (params?: PublicStaffListParams) => [...publicStaffKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...publicStaffKeys.all, "detail", id] as const,
};

export function usePublicStaffList(params?: PublicStaffListParams) {
  return useQuery({
    queryKey: publicStaffKeys.list(params),
    queryFn: () => publicStaffService.list(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

export function usePublicStaffDetail(id: string | null) {
  return useQuery({
    queryKey: publicStaffKeys.detail(id ?? ""),
    queryFn: () => publicStaffService.detail(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}