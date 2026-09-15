"use client";

import StaffCreateForm from "@/forms/staff/StaffCreateForm";

export default function StaffCreatePage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-cream">افزودن کارمند جدید</h1>
        <p className="mt-2 text-sm text-cream/50">
          اطلاعات زیر مستقیماً حساب کاربری و رکورد کارمند را می‌سازد
        </p>
      </div>

      <StaffCreateForm />
    </main>
  );
}