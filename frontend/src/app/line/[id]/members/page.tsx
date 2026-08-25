"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FiEye, FiSearch, FiArrowRight } from "react-icons/fi";
import { Input } from "@/components/ui/inputs";
import { useLineMembers } from "@/hooks/useLines";
import UserDetailModal from "@/components/ui/modals/UserDetailModal";
import type { LineMember } from "@/types";
import "@/styles/light.css";

export default function LineMembersPage() {
  const params = useParams<{ id: string }>();
  const lineId = params.id;

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // هوک حالا کل آبجکت Paginated را برمی‌گرداند
  const { data, isLoading } = useLineMembers(lineId, { search: search || undefined });

  // استخراج آرایه واقعی از داخل results
  const members = data?.results || [];

  const handleViewDetails = (member: LineMember) => {
    setSelectedUser(member.user);
    setIsModalOpen(true);
  };

  return (
    <main dir="rtl" className="theme-light-admin mx-auto max-w-6xl px-6 py-10">

      {/* هدر صفحه */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/line" className="hover:text-[#0f1f12]">بخش‌ها</Link>
            <FiArrowRight size={12} className="rotate-180" />
            <span>اعضا</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0f1f12]">لیست اعضای بخش</h1>
        </div>

        <Link
          href={`/line/${lineId}`}
          className="text-sm font-medium text-slate-500 hover:text-[#c9a24d] transition-colors flex items-center gap-1"
        >
          بازگشت به جزئیات بخش
        </Link>
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
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50/50 text-xs font-medium text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-5 py-4">نام کاربر</th>
              <th className="px-5 py-4">شماره تماس</th>
              <th className="px-5 py-4">ایمیل</th>
              <th className="px-5 py-4 text-center w-24">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#c9a24d] inline-block"></span>
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">عضوی یافت نشد.</td>
              </tr>
            ) : (
              // استفاده از members که حالا یک آرایه صحیح است
              members.map((member) => (
                <tr key={member.id} className="group hover:bg-[#e8f5ee]/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-800">
                      {member.user.first_name} {member.user.last_name}
                    </div>
                    <div className="text-xs text-slate-400">@{member.user.username}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dir-ltr text-left">{member.user.phone_number}</td>
                  <td className="px-5 py-4 text-slate-600">{member.user.email || "—"}</td>
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

      {/* مودال جزئیات */}
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />

    </main>
  );
}