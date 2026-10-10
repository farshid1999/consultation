"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/inputs";
import { loginSchema, type LoginFormValues } from "@/schemas/auth";
import { useLogin } from "@/hooks/useAuth";
import { tokenService } from "@/lib/auth/tokenService";
import { FiUser, FiLock } from "react-icons/fi";
import TermsModal from "@/components/Auth/TermsModal";

export interface LoginFormProps {
  onSuccess?: () => void;
  onGoToRegister?: () => void;
}

export default function LoginForm({
  onSuccess,
  onGoToRegister,
}: LoginFormProps) {
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: async (res) => {
        if (!res?.access) return;
        tokenService.setAccessToken(res.access);

        try {
          const { users } = await import("@/services/user");
          const roleData = await users.getUserRole();

          if (roleData.is_super || roleData.roles.includes("admin")) {
            router.push("/admin");
          } else if (roleData.is_staff) {
            router.push("/staff");
          } else {
            router.push("/member/lines");
          }
        } catch (err) {
          console.error("Failed to fetch user role", err);
          router.push("/member/lines");
        }

        onSuccess?.();
      },
    });
  };

  return (
    <>
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

        <label className="flex cursor-pointer items-center gap-2 text-sm text-cream/80">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-gold"
          />
          <span>
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="font-semibold text-gold transition-opacity hover:opacity-80"
            >
              قوانین و مقررات
            </button>{" "}
            را می‌پذیرم
          </span>
        </label>

        {error && (
          <p className="text-xs text-red-400 text-right">
            {(error as any)?.non_field_errors?.[0] ??
              "نام کاربری یا رمز عبور اشتباه است."}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !acceptTerms}
          className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-deep transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "در حال ورود..." : "ورود"}
        </button>

        <p className="text-center text-sm text-cream/60">
          حساب کاربری ندارید؟{" "}
          <button
            type="button"
            onClick={() => {
              if (onGoToRegister) onGoToRegister();
              else router.push("/register");
            }}
            className="font-semibold text-gold transition-opacity hover:opacity-80"
          >
            ثبت‌نام کنید
          </button>
        </p>
      </form>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </>
  );
}
