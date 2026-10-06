"use client";

import Link from "next/link";
import { FiArrowRight, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import GlassCard from "@/components/ui/GlassCard";
import { useAdminSliders, useDeleteSlider } from "@/hooks/useSliders";
import { formatJalaliDateTime } from "@/lib/jalaali";
import { cn } from "@/lib/utils";
import type { Slider } from "@/types";

function getStatus(slider: Slider): { label: string; className: string } {
  const now = Date.now();
  if (!slider.is_active) {
    return { label: "غیرفعال", className: "bg-cream/10 text-cream/60" };
  }
  if (slider.start_at && new Date(slider.start_at).getTime() > now) {
    return { label: "زمان‌بندی‌شده", className: "bg-blue-400/10 text-blue-300" };
  }
  if (slider.end_at && new Date(slider.end_at).getTime() < now) {
    return { label: "منقضی‌شده", className: "bg-red-400/10 text-red-300" };
  }
  return { label: "فعال", className: "bg-emerald-400/10 text-emerald-300" };
}

export default function AdminSlidersPage() {
  const { data: sliders, isLoading, isError } = useAdminSliders();
  const deleteSlider = useDeleteSlider();

  const handleDelete = (slider: Slider) => {
    const name = slider.title || slider.key;
    if (window.confirm(`اسلایدر «${name}» و همه‌ی تصاویرش حذف شود؟`)) {
      deleteSlider.mutate(slider.id);
    }
  };

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/admin/settings"
        className="mb-4 inline-flex items-center gap-2 text-xs text-cream/50 transition-colors hover:text-gold"
      >
        <FiArrowRight aria-hidden="true" />
        بازگشت به تنظیمات
      </Link>

      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-cream">اسلایدرها</h1>
        <Link
          href="/admin/settings/sliders/create"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-gold-soft to-gold px-5 py-2.5 text-sm font-bold text-deep shadow-gold"
        >
          <FiPlus aria-hidden="true" />
          اسلایدر جدید
        </Link>
      </div>

      <GlassCard className="overflow-hidden">
        {isLoading ? (
          <p className="p-10 text-center text-cream/60">در حال بارگذاری...</p>
        ) : isError ? (
          <p className="p-10 text-center text-red-300">خطا در دریافت لیست اسلایدرها.</p>
        ) : !sliders || sliders.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-cream/60">هنوز اسلایدری ساخته نشده است.</p>
            <p className="mt-2 text-xs text-cream/40">
              برای بخش «چرا یوگبال» اسلایدری با کلید{" "}
              <span dir="ltr" className="text-gold">why-sports-psychology</span> بسازید.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-right text-sm">
              <thead>
                <tr className="border-b border-cream/10 text-xs text-cream/50">
                  <th className="px-5 py-4 font-medium">عنوان / کلید</th>
                  <th className="px-5 py-4 font-medium">وضعیت</th>
                  <th className="px-5 py-4 font-medium">بازه‌ی نمایش</th>
                  <th className="px-5 py-4 font-medium">تعویض</th>
                  <th className="px-5 py-4 font-medium">تصاویر</th>
                  <th className="px-5 py-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {sliders.map((slider) => {
                  const status = getStatus(slider);
                  return (
                    <tr
                      key={slider.id}
                      className="border-b border-cream/5 last:border-0 hover:bg-cream/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-cream">{slider.title || "—"}</p>
                        <p dir="ltr" className="mt-0.5 text-right text-xs text-cream/40">
                          {slider.key}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-block rounded-full px-3 py-1 text-xs font-medium",
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-cream/60">
                        {slider.start_at || slider.end_at ? (
                          <div className="space-y-0.5">
                            {slider.start_at && (
                              <p>از {formatJalaliDateTime(new Date(slider.start_at))}</p>
                            )}
                            {slider.end_at && (
                              <p>تا {formatJalaliDateTime(new Date(slider.end_at))}</p>
                            )}
                          </div>
                        ) : (
                          "بدون محدودیت"
                        )}
                      </td>
                      <td className="px-5 py-4 text-cream/70">{slider.interval_seconds} ثانیه</td>
                      <td className="px-5 py-4 text-cream/70">{slider.images.length}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/settings/sliders/${slider.id}`}
                            aria-label="ویرایش"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/60 transition-colors hover:bg-gold/10 hover:text-gold"
                          >
                            <FiEdit2 size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(slider)}
                            disabled={deleteSlider.isPending}
                            aria-label="حذف"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/60 transition-colors hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </main>
  );
}