"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FiEye, FiSearch, FiUserPlus, FiTrash2 } from "react-icons/fi"; // اضافه کردن آیکون سطل آشغال
import { Input } from "@/components/ui/inputs";
import { useLineMembers } from "@/hooks/useLines";
import { useAddLineMembers, useRemoveLineMembers } from "@/hooks/useLines"; // ایمپورت هوک جدید
import UserDetailModal from "@/components/ui/modals/UserDetailModal";
import AddMemberModal from "@/components/ui/modals/AddMemberModal";
import RemoveMemberModal from "@/components/ui/modals/RemoveMemberModal"; // ایمپورت مودال حذف
import type { LineMember } from "@/types";

export default function LineMembersPage() {
  const params = useParams<{ id: string }>();
  const lineId = params.id;

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // State for Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const { data, isLoading } = useLineMembers(lineId, { search: search || undefined });
  const members = data?.results || [];

  // Hooks
  const addMembersMutation = useAddLineMembers(lineId);
  const removeMembersMutation = useRemoveLineMembers(lineId);

  const handleViewDetails = (member: LineMember) => {
    setSelectedUser(member.user);
    setIsDetailModalOpen(true);
  };

  const handleAddMembers = (userIds: (string | number)[]) => {
    addMembersMutation.mutate(userIds, {
      onSuccess: () => setIsAddModalOpen(false),
    });
  };

  const handleRemoveMembers = (userIds: (string | number)[]) => {
    removeMembersMutation.mutate(userIds, {
      onSuccess: () => setIsRemoveModalOpen(false),
    });
  };

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10">

      {/* هدر صفحه */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
            <Link href="/lines" className="hover:text-gold transition-colors">لاین‌ها</Link>
            <span>/</span>
            <span>اعضا</span>
          </div>
          <h1 className="page-title text-3xl font-extrabold">لیست اعضای لاین</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* دکمه حذف عضو */}
          <button
            onClick={() => setIsRemoveModalOpen(true)}
            className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-all"
          >
            <FiTrash2 size={16} />
            حذف اعضا
          </button>

          {/* دکمه افزودن عضو */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-soft to-gold px-5 py-2.5 text-sm font-bold text-deep shadow-gold hover:shadow-[0_16px_50px_-8px_rgba(201,162,77,0.6)] transition-all"
          >
            <FiUserPlus size={16} />
            افزودن عضو
          </button>
        </div>
      </div>

      {/* نوار جستجو */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="جست‌وجوی نام، شماره تماس یا ایمیل..."
          leftIcon={<FiSearch />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* جدول اعضا */}
      <div className="card overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-deep-2/50 text-xs font-medium text-cream/40 border-b border-cream/10">
            <tr>
              <th className="px-5 py-4">نام کاربر</th>
              <th className="px-5 py-4">شماره تماس</th>
              <th className="px-5 py-4">ایمیل</th>
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
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-cream/40">عضوی یافت نشد.</td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="table-row-brand group transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-cream">
                      {member.user.first_name} {member.user.last_name}
                    </div>
                    <div className="text-xs text-cream/40">@{member.user.username}</div>
                  </td>
                  <td className="px-5 py-4 text-cream/70 dir-ltr text-left">{member.user.phone_number}</td>
                  <td className="px-5 py-4 text-cream/70">{member.user.email || "—"}</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleViewDetails(member)}
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

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        lineId={lineId}
        currentMembers={members}
        onConfirm={handleAddMembers}
        isPending={addMembersMutation.isPending}
      />

      <RemoveMemberModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        members={members}
        onConfirm={handleRemoveMembers}
        isPending={removeMembersMutation.isPending}
      />

    </main>
  );
}