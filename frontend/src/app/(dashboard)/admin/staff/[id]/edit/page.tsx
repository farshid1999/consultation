"use client";

import { useParams } from "next/navigation";
import { useStaffDetail } from "@/hooks/useStaff";
import StaffEditForm from "@/forms/staff/StaffEditForm";

export default function StaffEditPage() {
  const params = useParams<{ id: string }>();
  
  // ✅ تبدیل محلی به Number برای سازگاری با هوک (بدون دست زدن به هوک)
  const id = params.id ? Number(params.id) : null;
  
  const { data, isLoading, isError } = useStaffDetail(id);

  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-cream">ویرایش اطلاعات کارمند</h1>
        <p className="mt-2 text-sm text-cream/50">فقط فیلدهایی که تغییر می‌دهید ارسال خواهند شد</p>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-500/10 p-4 text-center text-sm text-red-400 border border-red-500/20">
          دریافت اطلاعات کارمند با خطا مواجه شد.
        </div>
      )}

      {data && <StaffEditForm key={data.id} staff={data} />}
    </main>
  );
}