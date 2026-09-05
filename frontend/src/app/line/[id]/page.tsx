"use client";

import { useParams } from "next/navigation";
import { useLineDetail } from "@/hooks/useLines";
import PublicLineIntroView from "@/components/ui/PublicLineIntroView";
import Navbar from "@/components/layout/Navbar";

export default function PublicLinePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: line, isLoading, isError } = useLineDetail(id || null);

  return (
    <main dir="rtl">
      <Navbar/>
      {isLoading && (
        <div className="flex min-h-screen items-center justify-center bg-deep">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        </div>
      )}

      {isError && (
        <div className="flex min-h-screen items-center justify-center bg-deep px-6">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="text-sm font-medium text-red-400">دریافت اطلاعات این بخش با خطا مواجه شد.</p>
          </div>
        </div>
      )}

      {line && <PublicLineIntroView line={line} />}
    </main>
  );
}