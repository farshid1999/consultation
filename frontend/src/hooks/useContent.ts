// hooks/useContent.ts

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {contentService} from "@/services/contentService";
import {toast} from "sonner";
import type {ApiError, ContentCreateInput, ContentListParams, ContentUpdateInput} from "@/types";

export const QUERY_KEYS = {
    contents: (params?: ContentListParams) => ["staff-contents", params],
    memberContents: (memberId: string | number, params?: ContentListParams) => ["member-contents", memberId, params],
    lineContents: (lineId: string | number) => ["line-contents", lineId],
    contentDetail: (id: number | string) => ["content-detail", id],
    memberListContents: (params?: ContentListParams) => ["member-contents", params],
    memberLineContents: (lineId: string | number, params?: ContentListParams) => ["member-line-contents", lineId, params],
};

export function useCreateContent() {
    return useMutation({
        mutationFn: (payload: ContentCreateInput) => contentService.create(payload),
        onSuccess: () => {
            toast.success("محتوا با موفقیت ایجاد شد.");
        },
        onError: (err: any) => {
            const apiError = err as ApiError;
            toast.error(apiError.message || "خطا در ایجاد محتوا");
        },
    });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ContentUpdateInput }) =>
      contentService.update(id, payload),

    onSuccess: () => {
      toast.success("محتوا با موفقیت ویرایش شد.");
      queryClient.invalidateQueries({ queryKey: ["staff-contents"] });
      queryClient.invalidateQueries({ queryKey: ["content-detail"] });
    },
    onError: (err: any) => {
      const message = err?.message || "خطا در ویرایش محتوا";
      toast.error(message);
    },
  });
}

export function useStaffContents(params?: ContentListParams) {
    return useQuery({
        queryKey: QUERY_KEYS.contents(params),
        queryFn: () => contentService.getList(params),
        staleTime: 1000 * 60 * 5,
    });
}

export function useMemberContents(memberId: string | number, params?: ContentListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.memberContents(memberId, params),
    queryFn: () => contentService.getList({
      ...params, // پارامترهای دیگر مثل search و ordering
      member_id: String(memberId), // <--- این خط حیاتی است
    }),
    staleTime: 1000 * 60 * 5,
  });
}

export function useLineContents(lineId: string | number | null) {
    return useQuery({
        queryKey: QUERY_KEYS.lineContents(lineId ?? ""),
        queryFn: () => contentService.getList({line: String(lineId)}),
        enabled: !!lineId,
    });
}

export function useContentDetail(id: number | string | null) {
    return useQuery({
        queryKey: QUERY_KEYS.contentDetail(id!),
        queryFn: () => contentService.getDetail(id!),
        enabled: !!id,
    });
}

export function useMemberListContents(params?: ContentListParams) {
    return useQuery({
        queryKey: QUERY_KEYS.memberListContents(params),
        queryFn: () => contentService.getMemberContents(params),
        staleTime: 1000 * 60 * 5,
    });
}

export function useMemberLineContents(params?: ContentListParams) {
    return useQuery({
        queryKey: QUERY_KEYS.memberLineContents(params),
        queryFn: () => contentService.getMemberContents(params),
        staleTime: 1000 * 60 * 5,
    });
}