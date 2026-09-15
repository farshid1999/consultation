import { apiClient } from "@/lib/axios";
import { USER_ENDPOINTS } from "@/services/api/endpoints";
import type { UserDetail } from "@/types/Users";

export const userService = {
  getMyProfile: async (): Promise<UserDetail> => {
    const res = await apiClient.get<UserDetail>(USER_ENDPOINTS.me);
    return res.data;
  },
};