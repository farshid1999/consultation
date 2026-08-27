// services/api/lines.ts
import {apiClient} from "@/lib/axios";
import {LINE_ENDPOINTS, LINE_MEMBER_ENDPOINTS, LINE_STAFF_ENDPOINTS} from "@/services/api/endpoints";
import {extractApiError} from "@/services/api/errors";
import type {
    Line,
    LineListParams,
    LineDetail,
    LineMember,
    LineMemberListParams,
    LineMemberListResponse,
    StaffLine, StaffLineListResponse, StaffLineListParams
} from "@/types";


function toQueryParams(params: LineListParams = {}): Record<string, string> {
    const query: Record<string, string> = {};
    if (params.search) query.search = params.search;
    return query;
}

export const lineService = {
    async list(params?: LineListParams): Promise<Line[]> {
        try {
            const {data} = await apiClient.get<Line[]>(LINE_ENDPOINTS.myList, {
                params: toQueryParams(params),
            });
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async getMyLines(params?: LineListParams): Promise<Line[]> {
        try {
            const {data} = await apiClient.get<Line[]>(LINE_ENDPOINTS.myList, {
                params: params || {},
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

    async addMembers(lineId: string | number, userIds: (string | number)[]): Promise<void> {
        try {
            await apiClient.post(LINE_MEMBER_ENDPOINTS.add(lineId), {
                user_ids: userIds,
            });
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async removeMembers(lineId: string | number, userIds: (string | number)[]): Promise<{
        detail: string;
        count: number
    }> {
        try {
            const {data} = await apiClient.post(LINE_MEMBER_ENDPOINTS.remove(lineId), {
                user_ids: userIds,
            });
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async getStaff(lineId: string | number, params?: StaffLineListParams): Promise<StaffLineListResponse> {
        try {
            const {data} = await apiClient.get<StaffLineListResponse>(LINE_STAFF_ENDPOINTS.list(lineId), {
                params: params || {},
            });
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },
    async addStaff(lineId: string | number, staffIds: (string | number)[]): Promise<{ detail: string; count: number }> {
        try {
            const {data} = await apiClient.post(LINE_STAFF_ENDPOINTS.add(lineId), {
                staff_ids: staffIds,
            });
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async removeStaff(lineId: string | number, staffIds: (string | number)[]): Promise<{
        detail: string;
        count: number
    }> {
        try {
            const {data} = await apiClient.post(LINE_STAFF_ENDPOINTS.remove(lineId), {
                staff_ids: staffIds,
            });
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },
};