"use client";

import { useState } from "react";
import Link from "next/link";
import { FiCalendar, FiClock, FiUser, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { LuHourglass } from "react-icons/lu";
import { useMemberAppointments } from "@/hooks/useAppointment";
import GlassCard from "@/components/ui/GlassCard";
import type { AppointmentListItem } from "@/types/Appointment";

// تابع کمکی برای دریافت استایل وضعیت
const getStatusStyle = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "canceled":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default: // pending
      return "bg-gold/10 text-gold border-gold/20";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed": return <FiCheckCircle size={14} />;
    case "canceled": return <FiXCircle size={14} />;
    default: return <LuHourglass size={14} />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "confirmed": return "تأیید شده";
    case "canceled": return "لغو شده";
    default: return "در انتظار بررسی";
  }
};

export default function MemberAppointmentsPage() {
  const [filter, setFilter] = useState<string>("");
  const { data, isLoading } = useMemberAppointments({ status: filter || undefined });

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10 space-y-8">

      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-cream">نوبت‌های من</h1>
          <p className="text-cream/50 text-sm mt-1">لیست درخواست‌ها و نوبت‌های رزرو شده</p>
        </div>

        <Link
          href="/dashboard/member/appointments/request"
          className="rounded-xl bg-gold px-4 py-2 text-sm font-bold text-deep hover:opacity-90 transition-opacity"
        >
          درخواست نوبت جدید
        </Link>
      </div>

      {/* فیلترها */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["", "pending", "confirmed", "canceled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              filter === s 
                ? "bg-cream text-deep" 
                : "bg-deep-2/50 text-cream/60 hover:bg-deep-2"
            }`}
          >
            {s ? getStatusLabel(s) : "همه"}
          </button>
        ))}
      </div>

      {/* لیست کارت‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <GlassCard key={i} className="h-48 animate-pulse bg-deep-2/30" />
          ))
        ) : data?.results?.length === 0 ? (
          <div className="col-span-full text-center py-20 text-cream/40">
            هیچ نوبتی ثبت نشده است.
          </div>
        ) : (
          data?.results?.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))
        )}
      </div>
    </main>
  );
}

function AppointmentCard({ appointment }: { appointment: AppointmentListItem }) {
  const statusStyle = getStatusStyle(appointment.status);

  return (
    <GlassCard className="p-6 flex flex-col gap-4 hover:border-gold/30 transition-colors group">

      {/* هدر کارت */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-cream text-lg">{appointment.line}</h3>
          <p className="text-xs text-cream/40 mt-1">
            ثبت شده در: {new Date(appointment.created_at).toLocaleDateString('fa-IR')}
          </p>
        </div>
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle}`}>
          {getStatusIcon(appointment.status)}
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      {/* جزئیات */}
      <div className="space-y-3 text-sm text-cream/70 flex-1">
        {appointment.description && (
          <p className="line-clamp-2 text-cream/50 italic border-r-2 border-gold/20 pr-3">
            "{appointment.description}"
          </p>
        )}

        <div className="flex items-center gap-2">
          <FiUser size={16} className="text-gold/70" />
          <span>کارشناس: {appointment.staff || "تعیین نشده"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiCalendar size={16} className="text-gold/70" />
          <span>
            {appointment.appointment_time
              ? new Date(appointment.appointment_time).toLocaleString('fa-IR')
              : "زمان هنوز تعیین نشده"}
          </span>
        </div>
      </div>

      {/* دکمه عملیات (اختیاری) */}
      {appointment.status === "pending" && (
        <div className="pt-4 border-t border-cream/5 mt-2">
          <p className="text-xs text-cream/40 text-center">
            پس از تأیید ادمین، زمان دقیق به شما اعلام خواهد شد.
          </p>
        </div>
      )}
    </GlassCard>
  );
}