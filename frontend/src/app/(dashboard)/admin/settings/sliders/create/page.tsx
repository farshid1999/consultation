"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import SliderForm, { toSliderPayload } from "@/forms/SliderForm";
import { useCreateSlider } from "@/hooks/useSliders";

export default function CreateSliderPage() {
  const router = useRouter();
  const createSlider = useCreateSlider();

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
        isPending={createSlider.isPending}
        onSubmit={async (values) => {
          const created = await createSlider.mutateAsync(toSliderPayload(values));
          // بعد از ساخت، به صفحه‌ی ویرایش می‌رویم تا تصاویر را اضافه کنند
          router.replace(`/admin/settings/sliders/${created.id}`);
        }}
      />
    </main>
  );
}