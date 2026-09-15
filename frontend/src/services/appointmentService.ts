import { apiClient } from "@/lib/axios";
import { APPOINTMENT_ENDPOINTS } from "@/services/api/endpoints";
import type {
  AppointmentListItem,
  AppointmentDetail,
  AppointmentCreateInput,
  AppointmentUpdateInput,
} from "@/types/Appointment";
import type { Paginated, ListQueryParams } from "@/types";

export const appointmentService = {
  // ── Admin ──────────────────────────────────────────────────────────────────

  adminList: async (
    params?: ListQueryParams,
  ): Promise<Paginated<AppointmentListItem>> => {
    const res = await apiClient.get<Paginated<AppointmentListItem>>(
      APPOINTMENT_ENDPOINTS.adminList,
      { params },
    );
    return res.data;
  },

  // ── Staff ──────────────────────────────────────────────────────────────────

  staffList: async (
    params?: ListQueryParams,
  ): Promise<Paginated<AppointmentListItem>> => {
    const res = await apiClient.get<Paginated<AppointmentListItem>>(
      APPOINTMENT_ENDPOINTS.staffList,
      { params },
    );
    return res.data;
  },

  staffDetail: async (id: string | number): Promise<AppointmentDetail> => {
    const res = await apiClient.get<AppointmentDetail>(
      APPOINTMENT_ENDPOINTS.staffDetail(id),
    );
    return res.data;
  },

  // ── Member ─────────────────────────────────────────────────────────────────

  memberList: async (
    params?: ListQueryParams,
  ): Promise<Paginated<AppointmentListItem>> => {
    const res = await apiClient.get<Paginated<AppointmentListItem>>(
      APPOINTMENT_ENDPOINTS.memberList,
      { params },
    );
    return res.data;
  },

  memberDetail: async (id: string | number): Promise<AppointmentDetail> => {
    const res = await apiClient.get<AppointmentDetail>(
      APPOINTMENT_ENDPOINTS.memberDetail(id),
    );
    return res.data;
  },

  // ── CRUD ───────────────────────────────────────────────────────────────────

  create: async (data: AppointmentCreateInput): Promise<AppointmentDetail> => {
    const res = await apiClient.post<AppointmentDetail>(
      APPOINTMENT_ENDPOINTS.create,
      data,
    );
    return res.data;
  },

  update: async (
    id: string | number,
    data: AppointmentUpdateInput,
  ): Promise<AppointmentDetail> => {
    const res = await apiClient.patch<AppointmentDetail>(
      APPOINTMENT_ENDPOINTS.update(id),
      data,
    );
    return res.data;
  },

  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(APPOINTMENT_ENDPOINTS.delete(id));
  },
};