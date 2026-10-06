"use client";

import { useState } from "react";
import Link from "next/link";
import { FiCalendar, FiUser, FiCheckCircle, FiXCircle, FiSearch, FiFilter } from "react-icons/fi";
import { useAdminAppointments } from "@/hooks/useAppointment";
import { useLines } from "@/hooks/useLines";
import GlassCard from "@/components/ui/GlassCard";
import type { AppointmentListItem } from "@/types/Appointment";

export default function AdminAppointmentsPage() {
  const [filters, setFilters] = useState({
    status: "",
    line_id: "",
  });

  const { data: appointments, isLoading } = useAdminAppointments(filters);
  const { data: lines } = useLines(); // برای ساختن لیست کشویی لاین‌ها

  return (
    <main dir="rtl" className="mx-auto max-w-7xl px-6 py-10 space-y-8">

      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-cream">مدیریت نوبت‌ها</h1>
          <p className="text-cream/50 text-sm mt-1">بررسی و تعیین زمان نوبت‌های ثبت شده</p>
        </div>
      </div>

      {/* بخش فیلترها */}
      <GlassCard className="p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-cream/60 mb-1">وضعیت</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full bg-deep-2 border border-cream/10 rounded-lg px-3 py-2 text-sm text-cream focus:border-gold outline-none"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">در انتظار</option>
            <option value="confirmed">تأیید شده</option>
            <option value="canceled">لغو شده</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-cream/60 mb-1">بخش (لاین)</label>
          <select
            value={filters.line_id}
            onChange={(e) => setFilters({ ...filters, line_id: e.target.value })}
            className="w-full bg-deep-2 border border-cream/10 rounded-lg px-3 py-2 text-sm text-cream focus:border-gold outline-none"
          >
            <option value="">همه بخش‌ها</option>
            {lines?.results?.map((line) => (
              <option key={line.id} value={line.id}>{line.title}</option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* جدول نوبت‌ها */}
      <div className="card overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-deep-2/50 text-xs font-medium text-cream/40 border-b border-cream/10">
            <tr>
              <th className="px-5 py-4">درخواست دهنده / ممبر</th>
              <th className="px-5 py-4">بخش (لاین)</th>
              <th className="px-5 py-4">کارشناس</th>
              <th className="px-5 py-4">زمان نوبت</th>
              <th className="px-5 py-4">وضعیت</th>
              <th className="px-5 py-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/5">
            {isLoading ? (
              <tr><td colSpan={6} className="py-10 text-center text-cream/40">در حال بارگذاری...</td></tr>
            ) : appointments?.results?.length === 0 ? (
              <tr><td colSpan={6} className="py-10 text-center text-cream/40">نوبتی یافت نشد.</td></tr>
            ) : (
              appointments?.results?.map((apt) => (
                <AppointmentRow key={apt.id} appointment={apt} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function AppointmentRow({ appointment }: { appointment: AppointmentListItem }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": return <span className="badge-green">تأیید شده</span>;
      case "canceled": return <span className="badge-red">لغو شده</span>;
      default: return <span className="badge-gold">در انتظار</span>;
    }
  };

  // نمایش نام درخواست دهنده یا ممبر
  const userName = appointment.requested_by || appointment.member || "نامشخص";

  return (
    <tr className="table-row-brand group transition-colors hover:bg-deep-2/30">
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <FiUser size={14} className="text-gold/70" />
          <span className="font-medium text-cream">{userName}</span>
        </div>
        {appointment.description && (
          <p className="text-[10px] text-cream/40 mt-1 line-clamp-1 max-w-[200px]">{appointment.description}</p>
        )}
      </td>

      <td className="px-5 py-4 text-cream/80">{appointment.line}</td>

      <td className="px-5 py-4 text-cream/60">
        {appointment.staff || <span className="text-cream/30">—</span>}
      </td>

      <td className="px-5 py-4 text-cream/60 whitespace-nowrap">
        {appointment.appointment_time ? (
          <div className="flex items-center gap-1.5">
            <FiCalendar size={14} />
            {new Date(appointment.appointment_time).toLocaleDateString('fa-IR')}
            <span className="text-[10px] bg-deep-2 px-1.5 rounded">
              {new Date(appointment.appointment_time).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        ) : (
          <span className="text-cream/30 text-xs">تعیین نشده</span>
        )}
      </td>

      <td className="px-5 py-4">{getStatusBadge(appointment.status)}</td>

      <td className="px-5 py-4 text-center">
        <Link
          href={`/admin/appointment/${appointment.id}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
          title="مدیریت نوبت"
        >
          <FiSearch size={14} />
        </Link>
      </td>
    </tr>
  );
}