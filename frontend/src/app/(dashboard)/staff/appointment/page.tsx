"use client";

import { useState } from "react";
import Link from "next/link";
import { FiCalendar, FiUser, FiCheckCircle, FiXCircle, FiSearch } from "react-icons/fi";
import { LuHourglass } from "react-icons/lu";
import { useStaffAppointments } from "@/hooks/useAppointment";
import GlassCard from "@/components/ui/GlassCard";
import type { AppointmentListItem } from "@/types/Appointment";

export default function StaffAppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data, isLoading } = useStaffAppointments({
    status: statusFilter || undefined
  });

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10 space-y-8">

      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-cream">نوبت‌های من</h1>
          <p className="text-cream/50 text-sm mt-1">مدیریت نوبت‌های تعیین شده و درخواست‌های جدید</p>
        </div>

        {/* فیلتر وضعیت */}
        <div className="flex gap-2">
          {["", "pending", "confirmed", "canceled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s 
                  ? "bg-gold text-deep font-bold" 
                  : "bg-deep-2/50 text-cream/60 hover:bg-deep-2"
              }`}
            >
              {s ? getStatusLabel(s) : "همه"}
            </button>
          ))}
        </div>
      </div>

      {/* جدول نوبت‌ها */}
      <div className="card overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-deep-2/50 text-xs font-medium text-cream/40 border-b border-cream/10">
            <tr>
              <th className="px-5 py-4">درخواست دهنده</th>
              <th className="px-5 py-4">بخش (لاین)</th>
              <th className="px-5 py-4">زمان نوبت</th>
              <th className="px-5 py-4">وضعیت</th>
              <th className="px-5 py-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/5">
            {isLoading ? (
              <tr><td colSpan={5} className="py-10 text-center text-cream/40">در حال بارگذاری...</td></tr>
            ) : data?.results?.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-cream/40">نوبتی یافت نشد.</td></tr>
            ) : (
              data?.results?.map((apt) => (
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
          <span className="text-cream/30 text-xs flex items-center gap-1">
            <LuHourglass size={12} />
            تعیین نشده
          </span>
        )}
      </td>

      <td className="px-5 py-4">{getStatusBadge(appointment.status)}</td>

      <td className="px-5 py-4 text-center">
        <Link
          href={`/staff/appointments/${appointment.id}`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
          title="مدیریت نوبت"
        >
          <FiSearch size={14} />
        </Link>
      </td>
    </tr>
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case "confirmed": return "تأیید شده";
    case "canceled": return "لغو شده";
    case "pending": return "در انتظار";
    default: return "همه";
  }
}