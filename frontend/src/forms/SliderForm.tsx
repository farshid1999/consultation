"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormSection from "@/forms/FormSection";
import GlassCard from "@/components/ui/GlassCard";
import { DateTimePicker, Input, Select, Switch } from "@/components/ui/inputs";
import { SLIDER_KEY_OPTIONS } from "@/lib/sliderLimits";
import { extractApiError } from "@/services/api/errors";
import type { Slider, SliderCreateInput } from "@/types";

const sliderSchema = z
  .object({
    key: z
      .string()
      .min(1, "یک بخش را انتخاب کنید.")
      .max(100, "کلید حداکثر ۱۰۰ کاراکتر باشد.")
      .regex(
        /^[-a-zA-Z0-9_]+$/,
        "فقط حروف انگلیسی، عدد، خط تیره و آندرلاین مجاز است.",
      ),
    title: z.string().max(150, "عنوان حداکثر ۱۵۰ کاراکتر باشد."),
    is_active: z.boolean(),
    start_at: z.date().nullable(),
    end_at: z.date().nullable(),
    interval_seconds: z
      .number({ invalid_type_error: "یک عدد وارد کنید." })
      .int("عدد صحیح وارد کنید.")
      .min(1, "فاصله‌ی تعویض باید حداقل ۱ ثانیه باشد.")
      .max(600, "فاصله‌ی تعویض حداکثر ۶۰۰ ثانیه باشد."),
  })
  .refine((v) => !v.start_at || !v.end_at || v.end_at > v.start_at, {
    message: "زمان پایان باید بعد از زمان شروع باشد.",
    path: ["end_at"],
  });

export type SliderFormValues = z.infer<typeof sliderSchema>;

/** تبدیل مقادیر فرم به بدنه‌ی درخواست بک */
export function toSliderPayload(values: SliderFormValues): SliderCreateInput {
  return {
    key: values.key,
    title: values.title,
    is_active: values.is_active,
    start_at: values.start_at ? values.start_at.toISOString() : null,
    end_at: values.end_at ? values.end_at.toISOString() : null,
    interval_seconds: values.interval_seconds,
  };
}

interface SliderFormProps {
  mode: "create" | "edit";
  /** فقط در حالت ویرایش */
  slider?: Slider;
  isPending: boolean;
  onSubmit: (values: SliderFormValues) => Promise<unknown>;
  children?: ReactNode;
}

export default function SliderForm({
  mode,
  slider,
  isPending,
  onSubmit,
  children,
}: SliderFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SliderFormValues>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {
      key: slider?.key ?? "",
      title: slider?.title ?? "",
      is_active: slider?.is_active ?? true,
      start_at: slider?.start_at ? new Date(slider.start_at) : null,
      end_at: slider?.end_at ? new Date(slider.end_at) : null,
      interval_seconds: slider?.interval_seconds ?? 5,
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (err) {
      // خطاهای فیلدی بک (مثلاً کلید تکراری) را روی همان فیلد نشان بده
      const { fieldErrors } = extractApiError(err);
      Object.entries(fieldErrors).forEach(([name, messages]) => {
        if (name in values) {
          setError(name as keyof SliderFormValues, { message: messages[0] });
        }
      });
    }
  });

  return (
    <form onSubmit={submit}>
      <GlassCard className="space-y-6 p-4 sm:p-8 !overflow-visible">
        <FormSection title="مشخصات اسلایدر">
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="بخش مربوط در سایت"
              required
              disabled={mode === "edit"}
              placeholder="یک بخش را انتخاب کنید"
              options={SLIDER_KEY_OPTIONS}
              helperText={
                mode === "edit"
                  ? "بخش بعد از ساخت قابل تغییر نیست."
                  : "اسلایدر در همین بخش از سایت نمایش داده می‌شود."
              }
              error={errors.key?.message}
              {...register("key")}
            />
            <Input
              label="عنوان (برای نمایش در پنل)"
              placeholder="اسلایدر چرا یوگبال"
              error={errors.title?.message}
              {...register("title")}
            />
            <Input
              label="فاصله‌ی تعویض عکس‌ها (ثانیه)"
              type="number"
              min={1}
              max={600}
              error={errors.interval_seconds?.message}
              {...register("interval_seconds", { valueAsNumber: true })}
            />
          </div>

          <div className="mt-6">
            <Switch
              label="اسلایدر فعال باشد"
              description="اگر غیرفعال باشد، در سایت نمایش داده نمی‌شود."
              {...register("is_active")}
            />
          </div>
        </FormSection>

        <FormSection
          title="بازه‌ی زمانی نمایش"
          description="اختیاری. اگر خالی بماند، اسلایدر بدون محدودیت زمانی نمایش داده می‌شود."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="start_at"
              control={control}
              render={({ field }) => (
                <div className="relative z-20">
                  <DateTimePicker
                    label="شروع نمایش"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.start_at?.message}
                  />
                  {field.value && (
                    <button
                      type="button"
                      onClick={() => field.onChange(null)}
                      className="mt-1.5 text-xs text-cream/50 transition-colors hover:text-red-300"
                    >
                      حذف محدودیت شروع
                    </button>
                  )}
                </div>
              )}
            />
            <Controller
              name="end_at"
              control={control}
              render={({ field }) => (
                <div className="relative z-10">
                  <DateTimePicker
                    label="پایان نمایش"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.end_at?.message}
                  />
                  {field.value && (
                    <button
                      type="button"
                      onClick={() => field.onChange(null)}
                      className="mt-1.5 text-xs text-cream/50 transition-colors hover:text-red-300"
                    >
                      حذف محدودیت پایان
                    </button>
                  )}
                </div>
              )}
            />
          </div>
        </FormSection>

        {children}

        <div className="flex items-center justify-end gap-3 border-t border-cream/10 pt-6">
          <Link
            href="/admin/settings/sliders"
            className="rounded-xl border border-cream/20 px-6 py-3 text-sm text-cream/70 transition-colors hover:border-gold/50 hover:text-gold"
          >
            انصراف
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-gradient-to-b from-gold-soft to-gold px-8 py-3 text-sm font-bold text-deep shadow-gold transition-opacity disabled:opacity-60"
          >
            {isPending
              ? "در حال ذخیره..."
              : mode === "create"
                ? "ساخت اسلایدر"
                : "ذخیره تغییرات"}
          </button>
        </div>
      </GlassCard>
    </form>
  );
}
