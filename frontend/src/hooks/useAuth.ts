import { useMutation } from "@tanstack/react-query";
import { auth, type LoginPayload, type RegisterPayload } from "@/services/auth";

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginPayload) => auth.login(data),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterPayload) => auth.register(data),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () => auth.logout(),
  });

export const useVerify = () =>
  useMutation({
    mutationFn: () => auth.verify(),
  });
