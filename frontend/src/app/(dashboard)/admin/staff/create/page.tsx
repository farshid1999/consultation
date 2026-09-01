"use client";

import StaffCreateForm from "@/forms/staff/StaffCreateForm";

import "@/styles/light.css";

export default function StaffCreatePage() {
  return (

    // اضافه کردن کلاس theme-light-admin برای اعمال تم روی کل صفحه
    <main dir="rtl" className="theme-light-admin mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">افزودن کارمند جدید</h1>
        <p className="mt-2 text-sm text-slate-500">
          اطلاعات زیر مستقیماً حساب کاربری و رکورد کارمند را می‌سازد
        </p>
      </div>

      <StaffCreateForm />
    </main>
  );
}