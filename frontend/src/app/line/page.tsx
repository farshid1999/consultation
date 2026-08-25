"use client";

import LineTable from "@/components/lines/LineTable";
import "@/styles/light.css";
import Frame from "@/components/layout/Frame";

export default function LinesListPage() {
    return (
        <Frame>
            <main dir="rtl" className="theme-light-admin mx-auto max-w-6xl px-6 py-10">

                {/* هدر صفحه */}
                <div className="mb-8 border-b border-slate-200 pb-6">
                    <h1 className="text-3xl font-extrabold text-[#0b2622]">مدیریت بخش ها</h1>
                    <p className="mt-2 text-sm text-slate-500">لیست بخش های عملیاتی و زیرمجموعه‌ها</p>
                </div>

                {/* جدول لیست لاین‌ها */}
                <LineTable/>

            </main>
        </Frame>
    );
}