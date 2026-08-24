"use client";

import { useParams } from "next/navigation";
import { useLineDetail } from "@/hooks/useLines";
import LineDetailView from "@/components/lines/LineDetailView";
import "@/styles/light.css";

export default function LineDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id; // حذف Number()

  const { data: line, isLoading, isError } = useLineDetail(id || null);

  return (
    <main dir="rtl" className="theme-light-admin mx-auto max-w-5xl px-6 py-10">
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#c9a24d]"></span>
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100">
          <p className="text-sm font-medium text-red-600">دریافت جزئیات بخش با خطا مواجه شد.</p>
        </div>
      )}

      {line && <LineDetailView line={line} />}
    </main>
  );
}