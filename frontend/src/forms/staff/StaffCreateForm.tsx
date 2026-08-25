"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control } from "react-hook-form";
import { toast } from "sonner";
import { staffCreateSchema, type StaffCreateFormValues } from "@/schemas/staff";
import { useCreateStaff } from "@/hooks/useStaff";
import { toApiDateString } from "@/lib/date";
import type { ApiError, StaffCreateInput } from "@/types";
import StaffFormFields from "./StaffFormFields";

const DEFAULT_VALUES: StaffCreateFormValues = {
  employee_code: "",
  position: "",
  hire_date: null as unknown as Date,
  user: {
    username: "",
    password: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    email: "",
    land_line: "",
    is_student: false,
    degree: "",
    job: "",
    sport_discipline: "",
    professional_background: "",
    referral_code: "",
    avatar: null,
    bio: "",
    birth_date: null,
    informations: [],
  },
};

function cleanInformations(
  items: StaffCreateFormValues["user"]["informations"]
): StaffCreateInput["user"]["informations"] {
  return (items ?? []).map((item) => ({
    title: item.title,
    text: item.text || undefined,
    file: item.file ?? undefined,
    children: item.children && item.children.length > 0 ? cleanInformations(item.children) : undefined,
  }));
}

export default function StaffCreateForm() {
  const router = useRouter();
  const createStaff = useCreateStaff();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StaffCreateFormValues>({
    resolver: zodResolver(staffCreateSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = async (values: StaffCreateFormValues) => {
    const payload: StaffCreateInput = {
      employee_code: values.employee_code,
      position: values.position,
      hire_date: toApiDateString(values.hire_date) as string,
      user: {
        username: values.user.username,
        password: values.user.password,
        phone_number: values.user.phone_number,
        first_name: values.user.first_name || undefined,
        last_name: values.user.last_name || undefined,
        email: values.user.email || undefined,
        land_line: values.user.land_line || undefined,
        is_student: values.user.is_student,
        degree: values.user.degree || undefined,
        job: values.user.job || undefined,
        sport_discipline: values.user.sport_discipline || undefined,
        professional_background: values.user.professional_background || undefined,
        referral_code: values.user.referral_code || undefined,
        address: values.user.address,
        club: values.user.club,
        avatar: values.user.avatar ?? undefined,
        bio: values.user.bio || undefined,
        birth_date: toApiDateString(values.user.birth_date ?? undefined) ?? null,
        informations: cleanInformations(values.user.informations),
      },
    };

    try {
      const result = await createStaff.mutateAsync(payload);
      toast.success("کارمند با موفقیت ایجاد شد.");
      router.push(`/staff/${result.id}`);
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message ?? "ایجاد کارمند با خطا مواجه شد.");
      Object.entries(apiError.fieldErrors ?? {}).forEach(([field, messages]) => {
        setError(field as never, { type: "server", message: messages[0] });
      });
    }
  };

  return (
    // حذف dir="rtl" اگر در Layout اصلی ست شده، اما نگه داشتن آن ضرری ندارد
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">

      <StaffFormFields control={control as unknown as Control<any>} errors={errors} mode="create" />

      {/* بخش دکمه‌ها با استایل جدید */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          انصراف
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          // تغییر گرادیانت و سایه برای تم روشن
          className="rounded-xl bg-gradient-to-br from-[#c9a24d] to-[#d4af37] px-8 py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(201,162,77,0.3)] transition-all hover:shadow-[0_6px_16px_rgba(201,162,77,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              در حال ثبت...
            </span>
          ) : (
            "ثبت کارمند"
          )}
        </button>
      </div>
    </form>
  );
}