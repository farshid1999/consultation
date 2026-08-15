"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Inputs";
import { loginSchema, type LoginFormValues } from "@/schemas/auth";
import { useLogin } from "@/hooks/useAuth";
import { tokenService } from "@/lib/auth/tokenService";
import { FiUser, FiLock } from "react-icons/fi";

export interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: (res) => {
        if (res?.access) tokenService.setAccessToken(res.access);
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="نام کاربری"
        placeholder="نام کاربری خود را وارد کنید"
        leftIcon={<FiUser />}
        error={errors.username?.message}
        {...register("username")}
      />

      <Input
        label="رمز عبور"
        type="password"
        placeholder="رمز عبور خود را وارد کنید"
        leftIcon={<FiLock />}
        error={errors.password?.message}
        {...register("password")}
      />

      {error && (
        <p className="text-xs text-red-400 text-right">
          {(error as any)?.non_field_errors?.[0] ?? "نام کاربری یا رمز عبور اشتباه است."}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-deep transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
}