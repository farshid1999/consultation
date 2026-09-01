// services/contentService.ts

import { apiClient } from "@/lib/axios";
import { extractApiError } from "@/services/api/errors";
import { containsFile, buildFormData } from "@/services/api/formData";
import type {
  ContentCreateInput,
  ContentDetail,
  ContentListItem,
  ContentListParams,
  ContentUpdateInput,
  PaginatedResponse,
} from "@/types";
import { CONTENT_ENDPOINTS } from "@/services/api/endpoints";

export const contentService = {
  async create(payload: ContentCreateInput): Promise<unknown> {
    try {
      const hasFile = containsFile(payload);
      const { data } = await apiClient.post(
        CONTENT_ENDPOINTS.create,
        hasFile ? buildFormData(payload as unknown as Record<string, unknown>) : payload,
        hasFile ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
      );
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /**
   * PATCH /operations/contents/:id/update/
   * از همان قانون containsFile/buildFormData استفاده می‌کند که create
   * استفاده می‌کند — نه یک تابع objectToFormData جداگانه، چون آن تابع
   * فرمت bracket-notation تخت تولید می‌کرد که با NestedMultipartCreateMixin
   * سمت بک‌اند (که دنبال یک فیلد واحد به اسم "data" حاوی JSON می‌گردد)
   * سازگار نیست — همان کلاس باگی که ابتدای این پروژه برای Staff داشتیم.
   */
  async update(id: string, payload: ContentUpdateInput): Promise<unknown> {
    try {
      const hasFile = containsFile(payload);
      const { data } = await apiClient.patch(
        CONTENT_ENDPOINTS.edit(id),
        hasFile ? buildFormData(payload as unknown as Record<string, unknown>) : payload,
        hasFile ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
      );
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  async getList(params?: ContentListParams): Promise<PaginatedResponse<ContentListItem>> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<ContentListItem>>(
        CONTENT_ENDPOINTS.list,
        { params: params || {} }
      );
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  async getDetail(id: string): Promise<ContentDetail> {
    try {
      const { data } = await apiClient.get<ContentDetail>(CONTENT_ENDPOINTS.detail(id));
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  async getMemberContents(params?: ContentListParams): Promise<PaginatedResponse<ContentListItem>> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<ContentListItem>>(
        CONTENT_ENDPOINTS.memberList,
        { params: params || {} }
      );
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  async getMemberDetail(id: string): Promise<ContentDetail> {
    const { data } = await apiClient.get(CONTENT_ENDPOINTS.memberDetailContent(id));
    return data;
  },
};