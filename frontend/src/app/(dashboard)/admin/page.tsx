"use client";

import { useState } from "react";
import Link from "next/link";
import { FiUsers, FiUserPlus, FiBriefcase, FiFileText, FiMessageSquare, FiCalendar, FiCheckCircle } from "react-icons/fi";
import { useDashboardStats } from "@/hooks/useDashboard";
import GlassCard from "@/components/ui/GlassCard";
import SignupTrendChart from "@/components/charts/SignupTrendChart";
import UserRolesChart from "@/components/charts/UserRolesChart";

export default function AdminDashboardPage() {
  const [days, setDays] = useState(30);
  const { data: stats, isLoading } = useDashboardStats(days);

  if (isLoading) {
    return (
      <main dir="rtl" className="mx-auto max-w-7xl px-6 py-10 flex justify-center">
        <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block"></span>
      </main>
    );
  }

  if (!stats) return null;

  return (
    <main dir="rtl" className="mx-auto max-w-7xl px-6 py-10 space-y-8">

      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-cream">داشبورد مدیریت</h1>
          <p className="text-cream/50 text-sm mt-1">نمای کلی از عملکرد سیستم در {stats.window_days} روز گذشته</p>
        </div>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="bg-deep-2 border border-cream/10 rounded-lg px-3 py-2 text-sm text-cream focus:border-gold outline-none"
        >
          <option value={7}>۷ روز اخیر</option>
          <option value={30}>۳۰ روز اخیر</option>
          <option value={90}>۳ ماه اخیر</option>
        </select>
      </div>

      {/* کارت‌های آماری اصلی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="کل کاربران"
          value={stats.users.total}
          icon={FiUsers}
          color="gold"
          href="/admin/users"
        />
        <StatCard
          label="کارمندان فعال"
          value={stats.users.staff_count}
          icon={FiBriefcase}
          color="blue"
          href="/admin/staff"
        />
        <StatCard
          label="بخش‌های عملیاتی"
          value={stats.lines.total_lines}
          icon={FiFileText}
          color="green"
          href="/staff/line"
        />
        <StatCard
          label="نوبت‌های آینده"
          value={stats.appointments.upcoming}
          icon={FiCalendar}
          color="purple"
          href="/admin/appointments"
        />
      </div>

      {/* بخش نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-cream mb-4">روند ثبت‌نام کاربران</h3>
          <SignupTrendChart data={stats.users.signup_trend} />
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-cream mb-4">توزیع نقش‌های کاربری</h3>
          <UserRolesChart data={stats.users.by_role} />
        </GlassCard>
      </div>

      {/* آمار تکمیلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-cream">فرم‌های مشاوره</h3>
            <FiCheckCircle className="text-gold" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cream/60">کل فرم‌ها:</span>
              <span className="text-cream font-bold">{stats.consultations.total_forms}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream/60">پاسخ‌های دریافتی:</span>
              <span className="text-cream font-bold">{stats.consultations.total_submissions}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-cream">پیام‌رسانی</h3>
            <FiMessageSquare className="text-blue-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cream/60">کل مکالمات:</span>
              <span className="text-cream font-bold">{stats.conversations.total_conversations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream/60">کل پیام‌ها:</span>
              <span className="text-cream font-bold">{stats.conversations.total_messages}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-cream">تکالیف</h3>
            <FiFileText className="text-green-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cream/60">نرخ تکمیل:</span>
              <span className="text-cream font-bold">{stats.assignments.completion_rate_percent}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cream/60">در انتظار بررسی:</span>
              <span className="text-cream font-bold">{stats.assignments.pending_submissions}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* دسترسی سریع */}
      <div className="pt-4 border-t border-cream/10">
        <h2 className="text-sm font-medium text-cream/60 mb-3">دسترسی سریع</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/users/create"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-deep text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <FiUserPlus size={15} />
            افزودن کاربر جدید
          </Link>
          <Link
            href="/staff/line/create"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cream/20 text-cream text-sm font-medium hover:border-gold/50 transition-colors"
          >
            ایجاد بخش جدید
          </Link>
        </div>
      </div>

    </main>
  );
}

// کامپوننت کمکی برای کارت‌های آماری
function StatCard({ label, value, icon: Icon, color, href }: any) {
  const colorClasses = {
    gold: "bg-gold/10 text-gold",
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    purple: "bg-purple-500/10 text-purple-400",
  };

  return (
    <Link href={href}>
      <GlassCard className="p-6 flex items-center gap-4 hover:border-gold/30 transition-colors cursor-pointer group">
        <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-2xl font-bold text-cream group-hover:text-gold transition-colors">{value}</p>
          <p className="text-cream/50 text-sm">{label}</p>
        </div>
      </GlassCard>
    </Link>
  );
}