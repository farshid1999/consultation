"use client";

import { useState } from "react";
import { useAdminAssignments } from "@/hooks/useAssignment";
import Link from "next/link";
import { FiPlus, FiSearch, FiEye, FiMessageSquare } from "react-icons/fi";

export default function AdminAssignmentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminAssignments(
    search ? { search, page } : { page },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-cream">تکالیف</h1>
          <p className="text-cream/40 text-sm mt-1">
            {data?.pagination?.count ?? 0} تکلیف ثبت شده
          </p>
        </div>
        <Link
          href="/admin/assignments/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-deep text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <FiPlus size={15} />
          تکلیف جدید
        </Link>
      </div>

      <div className="relative max-w-sm">
        <FiSearch
          className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30"
          size={15}
        />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="جستجو در عنوان تکالیف..."
          className="w-full rounded-xl border border-cream/10 bg-cream/5 py-2.5 pr-9 pl-4 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
        />
      </div>

      <div className="rounded-2xl border border-cream/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream/10 bg-cream/[0.03]">
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">
                عنوان
              </th>
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">
                لاین
              </th>
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">
                توضیحات
              </th>
              <th className="px-5 py-3.5 text-center text-cream/50 font-medium">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-cream/30 text-sm"
                >
                  در حال بارگذاری...
                </td>
              </tr>
            ) : data?.results?.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-cream/30 text-sm"
                >
                  تکلیفی یافت نشد
                </td>
              </tr>
            ) : (
              data?.results?.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="border-b border-cream/5 hover:bg-cream/[0.02] transition-colors"
                >
                  <td className="px-5 py-4 text-cream font-medium">
                    {assignment.title}
                  </td>
                  <td className="px-5 py-4 text-cream/60">{assignment.line}</td>
                  <td className="px-5 py-4 text-cream/50 max-w-xs truncate">
                    {assignment.description || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* دکمه مشاهده جزئیات تکلیف */}
                      <Link
                        href={`/admin/assignments/${assignment.id}`}
                        className="p-2 rounded-lg text-cream/40 hover:text-gold hover:bg-gold/10 transition-colors"
                        title="جزئیات تکلیف"
                      >
                        <FiEye size={16} />
                      </Link>

                      {/* ✅ دکمه جدید: مشاهده پاسخ‌های اعضا */}
                      <Link
                        href={`/admin/assignments/${assignment.id}/submissions`}
                        className="p-2 rounded-lg text-cream/40 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                        title="مشاهده پاسخ‌های ارسال شده"
                      >
                        <FiMessageSquare size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
