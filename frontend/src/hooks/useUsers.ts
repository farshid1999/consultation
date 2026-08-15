import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { users } from "@/services/user";

const KEYS = {
  all: ["users"] as const,
  list: (params?: Record<string, string>) => ["users", "list", params] as const,
  detail: (id: number) => ["users", "detail", id] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────

export const useUsers = (params?: Record<string, string>) =>
  useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => users.getUsers(params),
  });

// ── Detail ────────────────────────────────────────────────────────────────────

export const useUser = (id: number) =>
  useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => users.getUser(id),
    enabled: !!id,
  });

// ── Create ────────────────────────────────────────────────────────────────────

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => users.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
};

// ── Update ────────────────────────────────────────────────────────────────────

export const useUpdateUser = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => users.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
};

// ── Delete ────────────────────────────────────────────────────────────────────

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => users.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
    },
  });
};