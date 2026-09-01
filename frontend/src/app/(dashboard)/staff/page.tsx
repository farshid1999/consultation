"use client";

import { useUsers } from "@/hooks/useUsers";
import { FiUsers, FiUserPlus } from "react-icons/fi";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";

export default function AdminDashboardPage() {
  const { data } = useUsers();

  const stats = [
    {
      label: "کل کاربران",
      value: data?.count ?? "—",
      icon: FiUsers,
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-cream">داشبورد</h1>
        <p className="text-cream/40 text-sm mt-1">خلاصه‌ای از وضعیت سیستم</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <GlassCard className="p-6 flex items-center gap-4 hover:border-gold/30 transition-colors cursor-pointer">
              <div className="p-3 rounded-xl bg-gold/10">
                <Icon className="text-gold" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-cream">{value}</p>
                <p className="text-cream/50 text-sm">{label}</p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-medium text-cream/60 mb-3">دسترسی سریع</h2>
        <div className="flex flex-wrap gap-3">
          {/*<Link*/}
          {/*  href="/admin/users/create"*/}
          {/*  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-deep text-sm font-medium hover:opacity-90 transition-opacity"*/}
          {/*>*/}
          {/*  <FiUserPlus size={15} />*/}
          {/*  افزودن کاربر جدید*/}
          {/*</Link>*/}
        </div>
      </div>
    </div>
  );
}