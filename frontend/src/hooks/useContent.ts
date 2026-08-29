// hooks/useContent.ts

import {useMutation, useQuery} from "@tanstack/react-query";
import {contentService} from "@/services/contentService";
import {toast} from "sonner";
import type {ApiError, ContentCreateInput, ContentListParams} from "@/types";

export const QUERY_KEYS = {
    contents: (params?: ContentListParams) => ["staff-contents", params],
    memberContents: (memberId: string | number, params?: ContentListParams) => ["member-contents", memberId, params],
    lineContents: (lineId: string | number) => ["line-contents", lineId],
    contentDetail: (id: number | string) => ["content-detail", id],
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
        queryFn: () => contentService.getList(params),
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Existing contents that belong to a specific line — used to populate the
 * "parent content" dropdown so a new content can be created as a child of
 * an existing one. Requires backend support for `?line=<id>` filtering on
 * the contents list endpoint.
 */
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