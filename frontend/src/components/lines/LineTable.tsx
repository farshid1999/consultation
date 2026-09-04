"use client";

import {useState} from "react";
import Link from "next/link";
import {FiEye, FiSearch, FiUsers, FiBriefcase, FiPlus, FiFileText} from "react-icons/fi";
import {Input} from "@/components/ui/inputs";
import {useLines} from "@/hooks/useLines";

export default function LineTable() {
    const [search, setSearch] = useState("");

    // دریافت لیست بخش‌ها
    const {data: lines, isLoading, isError} = useLines({search: search || undefined});

    return (
        <div className="flex flex-col gap-6">
            {/* هدر جستجو با استایل کارت تیره */}
            <div className="toolbar-card flex items-center justify-between p-4">
                <div className="w-full max-w-xs">
                    <Input
                        placeholder="جست‌وجوی عنوان بخش..."
                        leftIcon={<FiSearch/>}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* جدول با استایل تاریک */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                        <thead>
                        <tr className="border-b border-cream/10 bg-deep-2/50 text-xs font-medium text-cream/40">
                            <th className="px-5 py-4 w-1/3">عنوان بخش</th>
                            <th className="px-5 py-4">توضیحات</th>
                            <th className="px-5 py-4 w-24 text-center">والد</th>
                            <th className="px-5 py-4 w-32 text-center">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-cream/5">
                        {isLoading && (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-cream/40">
                                    <span
                                        className="spinner-brand h-6 w-6 animate-spin rounded-full border-2 inline-block"></span>
                                </td>
                            </tr>
                        )}

                        {isError && (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-red-400">
                                    دریافت اطلاعات با خطا مواجه شد.
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError && lines?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-cream/40">
                                    هیچ بخشی یافت نشد.
                                </td>
                            </tr>
                        )}

                        {lines?.map((line) => (
                            <tr key={line.id} className="table-row-brand group transition-colors">
                                {/* عنوان */}
                                <td className="px-5 py-3.5">
                                    <div className="font-bold text-cream">{line.title}</div>
                                </td>

                                {/* توضیحات */}
                                <td className="px-5 py-3.5 text-cream/70 line-clamp-2">
                                    {line.descriptions || <span className="text-cream/30">—</span>}
                                </td>

                                {/* وضعیت والد */}
                                <td className="px-5 py-3.5 text-center">
                                    {line.parent ? (
                                        <span className="badge-gold font-mono">#{line.parent}</span>
                                    ) : (
                                        <span className="badge-green">ریشه</span>
                                    )}
                                </td>

                                {/* دکمه‌های عملیات */}
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center justify-center gap-2">
                                        {/* 1. مشاهده جزئیات بخش */}
                                        <Link
                                            href={`/staff/line/${line.id}`}
                                            aria-label="مشاهده جزئیات بخش"
                                            className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-blue-500/10 hover:text-blue-400"
                                        >
                                            <FiEye size={18}/>
                                        </Link>

                                        {/* 2. مشاهده اعضای عادی بخش */}
                                        <Link
                                            href={`/staff/line/${line.id}/members`}
                                            aria-label="مشاهده اعضای بخش"
                                            className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#1e5c3f]/20 hover:text-[#4ade80]"
                                        >
                                            <FiUsers size={18}/>
                                        </Link>

                                        {/* 3. مشاهده کارمندان رسمی بخش */}
                                        <Link
                                            href={`/staff/line/${line.id}/staff`}
                                            aria-label="مشاهده کارمندان بخش"
                                            className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-purple-500/10 hover:text-purple-400"
                                        >
                                            <FiBriefcase size={18}/>
                                        </Link>

                                        {/* 4. ایجاد محتوا (جدید) */}
                                        <Link
                                            href={`/staff/line/${line.id}/content/create`}
                                            aria-label="ایجاد محتوا"
                                            className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-gold/10 hover:text-gold"
                                        >
                                            <FiPlus size={18}/> {/* نیاز به ایمپورت FiPlus از react-icons/fi */}
                                        </Link>

                                        {/* 5. لیست محتوای لاین (جدید) */}
                                        <Link
                                            href={`/staff/line/${line.id}/content`}
                                            aria-label="مشاهده آرشیو محتوا"
                                            className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                                        >
                                            <FiFileText size={18}/>
                                        </Link>

                                        <Link
                                            href={`/staff/line/${line.id}/consultation`} // <--- ارسال آیدی به عنوان کوئری پارامتر
                                            aria-label="مدیریت فرم‌های مشاوره"
                                            className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-purple-500/10 hover:text-purple-400 transition-colors"
                                            title="فرم‌ها و قراردادها"
                                        >
                                            <FiFileText size={18}/>
                                        </Link>

                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}