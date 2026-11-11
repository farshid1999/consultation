// app/(مسیر شما)/profile/page.tsx
"use client";

import { useStaffProfile } from "@/hooks/useStaff";
import StaffProfileForm from "@/forms/staff/StaffProfileForm"; // مسیر را مطابق پروژه تنظیم کنید

export default function StaffProfilePage() {
  const { data, isLoading, isError, error, refetch, dataUpdatedAt } = useStaffProfile();

  if (isLoading) {
    return <div className="p-6 text-cream/60">در حال بارگذاری پروفایل...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-6 space-y-3">
        <p className="text-red-400">
          {(error as Error | null)?.message || "خطا در دریافت اطلاعات پروفایل"}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-xl border border-gold/30 px-4 py-2 text-sm text-gold hover:bg-gold/5"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-xl font-bold text-cream">پروفایل من</h1>

      {/* key باعث می‌شود بعد از ذخیره و refetch، فرم با داده تازه از سرور دوباره ساخته شود */}
      <StaffProfileForm key={dataUpdatedAt} initialData={data} />
    </div>
  );
}