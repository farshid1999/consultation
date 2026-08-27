"use client";

import ContentCreateForm from "@/forms/content/ContentCreateForm";

export default function CreateContentPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 border-b border-cream/10 pb-6">
        <h1 className="page-title text-3xl font-extrabold text-cream">ایجاد محتوای جدید</h1>
        <p className="mt-2 text-sm text-cream/45">ارسال متن، فایل و پیام صوتی برای اعضای لاین</p>
      </div>

      <ContentCreateForm />
    </main>
  );
}