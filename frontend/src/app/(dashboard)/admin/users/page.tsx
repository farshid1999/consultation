"use client";

import { useState } from "react";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import Link from "next/link";
import { FiUserPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useUsers(search ? { search } : undefined);
  console.log("users data:", data);
  const { mutate: deleteUser } = useDeleteUser();

  const handleDelete = (id: number, username: string) => {
    if (!confirm(`آیا مطمئنید که می‌خواهید کاربر "${username}" را حذف کنید؟`)) return;
    deleteUser(id);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-cream">کاربران</h1>
          <p className="text-cream/40 text-sm mt-1">
            {data?.pagination?.count ?? 0} کاربر ثبت‌شده
          </p>
        </div>
        <Link
          href="/admin/users/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-deep text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <FiUserPlus size={15} />
          افزودن کاربر
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30" size={15} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو..."
          className="w-full rounded-xl border border-cream/10 bg-cream/5 py-2.5 pr-9 pl-4 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-cream/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream/10 bg-cream/[0.03]">
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">کاربر</th>
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">ایمیل</th>
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">موبایل</th>
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">باشگاه</th>
              <th className="text-right px-5 py-3.5 text-cream/50 font-medium">وضعیت</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-cream/30 text-sm">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : data?.results?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-cream/30 text-sm">
                  کاربری یافت نشد
                </td>
              </tr>
            ) : (
              data?.results?.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-cream/5 hover:bg-cream/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                          {user.first_name?.[0] ?? user.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-cream font-medium">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.username}
                        </p>
                        <p className="text-cream/40 text-xs">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-cream/60">{user.email || "—"}</td>
                  <td className="px-5 py-4 text-cream/60 font-mono">{user.phone_number || "—"}</td>
                  <td className="px-5 py-4 text-cream/60">{user.club || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                      user.is_student
                        ? "bg-blue-400/10 text-blue-400"
                        : "bg-cream/10 text-cream/50"
                    )}>
                      {user.is_student ? "دانشجو" : "عادی"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="p-1.5 rounded-lg text-cream/40 hover:text-gold hover:bg-gold/10 transition-colors"
                      >
                        <FiEdit2 size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id, user.username ?? "")}
                        className="p-1.5 rounded-lg text-cream/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
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