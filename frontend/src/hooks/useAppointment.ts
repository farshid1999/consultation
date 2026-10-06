import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointmentService";
import type {
  AppointmentListItem,
  AppointmentDetail,
  AppointmentCreateInput,
  AppointmentUpdateInput,
} from "@/types/Appointment";
import type { Paginated, ListQueryParams } from "@/types";
import {toast} from "sonner";

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


export const useCreateAppointmentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { line_id: string; description?: string }) =>
      appointmentService.createRequest(data),
    onSuccess: () => {
      toast.success("درخواست نوبت شما با موفقیت ثبت شد.");
      queryClient.invalidateQueries({ queryKey: KEYS.memberList() });
    },
  });
};

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

  return useMutation({
    mutationFn: (data: AppointmentUpdateInput) =>
      appointmentService.update(id, data),

    onSuccess: () => {
      toast.success("نوبت با موفقیت بروزرسانی شد.");
      // اینوالید کردن کوئری‌های مرتبط برای رفرش شدن لیست و جزئیات
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", id] });
    },

    onError: (err: any) => {
      // خطا توسط فرم هندل می‌شود، اما یک توست کلی هم نمایش می‌دهیم
      if (!err.fieldErrors) {
        toast.error(err.message || "خطا در بروزرسانی نوبت");
      }
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
