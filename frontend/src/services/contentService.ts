// services/contentService.ts

import {apiClient} from "@/lib/axios";
import {extractApiError} from "@/services/api/errors";
import {containsFile, buildFormData} from "@/services/api/formData";
import type {
    ContentCreateInput, ContentDetail,
    ContentListItem,
    ContentListParams,
    PaginatedResponse,
} from "@/types";
import {CONTENT_ENDPOINTS} from "@/services/api/endpoints";

export const contentService = {

    async create(payload: ContentCreateInput): Promise<unknown> {
        try {
            const hasFile = containsFile(payload);
            const {data} = await apiClient.post(
                CONTENT_ENDPOINTS.create,
                hasFile ? buildFormData(payload as unknown as Record<string, unknown>) : payload,
                hasFile ? {headers: {"Content-Type": "multipart/form-data"}} : undefined
            );
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async getList(params?: ContentListParams): Promise<PaginatedResponse<ContentListItem>> {
        try {
            const {data} = await apiClient.get<PaginatedResponse<ContentListItem>>(
                CONTENT_ENDPOINTS.list,
                {params: params || {}}
            );
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async getDetail(id: number | string): Promise<ContentDetail> {
        try {
            const {data} = await apiClient.get<ContentDetail>(CONTENT_ENDPOINTS.detail(id));
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },
};