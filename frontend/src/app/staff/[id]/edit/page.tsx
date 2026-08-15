"use client";

import { useParams } from "next/navigation";
import { useStaffDetail } from "@/hooks/useStaff";
import StaffEditForm from "@/forms/staff/StaffEditForm";

export default function StaffEditPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data, isLoading, isError } = useStaffDetail(Number.isNaN(id) ? null : id);

  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold text-cream">ویرایش کارمند</h1>
        <p className="mt-1 text-sm text-cream/45">فقط فیلدهایی که تغییر می‌دهید ارسال خواهند شد</p>
      </div>

      {isLoading && <p className="text-center text-sm text-cream/40">در حال بارگذاری...</p>}
      {isError && <p className="text-center text-sm text-red-400">دریافت اطلاعات کارمند با خطا مواجه شد.</p>}
      {data && <StaffEditForm key={data.id} staff={data} />}
    </main>
  );
}
