"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import SliderForm, { toSliderPayload } from "@/forms/SliderForm";
import { useAdminSlider, useUpdateSlider } from "@/hooks/useSliders";
import SliderImagesManager from "@/components/Admin/SliderImagesManager";

export default function EditSliderPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: slider, isLoading, isError } = useAdminSlider(id);
  const updateSlider = useUpdateSlider(id);

  return (
    <main dir="rtl" className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/admin/settings/sliders"
        className="mb-4 inline-flex items-center gap-2 text-xs text-cream/50 transition-colors hover:text-gold"
      >
        <FiArrowRight aria-hidden="true" />
        بازگشت به لیست اسلایدرها
      </Link>

      {isLoading ? (
        <p className="py-20 text-center text-cream/60">در حال بارگذاری...</p>
      ) : isError || !slider ? (
        <p className="py-20 text-center text-red-300">اسلایدر پیدا نشد.</p>
      ) : (
        <>
          <h1 className="mb-1 text-3xl font-extrabold text-cream">
            ویرایش اسلایدر
          </h1>
          <p dir="ltr" className="mb-8 text-right text-xs text-cream/40">
            {slider.key}
          </p>

          <div className="space-y-6">
            {/* relative z-20: پاپ‌آپ تقویم روی SliderImagesManager بیاید */}
            <div className="relative z-20">
              {/* key باعث می‌شود اگر اسلایدر دیگری باز شد، فرم از نو ساخته شود */}
              <SliderForm
                key={slider.id}
                mode="edit"
                slider={slider}
                isPending={updateSlider.isPending}
                onSubmit={async (values) => {
                  // کلید بعد از ساخت قابل تغییر نیست؛ در PATCH ارسالش نمی‌کنیم
                  const { key: _key, ...payload } = toSliderPayload(values);
                  await updateSlider.mutateAsync(payload);
                }}
              />
            </div>

            <div className="relative z-10">
              <SliderImagesManager slider={slider} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
