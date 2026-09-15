"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FiEdit2, FiEye, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { useDeleteStaff, useStaffList } from "@/hooks/useStaff";
import RoleBadges from "./RoleBadges";
import PaginationControls from "./PaginationControls";
import { toPersianDigits } from "@/lib/jalaali";
import { fromApiDateString } from "@/lib/date";
import type { ApiError } from "@/types";

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
  const jy = date.getFullYear();
  return toPersianDigits(`${date.getDate()}/${date.getMonth() + 1}/${jy}`);
}

export default function StaffTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-id");
  // تغییر به string برای هماهنگی با UUID
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useStaffList({ page, search: search || undefined, ordering });
  const deleteStaff = useDeleteStaff();

  const handleDelete = async (id: string) => {
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
    <div className="flex flex-col gap-6">
      {/* هدر: جستجو و دکمه افزودن */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* جستجو */}
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30" size={15} />
            <input
              placeholder="جست‌وجوی نام، کد پرسنلی، سمت..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-cream/10 bg-deep/50 py-2.5 pr-9 pl-4 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 transition-all"
            />
          </div>

          {/* سلکت مرتب‌سازی */}
          <select
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-cream/10 bg-deep/50 px-4 py-2.5 text-sm text-cream focus:border-gold/50 focus:outline-none transition-all cursor-pointer hover:bg-deep"
          >
            {ORDERING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-deep text-cream">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* دکمه افزودن */}
        <Link
          href="/staff/create"
          className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-deep hover:bg-gold/90 transition-all shadow-lg shadow-gold/10"
        >
          <FiPlus aria-hidden="true" size={16} />
          افزودن کارمند
        </Link>
      </div>

      {/* جدول */}
      <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.03] text-xs font-medium text-cream/50">
                <th className="px-5 py-4">کارمند</th>
                <th className="px-5 py-4">کد پرسنلی</th>
                <th className="px-5 py-4">سمت</th>
                <th className="px-5 py-4">تاریخ استخدام</th>
                <th className="px-5 py-4">نقش‌ها</th>
                <th className="px-5 py-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-cream/30">
                    <div className="flex flex-col items-center gap-3">
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
                      <span>در حال بارگذاری اطلاعات...</span>
                    </div>
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-red-400">
                    دریافت لیست کارمندان با خطا مواجه شد. لطفاً دوباره تلاش کنید.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && data?.results.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-cream/40">
                    هیچ کارمندی با مشخصات جستجو شده یافت نشد.
                  </td>
                </tr>
              )}

              {data?.results.map((staff) => (
                <tr key={staff.id} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {staff.user.avatar ? (
                        <img 
                          src={staff.user.avatar} 
                          alt="" 
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white/5" 
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold ring-2 ring-white/5">
                          {staff.user.first_name?.[0] ?? staff.user.username?.[0] ?? "U"}
                        </span>
                      )}
                      <div>
                        <p className="font-semibold text-cream">
                          {staff.user.first_name || staff.user.last_name
                            ? `${staff.user.first_name} ${staff.user.last_name}`.trim()
                            : staff.user.username}
                        </p>
                        <p className="text-xs text-cream/40 dir-ltr text-left mt-0.5 font-mono">
                          {staff.user.phone_number || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-cream/60">
                    {toPersianDigits(staff.employee_code)}
                  </td>
                  <td className="px-5 py-4 text-cream/60">{staff.position || "—"}</td>
                  <td className="px-5 py-4 text-cream/60">{formatShortJalali(staff.hire_date)}</td>
                  <td className="px-5 py-4">
                    <RoleBadges roles={staff.roles} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {confirmingId === staff.id ? (
                        <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2 py-1 border border-red-500/20">
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
                            className="flex h-6 w-6 items-center justify-center rounded-full text-cream/40 hover:bg-white/10 hover:text-cream transition-colors"
                          >
                            <FiX size={14} aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Link
                            href={`/staff/${staff.id}`}
                            aria-label="مشاهده"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/40 transition-all hover:bg-blue-400/10 hover:text-blue-400"
                          >
                            <FiEye size={16} aria-hidden="true" />
                          </Link>
                          <Link
                            href={`/staff/${staff.id}/edit`}
                            aria-label="ویرایش"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/40 transition-all hover:bg-gold/10 hover:text-gold"
                          >
                            <FiEdit2 size={16} aria-hidden="true" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(staff.id)}
                            aria-label="حذف"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/40 transition-all hover:bg-red-400/10 hover:text-red-400"
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