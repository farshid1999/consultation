"use client";

import StaffTable from "@/components/staff/StaffTable";

export default function StaffListPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold text-cream">مدیریت کارمندان</h1>
        <p className="mt-1 text-sm text-cream/45">افزودن، ویرایش و مدیریت کارمندان سامانه</p>
      </div>
      <StaffTable />
    </main>
  );
}
