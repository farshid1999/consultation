"use client";

import { useParams } from "next/navigation";
import { useStaffDetail } from "@/hooks/useStaff";
import StaffDetailView from "@/components/staff/StaffDetailView";

export default function StaffDetailPage() {
  const params = useParams<{ id: string }>();
  
  // ✅ تبدیل محلی به Number برای سازگاری با هوک (بدون دست زدن به هوک)
  const id = params.id ? Number(params.id) : null;
  
  const { data, isLoading, isError } = useStaffDetail(id);

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
            <span className="text-sm text-cream/50">در حال دریافت اطلاعات...</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-500/10 p-6 text-center border border-red-500/20">
          <p className="text-sm font-medium text-red-400">دریافت اطلاعات کارمند با خطا مواجه شد.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-xs text-red-400 hover:text-red-300 underline transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {data && <StaffDetailView staff={data} />}
    </main>
  );
}