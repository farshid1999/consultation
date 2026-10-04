"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiEye, FiArrowRight, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { Input } from "@/components/ui/inputs";
import { useLineStaff } from "@/hooks/useLines";
import { useAddLineStaff, useRemoveLineStaff } from "@/hooks/useLines";
import UserDetailModal from "@/components/ui/modals/UserDetailModal";
import AddStaffModal from "@/components/ui/modals/AddStaffModal";
import RemoveStaffModal from "@/components/ui/modals/RemoveStaffModal";
import type { StaffLine } from "@/types";

export default function LineStaffPage() {
  const params = useParams<{ id: string }>();
  const lineId = params.id;
  
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // State for Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const { data, isLoading } = useLineStaff(lineId, { search: search || undefined });
  const staffList = data?.results || [];

  // Hooks
  const addStaffMutation = useAddLineStaff(lineId);
  const removeStaffMutation = useRemoveLineStaff(lineId);

  const handleViewDetails = (staff: StaffLine) => {
    setSelectedUser(staff.user);
    setIsDetailModalOpen(true);
  };

  const handleAddStaff = (staffIds: (string | number)[]) => {
    addStaffMutation.mutate(staffIds, {
      onSuccess: () => setIsAddModalOpen(false),
    });
  };

  const handleRemoveStaff = (staffIds: (string | number)[]) => {
    removeStaffMutation.mutate(staffIds, {
      onSuccess: () => setIsRemoveModalOpen(false),
    });
  };

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10">
      
      {/* هدر صفحه */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
            <Link href="/line" className="hover:text-gold transition-colors">بخش‌ها</Link>
            <FiArrowRight size={12} className="rotate-180" />
            <span>کارمندان بخش</span>
          </div>
          <h1 className="page-title text-3xl font-extrabold">لیست کارمندان فعال</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* دکمه حذف کارمند */}
          <button
            onClick={() => setIsRemoveModalOpen(true)}
            className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-all"
          >
            <FiTrash2 size={16} />
            حذف کارمند
          </button>

          {/* دکمه افزودن کارمند */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-soft to-gold px-5 py-2.5 text-sm font-bold text-deep shadow-gold hover:shadow-[0_16px_50px_-8px_rgba(201,162,77,0.6)] transition-all"
          >
            <FiUserPlus size={16} />
            افزودن کارمند
          </button>
        </div>
      </div>

      {/* نوار جستجو */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="جست‌وجوی نام، کد پرسنلی یا سمت..."
          leftIcon={<FiSearch />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* جدول استاف‌ها */}
      <div className="card overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-deep-2/50 text-xs font-medium text-cream/40 border-b border-cream/10">
            <tr>
              <th className="px-5 py-4">نام کارمند</th>
              <th className="px-5 py-4">کد پرسنلی</th>
              <th className="px-5 py-4">سمت سازمانی</th>
              <th className="px-5 py-4 text-center w-24">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/5">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-cream/40">
                  <span className="spinner-brand h-6 w-6 animate-spin rounded-full border-2 inline-block"></span>
                </td>
              </tr>
            ) : staffList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-cream/40">کارمندی در این بخش یافت نشد.</td>
              </tr>
            ) : (
              staffList.map((staff) => (
                <tr key={staff.id} className="table-row-brand group transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-cream">
                      {staff.user.first_name} {staff.user.last_name}
                    </div>
                    <div className="text-xs text-cream/40">@{staff.user.username}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                      {staff.employee_code}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-cream/70">{staff.position}</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleViewDetails(staff)}
                      className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full mx-auto"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* مودال‌ها */}
      <UserDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        user={selectedUser} 
      />

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        lineId={lineId}
        currentStaff={staffList}
        onConfirm={handleAddStaff}
        isPending={addStaffMutation.isPending}
      />

      <RemoveStaffModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        staffList={staffList}
        onConfirm={handleRemoveStaff}
        isPending={removeStaffMutation.isPending}
      />

    </main>
  );
}