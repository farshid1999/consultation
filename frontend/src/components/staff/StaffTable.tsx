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
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
          <select
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-cream/15 bg-deep/60 px-3 py-3 text-sm text-cream focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/40"
          >
            {ORDERING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-deep-2">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/staff/create"
          className="flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-soft to-gold px-5 py-2.5 text-sm font-bold text-deep shadow-gold"
        >
          <FiPlus aria-hidden="true" />
          افزودن کارمند
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-cream/10">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-cream/10 bg-deep-2/50 text-xs text-cream/40">
              <th className="px-4 py-3 font-medium">کارمند</th>
              <th className="px-4 py-3 font-medium">کد پرسنلی</th>
              <th className="px-4 py-3 font-medium">سمت</th>
              <th className="px-4 py-3 font-medium">تاریخ استخدام</th>
              <th className="px-4 py-3 font-medium">نقش‌ها</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-cream/40">
                  در حال بارگذاری...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-red-400">
                  دریافت لیست کارمندان با خطا مواجه شد.
                </td>
              </tr>
            )}

            {!isLoading && !isError && data?.results.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-cream/40">
                  کارمندی یافت نشد.
                </td>
              </tr>
            )}

            {data?.results.map((staff) => (
              <tr key={staff.id} className="border-b border-cream/5 transition-colors hover:bg-cream/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    {staff.user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={staff.user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/[0.06] text-xs text-cream/40">
                        {staff.user.first_name?.[0] ?? staff.user.username[0]}
                      </span>
                    )}
                    <div>
                      <p className="font-medium text-cream">
                        {staff.user.first_name || staff.user.last_name
                          ? `${staff.user.first_name} ${staff.user.last_name}`.trim()
                          : staff.user.username}
                      </p>
                      <p className="text-xs text-cream/35">{staff.user.phone_number}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-cream/70">{toPersianDigits(staff.employee_code)}</td>
                <td className="px-4 py-3 text-cream/70">{staff.position}</td>
                <td className="px-4 py-3 text-cream/70">{formatShortJalali(staff.hire_date)}</td>
                <td className="px-4 py-3">
                  <RoleBadges roles={staff.roles} />
                </td>
                <td className="px-4 py-3">
                  {confirmingId === staff.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDelete(staff.id)}
                        disabled={deleteStaff.isPending}
                        className="rounded-lg bg-red-400/15 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/25"
                      >
                        {deleteStaff.isPending ? "..." : "تأیید حذف"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        aria-label="انصراف از حذف"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-cream/40 hover:bg-cream/[0.08]"
                      >
                        <FiX aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/staff/${staff.id}`}
                        aria-label="مشاهده"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-cream/50 transition-colors hover:bg-cream/[0.08] hover:text-cream"
                      >
                        <FiEye aria-hidden="true" />
                      </Link>
                      <Link
                        href={`/staff/${staff.id}/edit`}
                        aria-label="ویرایش"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-cream/50 transition-colors hover:bg-gold/10 hover:text-gold"
                      >
                        <FiEdit2 aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(staff.id)}
                        aria-label="حذف"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-cream/50 transition-colors hover:bg-red-400/10 hover:text-red-400"
                      >
                        <FiTrash2 aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.count > 0 && (
        <PaginationControls
          page={page}
          count={data.count}
          hasNext={Boolean(data.next)}
          hasPrevious={Boolean(data.previous)}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
