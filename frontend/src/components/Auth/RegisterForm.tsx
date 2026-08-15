"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Switch } from "@/components/ui/Inputs";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth";
import { useRegister } from "@/hooks/useAuth";
import {
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiCopy,
  FiCheck,
} from "react-icons/fi";

export interface RegisterFormProps {
  onSuccess?: () => void;
  onGoToLogin?: () => void;
}

export default function RegisterForm({
  onSuccess,
  onGoToLogin,
}: RegisterFormProps) {
  const { mutate: submitRegister, isPending, error } = useRegister();
  const [registeredUser, setRegisteredUser] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { is_student: false },
  });

  const onSubmit = (data: RegisterFormValues) => {
    submitRegister(data, {
      onSuccess: () => {
        setRegisteredUser({ username: data.username, password: data.password });
        onSuccess?.();
      },
    });
  };

  const handleCopy = () => {
    if (!registeredUser) return;
    navigator.clipboard.writeText(registeredUser.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (registeredUser) {
    return (
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <FiCheckCircle className="text-5xl text-gold" />

        <div className="space-y-1">
          <p className="text-cream font-semibold text-lg">
            ثبت‌نام با موفقیت انجام شد
          </p>
          <p className="text-cream/60 text-sm">
            هم‌اکنون می‌توانید با اطلاعات زیر وارد شوید
          </p>
        </div>

        <div className="w-full rounded-xl bg-cream/5 border border-cream/10 p-4 space-y-3 text-right">
          <div className="flex justify-between items-center">
            <span className="text-cream/50 text-sm">نام کاربری</span>
            <span className="text-cream font-medium">
              {registeredUser.username}
            </span>
          </div>
          <div className="w-full h-px bg-cream/10" />
          <div className="flex justify-between items-center gap-2">
            <span className="text-cream/50 text-sm">رمز عبور</span>
            <div className="flex items-center gap-2">
              <span className="text-cream font-medium tracking-widest">
                {"•".repeat(registeredUser.password.length)}
              </span>
              <button
                onClick={handleCopy}
                className="text-cream/40 hover:text-gold transition-colors"
                title="کپی رمز عبور"
              >
                {copied ? <FiCheck className="text-gold" /> : <FiCopy />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onGoToLogin}
          className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-deep transition-opacity hover:opacity-90"
        >
          ورود به حساب
        </button>
      </div>
    );
  }

  // ── Register Form ──────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-gold mb-2">
          اطلاعات حساب
        </legend>
        <Input
          label="نام کاربری"
          placeholder="نام کاربری"
          leftIcon={<FiUser />}
          required
          error={errors.username?.message}
          {...field("username")}
        />
        <Input
          label="رمز عبور"
          type="password"
          placeholder="رمز عبور"
          leftIcon={<FiLock />}
          required
          error={errors.password?.message}
          {...field("password")}
        />
        <Input
          label="ایمیل"
          type="email"
          placeholder="example@email.com"
          leftIcon={<FiMail />}
          required
          error={errors.email?.message}
          {...field("email")}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-gold mb-2">
          اطلاعات شخصی
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="نام"
            placeholder="نام"
            required
            error={errors.first_name?.message}
            {...field("first_name")}
          />
          <Input
            label="نام خانوادگی"
            placeholder="نام خانوادگی"
            required
            error={errors.last_name?.message}
            {...field("last_name")}
          />
        </div>
        <Input
          label="شماره موبایل"
          placeholder="09123456789"
          leftIcon={<FiPhone />}
          required
          error={errors.phone_number?.message}
          {...field("phone_number")}
        />
        <Input
          label="رشته ورزشی"
          placeholder="رشته ورزشی خود را وارد کنید"
          error={errors.sport_discipline?.message}
          {...field("sport_discipline")}
        />
        <Input
          label="شغل"
          placeholder="شغل خود را وارد کنید"
          error={errors.job?.message}
          {...field("job")}
        />
        <Input
          label="مدرک تحصیلی"
          placeholder="مدرک تحصیلی"
          error={errors.degree?.message}
          {...field("degree")}
        />
        <Switch
          label="دانشجو هستم"
          description="در صورتی که دانشجو هستید این گزینه را فعال کنید"
          {...field("is_student")}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-gold mb-2">
          اطلاعات باشگاه
        </legend>
        <Input
          label="نام باشگاه"
          placeholder="نام باشگاه"
          required
          error={errors.club?.name?.message}
          {...field("club.name")}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="کشور"
            placeholder="کشور"
            required
            error={errors.club?.address?.country?.message}
            {...field("club.address.country")}
          />
          <Input
            label="استان"
            placeholder="استان"
            required
            error={errors.club?.address?.province?.message}
            {...field("club.address.province")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="شهر"
            placeholder="شهر"
            required
            error={errors.club?.address?.city?.message}
            {...field("club.address.city")}
          />
          <Input
            label="کد پستی"
            placeholder="کد پستی"
            error={errors.club?.address?.postal_code?.message}
            {...field("club.address.postal_code")}
          />
        </div>
        <Input
          label="آدرس"
          placeholder="آدرس دقیق باشگاه"
          leftIcon={<FiMapPin />}
          required
          error={errors.club?.address?.street?.message}
          {...field("club.address.street")}
        />
      </fieldset>

      {error && (
        <p className="text-xs text-red-400 text-right">
          {(error as any)?.detail ?? "خطایی رخ داد. دوباره تلاش کنید."}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-deep transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "در حال ثبت‌نام..." : "ثبت‌نام"}
      </button>
    </form>
  );
}
