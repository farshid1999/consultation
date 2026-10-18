"use client";

import { useState } from "react";
import { useUpdateUserStatus } from "@/hooks/useUsers";
import { toast } from "sonner";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

interface UserStatusToggleProps {
  userId: number;
  isActive: boolean;
}

export default function UserStatusToggle({ userId, isActive }: UserStatusToggleProps) {
  const [localActive, setLocalActive] = useState(isActive);
  const updateStatus = useUpdateUserStatus();

  const handleToggle = async () => {
    const newStatus = !localActive;
    setLocalActive(newStatus); // آپدیت موقت UI برای سرعت بیشتر

    try {
      await updateStatus.mutateAsync({
        id: userId,
        data: { is_active: newStatus },
      });
      toast.success(newStatus ? "کاربر فعال شد." : "کاربر غیرفعال شد.");
    } catch (err) {
      setLocalActive(!newStatus); // برگرداندن به حالت قبل در صورت خطا
      toast.error("خطا در تغییر وضعیت کاربر.");
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={updateStatus.isPending}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
        localActive
          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
          : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
      }`}
    >
      {localActive ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
      {localActive ? "فعال" : "غیرفعال"}
    </button>
  );
}