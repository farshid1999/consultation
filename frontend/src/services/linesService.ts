// services/api/lines.ts
import {apiClient} from "@/lib/axios";
import {LINE_ENDPOINTS, LINE_MEMBER_ENDPOINTS} from "@/services/api/endpoints";
import {extractApiError} from "@/services/api/errors";
import type {Line, LineListParams, LineDetail, LineMember, LineMemberListParams, LineMemberListResponse} from "@/types";


function toQueryParams(params: LineListParams = {}): Record<string, string> {
    const query: Record<string, string> = {};
    if (params.search) query.search = params.search;
    return query;
}

export const lineService = {
    async list(params?: LineListParams): Promise<Line[]> {
        try {
            const {data} = await apiClient.get<Line[]>(LINE_ENDPOINTS.list, {
                params: toQueryParams(params),
            });
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async detail(id: string | number): Promise<LineDetail> {
        try {
            // اینجا id مستقیماً استفاده می‌شود، چه عدد باشد چه رشته
            const {data} = await apiClient.get<LineDetail>(LINE_ENDPOINTS.detail(id));
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async getMembers(lineId: string | number, params?: LineMemberListParams): Promise<LineMemberListResponse> {
        try {
            const {data} = await apiClient.get<LineMemberListResponse>(LINE_MEMBER_ENDPOINTS.list(lineId), {
                params: params || {},
            });
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },
};