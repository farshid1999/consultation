"use client";

import LineTable from "@/components/lines/LineTable";

export default function LinesListPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10">

      {/* هدر صفحه با استایل تاریک */}
      <div className="mb-8 border-b border-cream/10 pb-6">
        <h1 className="page-title text-3xl font-extrabold text-cream">مدیریت بخش‌ها</h1>
        <p className="mt-2 text-sm text-cream/45">لیست بخش‌های عملیاتی و زیرمجموعه‌ها</p>
      </div>

      {/* جدول لیست لاین‌ها */}
      <LineTable />

    </main>
  );
}