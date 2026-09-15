import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointmentService";
import type {
  AppointmentListItem,
  AppointmentDetail,
  AppointmentCreateInput,
  AppointmentUpdateInput,
} from "@/types/Appointment";
import type { Paginated, ListQueryParams } from "@/types";

const KEYS = {
  adminList: (params?: ListQueryParams) =>
    ["appointments", "admin", "list", params] as const,

  staffList: (params?: ListQueryParams) =>
    ["appointments", "staff", "list", params] as const,

  staffDetail: (id: string | number) =>
    ["appointments", "staff", "detail", id] as const,

  memberList: (params?: ListQueryParams) =>
    ["appointments", "member", "list", params] as const,

  memberDetail: (id: string | number) =>
    ["appointments", "member", "detail", id] as const,
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const useAdminAppointments = (params?: ListQueryParams) =>
  useQuery<Paginated<AppointmentListItem>>({
    queryKey: KEYS.adminList(params),
    queryFn: () => appointmentService.adminList(params),
    staleTime: 0,
  });

// ── Staff ─────────────────────────────────────────────────────────────────────

export const useStaffAppointments = (params?: ListQueryParams) =>
  useQuery<Paginated<AppointmentListItem>>({
    queryKey: KEYS.staffList(params),
    queryFn: () => appointmentService.staffList(params),
    staleTime: 0,
  });

export const useStaffAppointmentDetail = (id: string | number) =>
  useQuery<AppointmentDetail>({
    queryKey: KEYS.staffDetail(id),
    queryFn: () => appointmentService.staffDetail(id),
    enabled: !!id,
  });

// ── Member ────────────────────────────────────────────────────────────────────

export const useMemberAppointments = (params?: ListQueryParams) =>
  useQuery<Paginated<AppointmentListItem>>({
    queryKey: KEYS.memberList(params),
    queryFn: () => appointmentService.memberList(params),
    staleTime: 0,
  });

export const useMemberAppointmentDetail = (id: string | number) =>
  useQuery<AppointmentDetail>({
    queryKey: KEYS.memberDetail(id),
    queryFn: () => appointmentService.memberDetail(id),
    enabled: !!id,
  });

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation<AppointmentDetail, Error, AppointmentCreateInput>({
    mutationFn: (data) => appointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useUpdateAppointment = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation<AppointmentDetail, Error, AppointmentUpdateInput>({
    mutationFn: (data) => appointmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: (id) => appointmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};