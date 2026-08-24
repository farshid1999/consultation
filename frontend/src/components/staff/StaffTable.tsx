"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FiEdit2, FiEye, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { useDeleteStaff, useStaffList } from "@/hooks/useStaff";
import { Input } from "@/components/ui/inputs";
import RoleBadges from "./RoleBadges";
import PaginationControls from "./PaginationControls";
import { toPersianDigits } from "@/lib/jalaali";
import { fromApiDateString } from "@/lib/date";
import type { ApiError } from "@/types";

// ایمپورت فایل تم (مطمئن شوید مسیر درست است)
import "@/styles/light.css";

const ORDERING_OPTIONS = [
  { value: "-id", label: "جدیدترین" },
  { value: "id", label: "قدیمی‌ترین" },
  { value: "employee_code", label: "کد پرسنلی" },
  { value: "hire_date", label: "تاریخ استخدام" },
  { value: "position", label: "سمت" },
];

function formatShortJalali(iso: string): string {
  const date = fromApiDateString(iso);
  if (!date) return "—";
  // توجه: متدهای تاریخ میلادی هستند، برای نمایش شمسی دقیق از کتابخانه jalaali استفاده کنید
  // اما اینجا فرض بر همان منطق قبلی است
  const jy = date.getFullYear();
  return toPersianDigits(`${date.getDate()}/${date.getMonth() + 1}/${jy}`);
}

export default function StaffTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-id");
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const { data, isLoading, isError } = useStaffList({ page, search: search || undefined, ordering });
  const deleteStaff = useDeleteStaff();

  const handleDelete = async (id: number) => {
    try {
      await deleteStaff.mutateAsync(id);
      toast.success("کارمند با موفقیت حذف شد.");
      setConfirmingId(null);
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message ?? "حذف کارمند با خطا مواجه شد.");
    }
  };

  return (
    // اضافه کردن کلاس تم روشن به ریشه کامپوننت
    <div className="theme-light-admin flex flex-col gap-6">

      {/* هدر: جستجو و دکمه افزودن */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full max-w-xs">
            <Input
              placeholder="جست‌وجوی نام، کد پرسنلی، سمت..."
              leftIcon={<FiSearch />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* سلکت مرتب‌سازی با استایل روشن */}
          <select
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#c9a24d] focus:outline-none focus:ring-2 focus:ring-[#c9a24d]/20 transition-all cursor-pointer hover:border-slate-300"
          >
            {ORDERING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/staff/create"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#c9a24d] to-[#d4af37] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#c9a24d]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <FiPlus aria-hidden="true" />
          افزودن کارمند
        </Link>
      </div>

      {/* جدول */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-medium text-slate-500">
                <th className="px-5 py-4">کارمند</th>
                <th className="px-5 py-4">کد پرسنلی</th>
                <th className="px-5 py-4">سمت</th>
                <th className="px-5 py-4">تاریخ استخدام</th>
                <th className="px-5 py-4">نقش‌ها</th>
                <th className="px-5 py-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#c9a24d]"></span>
                      <span>در حال بارگذاری اطلاعات...</span>
                    </div>
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-red-500">
                    دریافت لیست کارمندان با خطا مواجه شد. لطفاً دوباره تلاش کنید.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && data?.results.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    هیچ کارمندی با مشخصات جستجو شده یافت نشد.
                  </td>
                </tr>
              )}

              {data?.results.map((staff) => (
                <tr key={staff.id} className="group transition-colors hover:bg-slate-50/80">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {staff.user.avatar ? (
                        // eslint-disable-next-lines @next/next/no-img-element
                        <img src={staff.user.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 ring-2 ring-white">
                          {staff.user.first_name?.[0] ?? staff.user.username[0]}
                        </span>
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">
                          {staff.user.first_name || staff.user.last_name
                            ? `${staff.user.first_name} ${staff.user.last_name}`.trim()
                            : staff.user.username}
                        </p>
                        <p className="text-xs text-slate-400 dir-ltr text-left mt-0.5">{staff.user.phone_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-600">{toPersianDigits(staff.employee_code)}</td>
                  <td className="px-5 py-3.5 text-slate-600">{staff.position}</td>
                  <td className="px-5 py-3.5 text-slate-600">{formatShortJalali(staff.hire_date)}</td>
                  <td className="px-5 py-3.5">
                    <RoleBadges roles={staff.roles} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      {confirmingId === staff.id ? (
                        <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-2 py-1 border border-red-100">
                          <button
                            type="button"
                            onClick={() => handleDelete(staff.id)}
                            disabled={deleteStaff.isPending}
                            className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {deleteStaff.isPending ? "..." : "حذف"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(null)}
                            aria-label="انصراف"
                            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                          >
                            <FiX size={14} aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Link
                            href={`/staff/${staff.id}`}
                            aria-label="مشاهده"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FiEye size={16} aria-hidden="true" />
                          </Link>
                          <Link
                            href={`/staff/${staff.id}/edit`}
                            aria-label="ویرایش"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-[#c9a24d]/10 hover:text-[#c9a24d]"
                          >
                            <FiEdit2 size={16} aria-hidden="true" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(staff.id)}
                            aria-label="حذف"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                          >
                            <FiTrash2 size={16} aria-hidden="true" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data && data.count > 0 && (
        <div className="mt-2">
           <PaginationControls
            page={page}
            count={data.count}
            hasNext={Boolean(data.next)}
            hasPrevious={Boolean(data.previous)}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}