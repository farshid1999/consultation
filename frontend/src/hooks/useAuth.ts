import {useMutation, useQueryClient} from "@tanstack/react-query";
import { auth, type LoginPayload, type RegisterPayload } from "@/services/auth";

export const QUERY_KEY = ["current-user"];

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginPayload) => auth.login(data),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterPayload) => auth.register(data),
  });


export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => auth.logout(),

        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: QUERY_KEY,
            });
        },
    });
};

export const useVerify = () =>
  useMutation({
    mutationFn: () => auth.verify(),
  });
