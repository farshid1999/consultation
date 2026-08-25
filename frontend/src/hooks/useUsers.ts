import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { users } from "@/services/user";
import type { UserListItem, UserDetail, UserCreateInput, UserUpdateInput } from "@/types";
import type { Paginated, ListQueryParams } from "@/types";

const KEYS = {
  all: ["users"] as const,
  list: (params?: ListQueryParams) => ["users", "list", params] as const,
  detail: (id: number) => ["users", "detail", id] as const,
};

export const useUsers = (params?: ListQueryParams) =>
  useQuery<Paginated<UserListItem>>({
    queryKey: KEYS.list(params),
    queryFn: () => users.getUsers(params),
  });

export const useUser = (id: number) =>
  useQuery<UserDetail>({
    queryKey: KEYS.detail(id),
    queryFn: () => users.getUser(id),
    enabled: !!id,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<UserDetail, Error, UserCreateInput>({
    mutationFn: (data) => users.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
};

export const useUpdateUser = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<UserDetail, Error, UserUpdateInput>({
    mutationFn: (data) => users.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => users.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
};