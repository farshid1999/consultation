"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiSave } from "react-icons/fi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLineMembers } from "@/hooks/useLines";
import {
  useMemberConsultationForm,
  useMyResponse,
  useSubmitResponse,
  useUpdateResponse,
} from "@/hooks/useConsultation";
import { responseSchema, type ResponseFormValues } from "@/schemas/consultations";
import ConsultationResponseFormFields from "@/forms/consultation/ConsultationResponseFormFields";

function buildResponseFormData(values: ResponseFormValues, keptFileIds: string[], isEditMode: boolean): FormData {
  const formData = new FormData();
  formData.append("title", values.title);
  if (values.description) formData.append("description", values.description);

  // مهم: به‌جای append جدا برای هر id (که وقتی آرایه خالی باشد، اصلاً
  // هیچ کلیدی به FormData اضافه نمی‌شود و بک‌اند "غایب" را با "خالی"
  // اشتباه می‌گیرد)، کل لیست را همیشه به‌صورت یک رشته‌ی JSON می‌فرستیم
  // — حتی وقتی خالی است ("[]")، این کلید همیشه در درخواست حاضر است.
  if (isEditMode) {
    formData.append("existing_file_ids", JSON.stringify(keptFileIds));
  }

  if (values.files && values.files.length > 0) {
    values.files.forEach((file) => {
      formData.append("files", file);
    });
  }
  return formData;
}


export default function ConsultationResponseForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const lineId = params.id;

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: membersData, isLoading: isMembersLoading } = useLineMembers(lineId);

  const currentMember = useMemo(() => {
    if (!user || !membersData?.results) return null;
    return membersData.results.find((m: any) => String(m.user.id) === String(user.id));
  }, [user, membersData]);

  const memberId = currentMember?.id;

  const { data: form, isLoading: isFormLoading } = useMemberConsultationForm(lineId);

  // پاسخ موجود (اگر قبلاً ارسال شده) — 404 یعنی هنوز چیزی ثبت نشده، حالت عادی.
  const { data: existingResponse, isLoading: isResponseLoading } = useMyResponse(
    form?.id ?? null,
    memberId ?? null
  );

  const isEditMode = !!existingResponse;

  const submitResponse = useSubmitResponse(form?.id || "", memberId || "");
  const updateResponse = useUpdateResponse(form?.id || "", memberId || "");

  const [keptFileIds, setKeptFileIds] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      title: "",
      description: "",
      files: [],
    },
  });

  // پر کردن فرم وقتی پاسخ قبلی رسید — فقط یک‌بار در ابتدا، نه با هر
  // رفرچ پس‌زمینه (همان الگوی محافظتی که در ContentUpdateForm گرفتیم).
  // مهم: فقط یک‌بار (اولین باری که existingResponse می‌رسد) reset و
  // مقداردهی keptFileIds انجام می‌شود. قبلاً این effect با هر تغییر
  // رفرنس existingResponse دوباره اجرا می‌شد — از جمله رفرچ‌های
  // پس‌زمینه‌ی خودکار react-query (مثلاً وقتی پنجره دوباره فوکوس
  // می‌گیرد) — یعنی toggle حذف فایلِ کاربر درست قبل از submit به
  // حالت اولیه (همه‌چیز نگه‌داشته‌شده) برمی‌گشت. همان الگویی که برای
  // ContentUpdateForm گرفتیم، اینجا هم لازم بود ولی جا افتاده بود.
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (existingResponse && !hasInitialized.current) {
      hasInitialized.current = true;
      reset({
        title: existingResponse.title,
        description: existingResponse.description || "",
        files: [],
      });
      setKeptFileIds(existingResponse.forms?.map((f) => String(f.id)) || []);
    }
  }, [existingResponse, reset]);

  const handleToggleKeptFile = (id: string) => {
    setKeptFileIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const onSubmit = async (values: ResponseFormValues) => {
    if (!form || !memberId) return;

    const fd = buildResponseFormData(values, keptFileIds, isEditMode);

    try {
      if (isEditMode) {
        await updateResponse.mutateAsync(fd);
      } else {
        await submitResponse.mutateAsync(fd);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isUserLoading || isMembersLoading || isFormLoading || isResponseLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block"></span>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-10 text-cream/60">
        فرم مشاوره‌ای برای این بخش یافت نشد.
      </div>
    );
  }

  if (!memberId) {
    return (
      <div className="text-center py-10 text-red-400">
        شما عضو این بخش نیستید یا دسترسی ندارید.
      </div>
    );
  }

  const isPending = submitResponse.isPending || updateResponse.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <ConsultationResponseFormFields
        control={control}
        errors={errors}
        formDetails={form}
        mode={isEditMode ? "edit" : "create"}
        existingFiles={existingResponse?.forms || []}
        keptFileIds={keptFileIds}
        onToggleKeptFile={handleToggleKeptFile}
      />

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-cream/10">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-cream/20 px-6 py-3 text-sm font-medium text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-gold-soft to-gold px-8 py-3 text-sm font-bold text-deep shadow-gold transition-all hover:shadow-[0_10px_30px_-5px_rgba(201,162,77,0.4)] disabled:opacity-60"
        >
          <FiSave size={16} />
          {isPending ? "در حال ارسال..." : isEditMode ? "ذخیره ویرایش" : "ثبت نهایی پاسخ"}
        </button>
      </div>
    </form>
  );
}