"use client";

import { useParams } from "next/navigation";
import { useStaffDetail } from "@/hooks/useStaff";
import StaffDetailView from "@/components/staff/StaffDetailView";
import "@/styles/light.css"; // ایمپورت تم روشن

export default function StaffDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data, isLoading, isError } = useStaffDetail(Number.isNaN(id) ? null : id);

  return (
    // اضافه کردن کلاس تم و استایل‌های پایه برای صفحه سفید
    <main dir="rtl" className="theme-light-admin mx-auto max-w-5xl px-6 py-10">

      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#c9a24d]"></span>
            <span className="text-sm text-slate-400">در حال دریافت اطلاعات...</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100">
          <p className="text-sm font-medium text-red-600">دریافت اطلاعات کارمند با خطا مواجه شد.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-xs text-red-500 hover:text-red-700 underline"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {data && <StaffDetailView staff={data} />}
    </main>
  );
}