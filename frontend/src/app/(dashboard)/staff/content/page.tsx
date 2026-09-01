"use client";

import {useState} from "react";
import Link from "next/link";
import {FiSearch, FiEye, FiFileText, FiPlus, FiEdit2} from "react-icons/fi";
import {Input} from "@/components/ui/inputs";
import {useStaffContents} from "@/hooks/useContent";
import type {ContentListItem} from "@/types";

export default function StaffContentListPage() {
    const [search, setSearch] = useState("");

    // دریافت لیست محتوا
    const {data, isLoading} = useStaffContents({
        search: search || undefined,
        ordering: "-created_at"
    });

    const contents = data?.results || [];

    return (
        <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10">

            {/* هدر صفحه */}
            <div
                className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream/10 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
                        <span>داشبورد کارمند</span>
                        <span>/</span>
                        <span>محتواهای من</span>
                    </div>
                    <h1 className="page-title text-3xl font-extrabold">مدیریت محتواهای ارسالی</h1>
                </div>
            </div>

            {/* نوار جستجو */}
            <div className="mb-6 max-w-md">
                <Input
                    placeholder="جست‌وجوی عنوان یا متن محتوا..."
                    leftIcon={<FiSearch/>}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* جدول محتوا */}
            <div className="card overflow-hidden">
                <table className="w-full text-right text-sm">
                    <thead className="bg-deep-2/50 text-xs font-medium text-cream/40 border-b border-cream/10">
                    <tr>
                        <th className="px-5 py-4 w-1/3">عنوان محتوا</th>
                        <th className="px-5 py-4">بخش (لاین)</th>
                        <th className="px-5 py-4">تاریخ ایجاد</th>
                        <th className="px-5 py-4 text-center w-24">عملیات</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-cream/5">
                    {isLoading ? (
                        <tr>
                            <td colSpan={4} className="py-12 text-center text-cream/40">
                                <span
                                    className="spinner-brand h-6 w-6 animate-spin rounded-full border-2 inline-block"></span>
                            </td>
                        </tr>
                    ) : contents.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-12 text-center text-cream/40">محتوایی یافت نشد.</td>
                        </tr>
                    ) : (
                        contents.map((content) => (
                            <tr key={content.id} className="table-row-brand group transition-colors">

                                {/* عنوان */}
                                <td className="px-5 py-4">
                                    <div className="font-bold text-cream">{content.title}</div>
                                    <div className="text-xs text-cream/40 line-clamp-1 mt-1">
                                        {content.text || "بدون توضیحات"}
                                    </div>
                                </td>

                                {/* نام لاین */}
                                <td className="px-5 py-4">
                    <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                      {content.line.title}
                    </span>
                                </td>

                                {/* تاریخ */}
                                <td className="px-5 py-4 text-cream/70">
                                    {new Date(content.created_at).toLocaleDateString('fa-IR')}
                                </td>

                                {/* عملیات */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-center gap-2"> {/* مشاهده */} <Link
                                        href={`/staff/content/${content.id}`} aria-label="مشاهده جزئیات"
                                        className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-gold/10 hover:text-gold transition-colors">
                                        <FiEye size={18}/> </Link> {/* ویرایش */} <Link
                                        href={`/staff/content/${content.id}/edit`} aria-label="ویرایش محتوا"
                                        className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-blue-500/10 hover:text-blue-400 transition-colors">
                                        <FiEdit2 size={18}/> </Link></div>
                                </td>

                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

        </main>
    );
}