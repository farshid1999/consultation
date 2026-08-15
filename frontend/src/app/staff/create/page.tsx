"use client";

import StaffCreateForm from "@/components/staff/StaffCreateForm";

export default function StaffCreatePage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold text-cream">افزودن کارمند جدید</h1>
        <p className="mt-1 text-sm text-cream/45">اطلاعات زیر مستقیماً حساب کاربری و رکورد کارمند را می‌سازد</p>
      </div>
      <StaffCreateForm />
    </main>
  );
}
