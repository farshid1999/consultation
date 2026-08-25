import LineTable from "@/components/lines/LineTable";
import "@/styles/light.css";

export default function LinesListPage() {
    return (
        <div dir="rtl" className="theme-light-admin mx-auto max-w-6xl px-6 py-10">

            {/* هدر صفحه */}
            <div className="mb-8 border-b border-slate-200 pb-6">
                <h1 className="page-title text-3xl font-extrabold">مدیریت بخش ها</h1>
                <p className="mt-2 text-sm text-slate-500">لیست بخش های عملیاتی و زیرمجموعه‌ها</p>
            </div>

            {/* جدول لیست لاین‌ها */}
            <LineTable/>

        </div>
    );
}