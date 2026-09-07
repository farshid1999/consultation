"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // 1. ایمپورت useRouter
import { Input } from "@/components/ui/inputs"; // اصلاح مسیر Inputs (حروف کوچک)
import { loginSchema, type LoginFormValues } from "@/schemas/auth";
import { useLogin, useUserRole } from "@/hooks/useAuth"; // 2. ایمپورت صحیح هوک نقش
import { tokenService } from "@/lib/auth/tokenService";
import { FiUser, FiLock } from "react-icons/fi";
import { queryClient } from "@/lib/react-query"; // فرض بر وجود کلاینت کوئری برای اینوالید کردن کش

export interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  // ما از این هوک برای خواندن داده استفاده نمی‌کنیم، بلکه برای دسترسی به تابع refetch استفاده می‌کنیم
  // یا می‌توانیم مستقیماً سرویس را صدا بزنیم.
  // روش تمیزتر: استفاده از هوک و فراخوانی دستی آن پس از لاگین

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
        if (res?.access) {
          tokenService.setAccessToken(res.access);

          // 3. دریافت نقش‌های کاربر بلافاصله پس از لاگین
          // برای اطمینان از اینکه کش قدیمی نیست، می‌توانیم کش را پاک کنیم یا مستقیماً سرویس را صدا بزنیم
          try {
            // فرض بر این است که سرویس auth متد getUserRole دارد
            import("@/services/user").then(async ({ users }) => {
              const roleData = await users.getUserRole();

              const isAdmin = roleData.roles.includes("admin");
              const isStaff = roleData.is_staff;
              const isSuper = roleData.is_super;
              if (isSuper) {
                router.push("/admin");
              }else if (isAdmin) {
                router.push("/admin"); // مسیر صفحه ادمین
              } else if (isStaff) {
                router.push("/staff"); // مسیر صفحه استاف
              } else {
                router.push("/member"); // مسیر صفحه ممبر
              }

              onSuccess?.();
            });
          } catch (err) {
            console.error("Failed to fetch user role", err);
            // در صورت خطا، به یک صفحه پیش‌فرض بروید
            router.push("/login");
          }
        }
      },
      onError: (err) => {
        console.error(err);
      }
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