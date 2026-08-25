"use client";

import StaffTable from "@/components/staff/StaffTable";
// ایمپورت استایل تم روشن
import "@/styles/light.css";
import "../../components/layout/Frame"
import Frame from "@/components/layout/Frame";

export default function StaffListPage() {
    return (
            <main dir="rtl" className="theme-light-admin mx-auto max-w-6xl px-6 py-10">
                <div className="mb-8 border-b border-slate-200 pb-6">
                    <h1 className="text-2xl font-extrabold text-slate-800">مدیریت کارمندان</h1>
                    <p className="mt-2 text-sm text-slate-500">افزودن، ویرایش و مدیریت کارمندان سامانه</p>
                </div>

                {/* حالا جدول داخل این کانتینر سفید قرار می‌گیرد */}
                <StaffTable/>
            </main>
    );
}