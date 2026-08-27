"use client";

import { useState } from "react";
import { FiSearch, FiX, FiCheck, FiTrash2 } from "react-icons/fi";
import type { StaffLine } from "@/types";
import { cn } from "@/lib/utils";

interface RemoveStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffLine[];
  onConfirm: (selectedStaffIds: (string | number)[]) => void;
  isPending: boolean;
}

export default function RemoveStaffModal({
  isOpen,
  onClose,
  staffList,
  onConfirm,
  isPending,
}: RemoveStaffModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // فیلتر کردن لیست بر اساس جستجو
  const filteredStaff = staffList.filter((s) => {
    const fullName = `${s.user.first_name} ${s.user.last_name}`.toLowerCase();
    const code = s.employee_code.toLowerCase();
    const term = search.toLowerCase();
    return fullName.includes(term) || code.includes(term);
  });

  const toggleStaff = (staffId: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
    );
  };

  const handleConfirm = () => {
    if (selectedIds.length > 0) {
      onConfirm(selectedIds);
      setSelectedIds([]);
      setSearch("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-deep-2 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

        {/* هدر مودال */}
        <div className="flex items-center justify-between border-b border-cream/10 p-5 bg-deep">
          <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
            <FiTrash2 size={18} />
            حذف کارمند از لاین
          </h3>
          <button onClick={onClose} className="text-cream/40 hover:text-cream transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* جستجو */}
        <div className="p-4 border-b border-cream/10">
          <div className="relative">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30" />
            <input
              type="text"
              placeholder="جست‌وجوی نام یا کد پرسنلی..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-cream/15 bg-deep/60 py-2.5 pr-10 pl-3 text-sm text-cream placeholder:text-cream/30 focus:border-red-400/60 focus:outline-none focus:ring-1 focus:ring-red-400/40"
            />
          </div>
        </div>

        {/* لیست کارمندان فعلی */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {filteredStaff.length === 0 ? (
            <div className="py-8 text-center text-sm text-cream/40">
              کارمندی یافت نشد.
            </div>
          ) : (
            filteredStaff.map((staff) => {
              const isSelected = selectedIds.includes(staff.id); // استفاده از ID مدل StaffLine
              return (
                <div
                  key={staff.id}
                  onClick={() => toggleStaff(staff.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all border",
                    isSelected
                      ? "bg-red-500/10 border-red-500/40"
                      : "border-transparent hover:bg-cream/[0.04]"
                  )}
                >
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-150",
                    isSelected ? "bg-red-500 border-red-500" : "border-cream/25"
                  )}>
                    {isSelected && <FiCheck className="text-xs text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cream">
                      {staff.user.first_name} {staff.user.last_name}
                    </p>
                    <p className="text-xs text-cream/40">کد: {staff.employee_code} | سمت: {staff.position}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* فوتر و دکمه تایید */}
        <div className="border-t border-cream/10 p-4 bg-deep flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm text-cream/60 hover:text-cream transition-colors"
          >
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending || selectedIds.length === 0}
            className="rounded-xl bg-gradient-to-b from-red-500 to-red-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "در حال حذف..." : `حذف انتخاب‌شده‌ها (${selectedIds.length})`}
          </button>
        </div>

      </div>
    </div>
  );
}