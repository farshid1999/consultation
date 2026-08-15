"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control } from "react-hook-form";
import { toast } from "sonner";
import { staffUpdateSchema, type StaffUpdateFormValues } from "@/schemas/staff";
import type { InformationFormValues } from "@/schemas/information";
import { useUpdateStaff } from "@/hooks/useStaff";
import { toApiDateString, fromApiDateString } from "@/lib/date";
import type { ApiError, InformationRead, StaffDetail, StaffUpdateInput } from "@/types";
import StaffFormFields from "./StaffFormFields";

function mapInformation(info: InformationRead): InformationFormValues {
  return {
    title: info.title,
    text: info.text ?? "",
    file: null,
    children: info.children?.map(mapInformation) ?? [],
  };
}

function mapDetailToFormValues(staff: StaffDetail): StaffUpdateFormValues {
  const { user } = staff;
  return {
    employee_code: staff.employee_code,
    position: staff.position,
    hire_date: fromApiDateString(staff.hire_date),
    user: {
      username: user.username,
      password: "",
      phone_number: user.phone_number,
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      land_line: user.land_line ?? "",
      is_student: user.is_student,
      degree: user.degree ?? "",
      job: user.job ?? "",
      sport_discipline: user.sport_discipline ?? "",
      professional_background: user.professional_background ?? "",
      referral_code: user.referral_code ?? "",
      address: user.address
        ? {
            country: user.address.country,
            province: user.address.province,
            city: user.address.city,
            street: user.address.street,
            postal_code: user.address.postal_code,
            description: user.address.description ?? "",
          }
        : undefined,
      club: user.club
        ? {
            name: user.club.name,
            address: {
              country: user.club.address.country,
              province: user.club.address.province,
              city: user.club.address.city,
              street: user.club.address.street,
              postal_code: user.club.address.postal_code,
              description: user.club.address.description ?? "",
            },
          }
        : undefined,
      avatar: null,
      bio: user.bio ?? "",
      birth_date: fromApiDateString(user.birth_date),
      informations: user.informations.map(mapInformation),
    },
  };
}

function cleanInformations(items?: InformationFormValues[]): InformationFormValues[] {
  return (items ?? []).map((item) => ({
    title: item.title,
    text: item.text || undefined,
    file: item.file ?? undefined,
    children: item.children && item.children.length > 0 ? cleanInformations(item.children) : undefined,
  }));
}

export default function StaffEditForm({ staff }: { staff: StaffDetail }) {
  const router = useRouter();
  const updateStaff = useUpdateStaff(staff.id);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StaffUpdateFormValues>({
    resolver: zodResolver(staffUpdateSchema),
    defaultValues: mapDetailToFormValues(staff),
  });

  const onSubmit = async (values: StaffUpdateFormValues) => {
    const payload: StaffUpdateInput = {
      employee_code: values.employee_code,
      position: values.position,
      hire_date: toApiDateString(values.hire_date ?? undefined),
      user: {
        username: values.user?.username,
        password: values.user?.password ? values.user.password : undefined,
        phone_number: values.user?.phone_number,
        first_name: values.user?.first_name || undefined,
        last_name: values.user?.last_name || undefined,
        email: values.user?.email || undefined,
        land_line: values.user?.land_line || undefined,
        is_student: values.user?.is_student,
        degree: values.user?.degree || undefined,
        job: values.user?.job || undefined,
        sport_discipline: values.user?.sport_discipline || undefined,
        professional_background: values.user?.professional_background || undefined,
        referral_code: values.user?.referral_code || undefined,
        address: values.user?.address,
        club: values.user?.club,
        avatar: values.user?.avatar ?? undefined,
        bio: values.user?.bio || undefined,
        birth_date: toApiDateString(values.user?.birth_date ?? undefined) ?? undefined,
        informations: cleanInformations(values.user?.informations) as never,
      },
    };

    try {
      await updateStaff.mutateAsync(payload);
      toast.success("تغییرات با موفقیت ذخیره شد.");
      router.push(`/staff/${staff.id}`);
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message ?? "ذخیره‌ی تغییرات با خطا مواجه شد.");
      Object.entries(apiError.fieldErrors ?? {}).forEach(([field, messages]) => {
        setError(field as never, { type: "server", message: messages[0] });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} dir="rtl" noValidate className="flex flex-col gap-6">
      {staff.user.avatar && (
        <div className="flex items-center gap-3 rounded-2xl border border-cream/10 bg-deep-2/30 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={staff.user.avatar} alt={staff.user.username} className="h-14 w-14 rounded-full object-cover" />
          <p className="text-xs text-cream/45">
            تصویر فعلی — برای تغییر، تصویر جدیدی را در بخش «اطلاعات شخصی» بارگذاری کنید.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-4 text-xs leading-relaxed text-cream/60">
        توجه: بخش «اطلاعات تکمیلی» در ویرایش به‌طور کامل جایگزین می‌شود. اگر برای موردی که قبلاً فایل داشته، فایل
        جدیدی انتخاب نکنید، فایل قبلی آن حذف خواهد شد.
      </div>

      <StaffFormFields
        control={control as unknown as Control<any>}
        errors={errors}
        mode="edit"
        initialShowAddress={Boolean(staff.user.address)}
        initialShowClub={Boolean(staff.user.club)}
      />

      <div className="flex items-center justify-end gap-3 border-t border-cream/10 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-cream/20 px-6 py-3 text-sm text-cream/70 transition-colors hover:border-cream/40"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-gradient-to-b from-gold-soft to-gold px-8 py-3 text-sm font-bold text-deep shadow-gold transition-opacity disabled:opacity-60"
        >
          {isSubmitting ? "در حال ذخیره..." : "ذخیره‌ی تغییرات"}
        </button>
      </div>
    </form>
  );
}
