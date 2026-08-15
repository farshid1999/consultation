"use client";

import { useParams } from "next/navigation";
import { useStaffDetail } from "@/hooks/useStaff";
import StaffDetailView from "@/components/staff/StaffDetailView";

export default function StaffDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data, isLoading, isError } = useStaffDetail(Number.isNaN(id) ? null : id);

  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10">
      {isLoading && <p className="text-center text-sm text-cream/40">در حال بارگذاری...</p>}
      {isError && <p className="text-center text-sm text-red-400">دریافت اطلاعات کارمند با خطا مواجه شد.</p>}
      {data && <StaffDetailView staff={data} />}
    </main>
  );
}
