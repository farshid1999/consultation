"use client";

import { useParams } from "next/navigation";
import { useLineDetail } from "@/hooks/useLines"; // یا هوک مخصوص ممبر اگر دارید
import NeuralBackground from "@/components/background/NeuralBackground";
import MemberLineDetailView from "@/components/ui/MemberLineDetailView";

export default function MemberLineDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: line, isLoading, isError } = useLineDetail(id || null);

  return (
    <main className="relative min-h-screen bg-deep text-cream overflow-x-hidden">
      {/* پس‌زمینه متحرک لوکس */}
      <NeuralBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <span className="spinner-brand h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl bg-red-500/10 p-8 text-center border border-red-500/20 backdrop-blur-md">
            <p className="text-lg font-medium text-red-400">خطا در دریافت اطلاعات بخش.</p>
          </div>
        )}

        {line && <MemberLineDetailView line={line} />}
      </div>
    </main>
  );
}