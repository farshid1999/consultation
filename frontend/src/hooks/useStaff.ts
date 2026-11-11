import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {staffService} from "@/services/staffService";
import type {ListQueryParams, StaffCreateInput, StaffUpdateInput} from "@/types";
import {toast} from "sonner";

export const staffKeys = {
    all: ["staff"] as const,
    lists: () => [...staffKeys.all, "list"] as const,
    list: (params: ListQueryParams) => [...staffKeys.lists(), params] as const,
    details: () => [...staffKeys.all, "detail"] as const,
    detail: (id: string) => [...staffKeys.details(), id] as const,
    profile: ["staff-profile"] as const,
};

export function useStaffProfile() {
  return useQuery({
    queryKey: staffKeys.profile,
    queryFn: () => staffService.getProfile(),
  });
}

export function useUpdateStaffProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => staffService.updateProfile(payload),
    onSuccess: () => {
      toast.success("پروفایل با موفقیت بروزرسانی شد.");
      queryClient.invalidateQueries({ queryKey: staffKeys.profile });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "خطا در بروزرسانی پروفایل");
    },
  });
}


export function useStaffList(params: ListQueryParams = {}) {
    return useQuery({
        queryKey: staffKeys.list(params),
        queryFn: () => staffService.list(params),
        placeholderData: (previous) => previous,
    });
}


export function useStaffDetail(id: string | null) {
    return useQuery({
        queryKey: staffKeys.detail(id ?? ""),
        queryFn: () => staffService.detail(id as string),
        enabled: !!id,
    });
}


export function useCreateStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: StaffCreateInput) => staffService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: staffKeys.lists()});
        },
    });
}


export function useUpdateStaff(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: StaffUpdateInput) => staffService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: staffKeys.lists()});
            queryClient.invalidateQueries({queryKey: staffKeys.detail(id)});
        },
    });
}

export function useDeleteStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => staffService.remove(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({queryKey: staffKeys.lists()});
            queryClient.removeQueries({queryKey: staffKeys.detail(id)});
        },
    });
}
