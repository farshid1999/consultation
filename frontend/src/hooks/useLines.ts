// hooks/useLines.ts

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {lineService} from "@/services/linesService"; // مسیر را چک کنید
import type {LineListParams, LineMemberListParams,StaffLineListParams} from "@/types";
import {toast} from "sonner";

export const QUERY_KEYS = {
    lines: (params?: LineListParams) => ["lines", params],
    // تغییر تایپ id به string | number
    lineDetail: (id: string | number) => ["line", id],
    lineMembers: (lineId: string | number, params?: LineMemberListParams) => ["line-members", lineId, params],
    lineStaff: (lineId: string | number, params?: StaffLineListParams) => ["line-staff", lineId, params],
    myLines: (params?: LineListParams) => ["my-lines", params],
};


export function useLines(params?: LineListParams) {
    return useQuery({
        queryKey: QUERY_KEYS.lines(params),
        queryFn: () => lineService.list(params),
    });
}

export function usePublicLines(params?: LineListParams) {
    return useQuery({
        queryKey: QUERY_KEYS.lines(params),
        queryFn: () => lineService.publicList(params),
    });
}


export function useMyLines(params?: LineListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.myLines(params),
    queryFn: () => lineService.getMyLines(params),
    staleTime: 1000 * 60 * 5, // کش ۵ دقیقه‌ای برای کاهش رکوئست
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
        staleTime: 0, // حتماً صفر باشد تا همیشه رفرش شود
    });
}

export function useAddLineMembers(lineId: string | number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userIds: (string | number)[]) => lineService.addMembers(lineId, userIds),
        onSuccess: () => {
            toast.success("اعضا با موفقیت به لاین اضافه شدند.");

            // --- تغییر مهم اینجا ---
            // تمام کوئری‌های مرتبط با ممبرهای این لاین را رفرش کن، فارغ از پارامترهای جستجو
            queryClient.invalidateQueries({
                queryKey: ["line-members", lineId],
                refetchType: 'active' // فقط کوئری‌های فعال در صفحه را رفرش کن
            });
        },
        onError: (err: any) => {
            const message = err?.response?.data?.user_ids?.[0] || err?.message || "خطا در افزودن اعضا";
            toast.error(message);
        },
    });
}


export function useLineStaff(lineId: string | number | null, params?: StaffLineListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.lineStaff(lineId!, params),
    queryFn: () => lineService.getStaff(lineId!, params),
    enabled: !!lineId,
    staleTime: 0,
  });
}

export function useRemoveLineMembers(lineId: string | number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userIds: (string | number)[]) => lineService.removeMembers(lineId, userIds),
        onSuccess: (data) => {
            toast.success(`${data.count} عضو با موفقیت از لاین حذف شدند.`);

            // --- تغییر مهم اینجا ---
            queryClient.invalidateQueries({
                queryKey: ["line-members", lineId],
                refetchType: 'active'
            });
        },
        onError: (err: any) => {
            const message = err?.response?.data?.user_ids?.[0] || err?.message || "خطا در حذف اعضا";
            toast.error(message);
        },
    });
}


export function useAddLineStaff(lineId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffIds: (string | number)[]) => lineService.addStaff(lineId, staffIds),
    onSuccess: () => {
      toast.success("کارمندان با موفقیت به لاین اضافه شدند.");

      // رفرش کردن لیست استاف‌های همین لاین
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.lineStaff(lineId),
        refetchType: 'active'
      });

      queryClient.refetchQueries({
        queryKey: QUERY_KEYS.lineStaff(lineId)
      });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.staff_ids?.[0] || err?.message || "خطا در افزودن کارمندان";
      toast.error(message);
    },
  });
}

export function useRemoveLineStaff(lineId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffIds: (string | number)[]) => lineService.removeStaff(lineId, staffIds),
    onSuccess: (data) => {
      toast.success(`${data.count} کارمند با موفقیت از لاین حذف شدند.`);

      // رفرش کردن لیست استاف‌های همین لاین
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.lineStaff(lineId),
        refetchType: 'active'
      });

      queryClient.refetchQueries({
        queryKey: QUERY_KEYS.lineStaff(lineId)
      });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.staff_ids?.[0] || err?.message || "خطا در حذف کارمندان";
      toast.error(message);
    },
  });
}