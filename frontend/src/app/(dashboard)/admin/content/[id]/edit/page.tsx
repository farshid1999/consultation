"use client";

import ContentUpdateForm from "@/forms/content/ContentUpdateForm";

export default function ContentEditPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 border-b border-cream/10 pb-6">
        <h1 className="page-title text-3xl font-extrabold text-cream">ویرایش محتوا</h1>
        <p className="mt-2 text-sm text-cream/45">تغییر اطلاعات، متن یا فایل‌های ضمیمه</p>
      </div>

      <ContentUpdateForm />
    </main>
  );
}