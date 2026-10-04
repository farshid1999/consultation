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
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <p className="text-sm font-medium text-red-400">دریافت جزئیات بخش با خطا مواجه شد.</p>
        </div>
      )}

      {line && <LineDetailView line={line} />}
    </main>
  );
}