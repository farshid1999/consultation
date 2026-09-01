"use client";

import { useParams } from "next/navigation";
import { useLineDetail } from "@/hooks/useLines";
import LineDetailView from "@/components/lines/LineDetailView";

export default function LineDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: line, isLoading, isError } = useLineDetail(id || null);

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-6 py-10">
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block"></span>
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