"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiArrowRight } from "react-icons/fi";
import FormSection from "@/forms/FormSection";
import SliderForm, { toSliderPayload } from "@/forms/SliderForm";
import { FileUploader } from "@/components/ui/inputs";
import { SLIDER_KEYS, useCreateSlider } from "@/hooks/useSliders";
import { sliderService } from "@/services/sliderService";

export default function CreateSliderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createSlider = useCreateSlider();

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  return (
    <main dir="rtl" className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/admin/settings/sliders"
        className="mb-4 inline-flex items-center gap-2 text-xs text-cream/50 transition-colors hover:text-gold"
      >
        <FiArrowRight aria-hidden="true" />
        بازگشت به لیست اسلایدرها
      </Link>

      <h1 className="mb-8 text-3xl font-extrabold text-cream">اسلایدر جدید</h1>

      <SliderForm
        mode="create"
        isPending={createSlider.isPending || uploading}
        onSubmit={async (values) => {
          // ۱) ساخت اسلایدر (اگر خطا بدهد، فرم خطای فیلد را نشان می‌دهد و فایل‌ها می‌مانند)
          const created = await createSlider.mutateAsync(
            toSliderPayload(values),
          );

          // ۲) آپلود تصاویر انتخاب‌شده، یکی‌یکی و به ترتیب انتخاب
          let failed = 0;
          if (files.length > 0) {
            setUploading(true);
            for (const [i, file] of files.entries()) {
              try {
                await sliderService.createImage(created.id, {
                  image: file,
                  order: i,
                });
              } catch {
                failed += 1;
              }
            }
            setUploading(false);
            queryClient.invalidateQueries({ queryKey: SLIDER_KEYS.all });
          }

          if (failed > 0) {
            toast.error(
              `${failed} تصویر آپلود نشد. از صفحه‌ی ویرایش دوباره اضافه‌شان کنید.`,
            );
          }

          // ۳) رفتن به صفحه‌ی ویرایش برای کپشن‌ها و ترتیب
          router.replace(`/admin/settings/sliders/${created.id}`);
        }}
      >
        <FormSection
          title="تصاویر اسلایدر"
          description="اختیاری. تصاویر با ترتیب انتخاب‌شده اضافه می‌شوند. کپشن و ترتیب را بعد از ساخت می‌توانید تنظیم کنید."
        >
          <FileUploader
            label="انتخاب تصاویر"
            accept="image/*"
            multiple
            maxSizeMB={5}
            value={files}
            onChange={setFiles}
            disabled={createSlider.isPending || uploading}
          />
        </FormSection>
      </SliderForm>
    </main>
  );
}
