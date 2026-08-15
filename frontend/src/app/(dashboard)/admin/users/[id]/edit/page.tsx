"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, type UpdateUserFormValues } from "@/schemas/user";
import { useUser, useUpdateUser } from "@/hooks/useUsers";
import { Input, Switch } from "@/components/ui/Inputs";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const { data: user, isLoading } = useUser(userId);
  const { mutate: updateUser, isPending, error } = useUpdateUser(userId);

  const {
    register: field,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        land_line: user.land_line ?? "",
        is_student: user.is_student,
        degree: user.degree ?? "",
        job: user.job ?? "",
        sport_discipline: user.sport_discipline ?? "",
        bio: user.bio ?? "",
        address: user.address ?? undefined,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UpdateUserFormValues) => {
    updateUser(data, {
      onSuccess: () => router.push("/admin/users"),
    });
  };

  if (isLoading) {
    return <div className="text-cream/40 text-sm">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="text-cream/40 hover:text-cream transition-colors">
          <FiArrowRight size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-cream">ویرایش کاربر</h1>
          <p className="text-cream/40 text-sm mt-1">@{user?.username}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gold border-b border-cream/10 pb-2">اطلاعات حساب</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="نام کاربری" placeholder="نام کاربری" error={errors.username?.message} {...field("username")} />
            <Input label="رمز عبور جدید" type="password" placeholder="خالی بگذارید اگر تغییر نمی‌دهید" error={errors.password?.message} {...field("password")} />
          </div>
          <Input label="ایمیل" type="email" placeholder="example@email.com" error={errors.email?.message} {...field("email")} />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gold border-b border-cream/10 pb-2">اطلاعات شخصی</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="نام" placeholder="نام" error={errors.first_name?.message} {...field("first_name")} />
            <Input label="نام خانوادگی" placeholder="نام خانوادگی" error={errors.last_name?.message} {...field("last_name")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="شماره موبایل" placeholder="09123456789" error={errors.phone_number?.message} {...field("phone_number")} />
            <Input label="تلفن ثابت" placeholder="021..." error={errors.land_line?.message} {...field("land_line")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="شغل" placeholder="شغل" error={errors.job?.message} {...field("job")} />
            <Input label="مدرک تحصیلی" placeholder="مدرک تحصیلی" error={errors.degree?.message} {...field("degree")} />
          </div>
          <Input label="رشته ورزشی" placeholder="رشته ورزشی" error={errors.sport_discipline?.message} {...field("sport_discipline")} />
          <Switch label="دانشجو" description="آیا این کاربر دانشجو است؟" {...field("is_student")} />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gold border-b border-cream/10 pb-2">آدرس</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="کشور" placeholder="کشور" error={errors.address?.country?.message} {...field("address.country")} />
            <Input label="استان" placeholder="استان" error={errors.address?.province?.message} {...field("address.province")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="شهر" placeholder="شهر" error={errors.address?.city?.message} {...field("address.city")} />
            <Input label="کد پستی" placeholder="کد پستی" error={errors.address?.postal_code?.message} {...field("address.postal_code")} />
          </div>
          <Input label="آدرس" placeholder="آدرس دقیق" error={errors.address?.street?.message} {...field("address.street")} />
        </section>

        {error && (
          <p className="text-xs text-red-400">
            {(error as any)?.detail ?? "خطایی رخ داد."}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-gold text-deep text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
          <Link
            href="/admin/users"
            className="px-6 py-2.5 rounded-xl border border-cream/20 text-cream/60 text-sm hover:text-cream hover:border-cream/40 transition-colors"
          >
            انصراف
          </Link>
        </div>

      </form>
    </div>
  );
}