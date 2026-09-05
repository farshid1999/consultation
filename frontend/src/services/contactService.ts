import { apiClient } from "@/lib/axios";
import { SITESETTING_ENDPOINTS } from "@/services/api/endpoints";
import type { ContactRequest, ContactRequestCreateInput } from "@/types/ContactRequest";
import type { Paginated, ListQueryParams } from "@/types";

export const contactService = {
  create: async (data: ContactRequestCreateInput): Promise<ContactRequest> => {
    const res = await apiClient.post<ContactRequest>(
      SITESETTING_ENDPOINTS.contactCreate,
      data
    );
    return res.data;
  },

  adminList: async (params?: ListQueryParams): Promise<Paginated<ContactRequest>> => {
    const res = await apiClient.get<Paginated<ContactRequest>>(
      SITESETTING_ENDPOINTS.contactList,
      { params }
    );
    return res.data;
  },

  adminDetail: async (id: number): Promise<ContactRequest> => {
    const res = await apiClient.get<ContactRequest>(
      SITESETTING_ENDPOINTS.contactDetail(id)
    );
    return res.data;
  },

  markAsRead: async (id: number): Promise<ContactRequest> => {
    const res = await apiClient.patch<ContactRequest>(
      SITESETTING_ENDPOINTS.contactDetail(id),
      { is_read: true }
    );
    return res.data;
  },
};