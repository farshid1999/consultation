"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiEye, FiArrowRight } from "react-icons/fi";
import { Input } from "@/components/ui/inputs";
import { useLineContents } from "@/hooks/useContent";
import type { ContentListItem } from "@/types";

export default function LineContentsPage() {
  const params = useParams<{ id: string }>();
  const lineId = params.id;

  const [search, setSearch] = useState("");

  // استفاده از هوک مخصوص لاین
  const { data, isLoading } = useLineContents(lineId);

  // فیلتر کردن سمت کلاینت اگر بک‌اند سرچ را هندل نمی‌کند، یا اعتماد به سرچ بک‌اند
  // اینجا فرض می‌کنیم بک‌اند سرچ را روی همان خط انجام می‌دهد.
  // اگر نه، باید data.results را فیلتر کنیم.
  const contents = data?.results || [];

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10">

      {/* هدر صفحه */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
            <Link href="/lines" className="hover:text-gold transition-colors">بخش‌ها</Link>
            <FiArrowRight size={12} className="rotate-180" />
            <span>محتواهای این بخش</span>
          </div>
          <h1 className="page-title text-3xl font-extrabold">آرشیو محتوای بخش</h1>
        </div>
      </div>

      {/* نوار جستجو */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="جست‌وجوی عنوان یا متن محتوا..."
          leftIcon={<FiSearch />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* جدول محتوا */}
      <div className="card overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-deep-2/50 text-xs font-medium text-cream/40 border-b border-cream/10">
            <tr>
              <th className="px-5 py-4 w-1/3">عنوان محتوا</th>
              <th className="px-5 py-4">تاریخ ایجاد</th>
              <th className="px-5 py-4 text-center w-24">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/5">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-cream/40">
                  <span className="spinner-brand h-6 w-6 animate-spin rounded-full border-2 inline-block"></span>
                </td>
              </tr>
            ) : contents.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-cream/40">محتوایی در این بخش یافت نشد.</td>
              </tr>
            ) : (
              contents.map((content) => (
                <tr key={content.id} className="table-row-brand group transition-colors">

                  {/* عنوان */}
                  <td className="px-5 py-4">
                    <div className="font-bold text-cream">{content.title}</div>
                    <div className="text-xs text-cream/40 line-clamp-1 mt-1">
                      {content.text || "بدون توضیحات"}
                    </div>
                  </td>

                  {/* تاریخ */}
                  <td className="px-5 py-4 text-cream/70">
                    {new Date(content.created_at).toLocaleDateString('fa-IR')}
                  </td>

                  {/* عملیات */}
                  <td className="px-5 py-4 text-center">
                    <Link
                      href={`/dashboard/staff/contents/${content.id}`} // لینک به صفحه جزئیات عمومی
                      aria-label="مشاهده جزئیات"
                      className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full mx-auto hover:bg-gold/10 hover:text-gold transition-colors"
                    >
                      <FiEye size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </main>
  );
}