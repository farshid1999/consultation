"use client";

import { useParams } from "next/navigation";
import { useStaffDetail } from "@/hooks/useStaff";
import StaffEditForm from "@/forms/staff/StaffEditForm";
import "@/styles/light.css"; // ایمپورت تم روشن

export default function StaffEditPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data, isLoading, isError } = useStaffDetail(Number.isNaN(id) ? null : id);

  return (
    <main dir="rtl" className="theme-light-admin mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">ویرایش اطلاعات کارمند</h1>
        <p className="mt-2 text-sm text-slate-500">فقط فیلدهایی که تغییر می‌دهید ارسال خواهند شد</p>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#c9a24d]"></span>
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-500 border border-red-100">
          دریافت اطلاعات کارمند با خطا مواجه شد.
        </div>
      )}

      {data && <StaffEditForm key={data.id} staff={data} />}
    </main>
  );
}