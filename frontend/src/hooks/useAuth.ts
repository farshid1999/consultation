import { useMutation } from "@tanstack/react-query";
import { auth } from "@/services/auth";
import { tokenService } from "@/lib/auth/tokenService";

// ── Login ─────────────────────────────────────────────────────────────────────

export const useLogin = () =>
  useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      auth.login(data),
    onSuccess: (res) => {
      if (res?.access) tokenService.setAccessToken(res.access);
    },
  });

// ── Register ──────────────────────────────────────────────────────────────────

export const useRegister = () =>
  useMutation({
    mutationFn: (data: Parameters<typeof auth.register>[0]) =>
      auth.register(data),
    onSuccess: (res) => {
      if (res?.access) tokenService.setAccessToken(res.access);
    },
  });

// ── Logout ────────────────────────────────────────────────────────────────────

export const useLogout = () =>
  useMutation({
    mutationFn: () => auth.logout(),
  });

// ── Verify ────────────────────────────────────────────────────────────────────

export const useVerify = () =>
  useMutation({
    mutationFn: () => auth.verify(),
  });