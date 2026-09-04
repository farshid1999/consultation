"use client";

import { useParams } from "next/navigation";
import Link from "next/link"; // ✅ اضافه شد
import { useLineDetail } from "@/hooks/useLines";
import LineDetailView from "@/components/lines/LineDetailView";
import { FiClipboard } from "react-icons/fi"; // ✅ آیکون مرتبط با تکالیف

export default function LineDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: line, isLoading, isError } = useLineDetail(id || null);

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      
      {/* ✅ هدر صفحه با دکمه‌ی دسترسی به تکالیف */}
      {line && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold text-cream">{line.title}</h1>
            <p className="text-cream/50 text-sm mt-1">جزئیات و مدیریت این بخش</p>
          </div>
          
          {/* 
             نکته: اگر این صفحه مختص Staff است، مسیر /staff/line/${id}/assignments است.
             اگر مختص Member است، مسیر /member/lines/${id}/assignments خواهد بود.
             (در اینجا فرض بر Staff/Admin گذاشته شده است)
          */}
          <Link
            href={`/staff/line/${id}/assignments`} 
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 hover:border-gold/40 transition-all text-sm font-medium shrink-0"
          >
            <FiClipboard size={16} />
            مدیریت تکالیف این بخش
          </Link>
        </div>
      )}

      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-500/10 p-6 text-center border border-red-500/20">
          <p className="text-sm font-medium text-red-400">دریافت جزئیات بخش با خطا مواجه شد.</p>
        </div>
      )}

      {line && <LineDetailView line={line} />}
    </main>
  );
}