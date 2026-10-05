import { apiClient } from "@/lib/axios";
import { PUBLIC_STAFF_ENDPOINTS } from "@/services/api/endpoints";
import { extractApiError } from "@/services/api/errors";
import type { PublicStaff, PublicStaffListParams } from "@/types/publicStaff";

export const publicStaffService = {
  async list(params?: PublicStaffListParams): Promise<PublicStaff[]> {
    try {
      const { data } = await apiClient.get<PublicStaff[]>(
        PUBLIC_STAFF_ENDPOINTS.list,
        { params: { search: params?.search || undefined, line_id: params?.line_id || undefined } },
      );
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },

  async detail(id: string): Promise<PublicStaff> {
    try {
      const { data } = await apiClient.get<PublicStaff>(PUBLIC_STAFF_ENDPOINTS.detail(id));
      return data;
    } catch (error) {
      throw extractApiError(error);
    }
  },
};