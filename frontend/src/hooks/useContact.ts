import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactService } from "@/services/contactService";
import type { ContactRequest, ContactRequestCreateInput } from "@/types/ContactRequest";
import type { Paginated, ListQueryParams } from "@/types";

const KEYS = {
  adminList: (params?: ListQueryParams) => ["contacts", "admin", "list", params] as const,
  adminDetail: (id: number) => ["contacts", "admin", "detail", id] as const,
};

export const useCreateContact = () => {
  return useMutation<ContactRequest, Error, ContactRequestCreateInput>({
    mutationFn: (data) => contactService.create(data),
  });
};

export const useAdminContacts = (params?: ListQueryParams) =>
  useQuery<Paginated<ContactRequest>>({
    queryKey: KEYS.adminList(params),
    queryFn: () => contactService.adminList(params),
    staleTime: 0,
  });

export const useAdminContactDetail = (id: number) =>
  useQuery<ContactRequest>({
    queryKey: KEYS.adminDetail(id),
    queryFn: () => contactService.adminDetail(id),
    enabled: !!id,
  });

export const useMarkAsRead = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<ContactRequest, Error, void>({
    mutationFn: () => contactService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};