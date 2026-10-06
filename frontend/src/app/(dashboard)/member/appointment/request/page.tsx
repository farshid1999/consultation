"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiSend } from "react-icons/fi";
import { useMyLines } from "@/hooks/useLines"; // مطمئن شوید این هوک وجود دارد
import { useCreateAppointmentRequest } from "@/hooks/useAppointment";
import { Textarea, Select } from "@/components/ui/inputs";
import GlassCard from "@/components/ui/GlassCard";
import { useEffect } from "react";

const requestSchema = z.object({
  line_id: z.string().min(1, "انتخاب بخش الزامی است"),
  description: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function MemberAppointmentRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // دریافت lineId از کوئری پارامتر (?lineId=...)
  const preSelectedLineId = searchParams.get("lineId");

  // فرض بر این است که useMyLines لیستی از لاین‌ها را برمی‌گرداند
  const { data: lines, isLoading: isLinesLoading } = useMyLines();
  const createRequest = useCreateAppointmentRequest();

  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { line_id: preSelectedLineId || "", description: "" },
  });

  // اگر lineId از قبل وجود داشت، آن را در فرم ست کن
  useEffect(() => {
    if (preSelectedLineId) {
      setValue("line_id", preSelectedLineId);
    }
  }, [preSelectedLineId, setValue]);

  const onSubmit = async (values: RequestFormValues) => {
    await createRequest.mutateAsync({
      line_id: values.line_id,
      description: values.description,
    });
    router.push("/member/appointments");
  };

  // آماده‌سازی آپشن‌ها برای سلکت با بررسی امن بودن داده‌ها
  // اگر lines یا results تعریف نشده باشند، یک آرایه خالی برمی‌گرداند
  const lineOptions = lines?.results?.map((l) => ({ value: l.id, label: l.title })) || [];

  // پیدا کردن نام لاین انتخاب شده برای نمایش
  const selectedLineName = lineOptions.find(l => l.value === preSelectedLineId)?.label;

  if (isLinesLoading) {
    return (
      <main dir="rtl" className="mx-auto max-w-2xl px-6 py-10 flex justify-center">
        <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block"></span>
      </main>
    );
  }

  return (
    <main dir="rtl" className="mx-auto max-w-2xl px-6 py-10">
      <GlassCard className="p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-cream">درخواست رزرو نوبت</h1>
          <p className="text-sm text-cream/50 mt-2">
            {selectedLineName
              ? `شما در حال درخواست نوبت برای بخش "${selectedLineName}" هستید.`
              : ""}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* اگر lineId از قبل بود، فیلد مخفی شود یا فقط نام نمایش داده شود */}
          {preSelectedLineId ? (
             <input type="hidden" name="line_id" value={preSelectedLineId} />
          ) : (
            <Controller
              name="line_id"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  label="انتخاب بخش"
                  options={lineOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  placeholder="لطفاً یک بخش را انتخاب کنید..."
                />
              )}
            />
          )}

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Textarea
                label="توضیحات تکمیلی (اختیاری)"
                rows={4}
                {...field}
                value={field.value ?? ""}
                error={fieldState.error?.message}
                placeholder="علت مراجعه یا توضیحات خاص..."
              />
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting || createRequest.isPending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold-soft to-gold py-3 text-sm font-bold text-deep shadow-gold transition-opacity disabled:opacity-60"
          >
            <FiSend size={16} />
            {createRequest.isPending ? "در حال ارسال..." : "ثبت درخواست"}
          </button>
        </form>
      </GlassCard>
    </main>
  );
}