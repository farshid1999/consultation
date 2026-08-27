"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX, FiCheck } from "react-icons/fi";
import { useUsers } from "@/hooks/useUsers";
import type { UserListItem } from "@/types";
import type { LineMember } from "@/types";
import { cn } from "@/lib/utils";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineId: string | number;
  currentMembers: LineMember[];
  onConfirm: (selectedUserIds: (string | number)[]) => void;
  isPending: boolean;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  currentMembers,
  onConfirm,
  isPending,
}: AddMemberModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // دریافت لیست کل کاربران
  const { data: usersData } = useUsers({ search: search || undefined });
  const allUsers = usersData?.results || [];

  // فیلتر کردن کاربرانی که همین الان عضو این لاین هستند
  const currentMemberUserIds = new Set(currentMembers.map((m) => m.user.id));

  const availableUsers = allUsers.filter(
    (user) => !currentMemberUserIds.has(user.id)
  );

  const toggleUser = (userId: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
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
      <div className="w-full max-w-lg rounded-3xl border border-cream/10 bg-deep-2 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

        {/* هدر مودال */}
        <div className="flex items-center justify-between border-b border-cream/10 p-5 bg-deep">
          <h3 className="text-lg font-bold text-cream">افزودن عضو جدید</h3>
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
              placeholder="جست‌وجوی نام یا شماره تماس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-cream/15 bg-deep/60 py-2.5 pr-10 pl-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
          </div>
        </div>

        {/* لیست کاربران */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {availableUsers.length === 0 ? (
            <div className="py-8 text-center text-sm text-cream/40">
              کاربری برای افزودن یافت نشد.
            </div>
          ) : (
            availableUsers.map((user) => {
              const isSelected = selectedIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all border",
                    isSelected
                      ? "bg-gold/10 border-gold/40"
                      : "border-transparent hover:bg-cream/[0.04]"
                  )}
                >
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-150",
                    isSelected ? "bg-gold border-gold" : "border-cream/25"
                  )}>
                    {isSelected && <FiCheck className="text-xs text-deep" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cream">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-cream/40">{user.phone_number}</p>
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
            className="rounded-xl bg-gradient-to-b from-gold-soft to-gold px-6 py-2 text-sm font-bold text-deep shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "در حال افزودن..." : `افزودن (${selectedIds.length})`}
          </button>
        </div>

      </div>
    </div>
  );
}