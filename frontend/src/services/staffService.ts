import { apiClient } from "@/lib/axios";
import { STAFF_ENDPOINTS } from "@/services/api/endpoints";
import { buildFormData, containsFile } from "@/services/api/formData";
import { extractApiError } from "@/services/api/errors";
import type {
  ListQueryParams,
  Paginated,
  StaffCreateInput,
  StaffDetail,
  StaffListItem,
  StaffMutationResult,
  StaffUpdateInput,
} from "@/types";

function toQueryParams(params: ListQueryParams = {}): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (params.page) query.page = params.page;
  if (params.search) query.search = params.search;
  if (params.ordering) query.ordering = params.ordering;
  return query;
}

export const staffService = {
  /** GET /accounts/staff/ — paginated, search & ordering supported server-side (search_fields / ordering_fields on the view). */
  async list(params?: ListQueryParams): Promise<Paginated<StaffListItem>> {
    try {
      const { data } = await apiClient.get<Paginated<StaffListItem>>(STAFF_ENDPOINTS.list, {
        params: toQueryParams(params),
      });
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /** GET /accounts/staff/:id/ */
  async detail(id: number): Promise<StaffDetail> {
    try {
      const { data } = await apiClient.get<StaffDetail>(STAFF_ENDPOINTS.detail(id));
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /**
   * POST /accounts/staff/create/
   * Sends multipart/form-data automatically whenever the payload carries a
   * File anywhere (top-level avatar, or nested inside informations[].file
   * / informations[].children[].file at any depth) — otherwise plain JSON.
   */
  async create(payload: StaffCreateInput): Promise<StaffMutationResult> {
    try {
      const hasFile = containsFile(payload);
      const { data } = await apiClient.post<StaffMutationResult>(
        STAFF_ENDPOINTS.create,
        hasFile ? buildFormData(payload as unknown as Record<string, unknown>) : payload,
        hasFile ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
      );
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /** PATCH /accounts/staff/:id/update/ — partial update, same file-detection rule as create. */
  async update(id: number, payload: StaffUpdateInput): Promise<StaffMutationResult> {
    try {
      const hasFile = containsFile(payload);
      const { data } = await apiClient.patch<StaffMutationResult>(
        STAFF_ENDPOINTS.update(id),
        hasFile ? buildFormData(payload as unknown as Record<string, unknown>) : payload,
        hasFile ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
      );
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  /** DELETE /accounts/staff/:id/delete/ */
  async remove(id: number): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.delete<{ message: string }>(STAFF_ENDPOINTS.delete(id));
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },
};
