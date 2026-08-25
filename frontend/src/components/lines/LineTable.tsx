"use client";

import {useState} from "react";
import Link from "next/link";
import {FiEye, FiSearch,FiUsers} from "react-icons/fi";
import {Input} from "@/components/ui/inputs";
import {useLines} from "@/hooks/useLines";
import {LINE_ENDPOINTS} from "@/services/api/endpoints";

export default function LineTable() {
    const [search, setSearch] = useState("");

    // دریافت لیست لاین‌ها
    const {data: lines, isLoading, isError} = useLines({search: search || undefined});

    return (
        <div className="flex flex-col gap-6">

            {/* هدر جستجو */}
            <div className="toolbar-card flex items-center justify-between p-4">
                <div className="w-full max-w-xs">
                    <Input
                        placeholder="جست‌وجوی عنوان لاین..."
                        leftIcon={<FiSearch/>}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* دکمه افزودن حذف شد چون فرمودید نیاز نیست */}
            </div>

            {/* جدول */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                        <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-medium text-slate-500">
                            <th className="px-5 py-4 w-1/3">عنوان لاین</th>
                            <th className="px-5 py-4">توضیحات</th>
                            <th className="px-5 py-4 w-24 text-center">والد</th>
                            <th className="px-5 py-4 w-20 text-center">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {isLoading && (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                                    <span
                                        className="spinner-brand h-6 w-6 animate-spin rounded-full border-2 inline-block"></span>
                                </td>
                            </tr>
                        )}

                        {isError && (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-red-500">
                                    دریافت اطلاعات با خطا مواجه شد.
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError && lines?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                                    هیچ لاینی یافت نشد.
                                </td>
                            </tr>
                        )}

                        {lines?.map((line) => (
                            <tr key={line.id} className="table-row-brand group transition-colors">

                                {/* عنوان */}
                                <td className="px-5 py-3.5">
                                    <div className="font-bold text-slate-800">{line.title}</div>
                                </td>

                                {/* توضیحات */}
                                <td className="px-5 py-3.5 text-slate-600 line-clamp-2">
                                    {line.descriptions || <span className="text-slate-300">—</span>}
                                </td>

                                {/* وضعیت والد */}
                                <td className="px-5 py-3.5 text-center">
                                    {line.parent ? (
                                        <span className="badge-gold font-mono">#{line.parent}</span>
                                    ) : (
                                        <span className="badge-green">ریشه</span>
                                    )}
                                </td>

                                {/* دکمه مشاهده */}
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center justify-center">
                                        {/* دکمه مشاهده جزئیات لاین */}
                                        <Link
                                            href={`/lines/${line.id}`}
                                            aria-label="مشاهده جزئیات لاین"
                                            className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <FiEye size={18}/>
                                        </Link>

                                        {/* دکمه جدید: مشاهده اعضای لاین */}
                                        <Link
                                            href={`/lines/${line.id}/members`}
                                            aria-label="مشاهده اعضای لاین"
                                            className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#e8f5ee] hover:text-[#1e5c3f]"
                                        >
                                            <FiUsers size={18}/>
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