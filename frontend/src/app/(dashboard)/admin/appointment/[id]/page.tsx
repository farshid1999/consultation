"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FiCalendar,
  FiUser,
  FiClock,
  FiChevronLeft,
  FiEdit3,
  FiCheckCircle,
  FiXCircle,
  FiSave,
} from "react-icons/fi";
import { useStaffAppointmentDetail, useUpdateAppointment } from "@/hooks/useAppointment";
import { useLineStaff } from "@/hooks/useLines"; // فرض بر وجود این هوک برای گرفتن لیست استاف‌های لاین
import GlassCard from "@/components/ui/GlassCard";
import Modal from "@/components/ui/modals/Modal"; // کامپوننت مودال پروژه شما
import { Input, Select } from "@/components/ui/inputs";
import type { AppointmentDetail } from "@/types/Appointment";
import EditAppointmentForm from "@/forms/appointment/EditAppointmentForm";


// ─── توابع کمکی نمایش نام ──────────────────────────────────────
function getRequesterName(a: AppointmentDetail): string {
  if ((a as any).requester_name) return (a as any).requester_name;
  if (a.requested_by?.name) return a.requested_by.name;
  const u = a.member?.user;
  if (u) {
    const full = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
    if (full) return full;
  }
  return "نامشخص";
}

function getStaffName(a: AppointmentDetail): string | null {
  if ((a as any).staff_name) return (a as any).staff_name;
  const u = a.staff?.user;
  if (u) {
    const full = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
    if (full) return full;
  }
  return a.staff ? "نامشخص" : null;
}

// ─── اسکیمای اعتبارسنجی فرم ویرایش ─────────────────────────────
const updateSchema = z.object({
  status: z.enum(["pending", "confirmed", "canceled"]).optional(),
  appointment_time: z.string().optional().or(z.literal("")),
  staff: z.string().optional().or(z.literal("")),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

// ─── کامپوننت اصلی صفحه ────────────────────────────────────────
export default function StaffAppointmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: appointment, isLoading } = useStaffAppointmentDetail(params.id);

  if (isLoading) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10 flex justify-center">
        <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block" />
      </main>
    );
  }

  if (!appointment) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10 text-center text-cream/60">
        نوبت مورد نظر یافت نشد.
      </main>
    );
  }

  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-deep-2/50 text-cream/60 transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-cream">جزئیات نوبت</h1>
            <p className="text-xs text-cream/40 mt-1">
              کد رهگیری: {appointment.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/20 px-4 py-2 text-sm font-bold text-gold hover:bg-gold/20 transition-all"
        >
          <FiEdit3 size={16} />
          تنظیم زمان و وضعیت
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ستون اصلی */}
        <div className="md:col-span-2 space-y-6">
          {/* متقاضی */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
              <FiUser size={16} /> اطلاعات متقاضی
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-cream/5 pb-2">
                <span className="text-cream/60">نام:</span>
                <span className="text-cream font-medium">
                  {getRequesterName(appointment)}
                </span>
              </div>
              <div className="flex justify-between border-b border-cream/5 pb-2">
                <span className="text-cream/60">بخش مربوطه:</span>
                <span className="text-cream font-medium">{appointment.line}</span>
              </div>
              {appointment.description && (
                <div className="pt-2">
                  <span className="text-cream/60 block mb-1">توضیحات درخواست:</span>
                  <p className="text-cream/80 bg-deep-2/30 p-3 rounded-lg text-xs leading-relaxed">
                    {appointment.description}
                  </p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* زمان و کارشناس */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
              <FiClock size={16} /> زمان و کارشناس
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-cream/5 pb-2">
                <span className="text-cream/60">کارشناس تعیین شده:</span>
                <span className={`font-medium ${getStaffName(appointment) ? "text-cream" : "text-cream/40"}`}>
                  {getStaffName(appointment) ?? "هنوز تعیین نشده"}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-cream/60">زمان نوبت:</span>
                <span
                  className={`font-medium flex items-center gap-2 ${
                    appointment.appointment_time ? "text-cream" : "text-cream/40"
                  }`}
                >
                  {appointment.appointment_time ? (
                    <>
                      <FiCalendar size={14} className="text-gold" />
                      {new Date(appointment.appointment_time).toLocaleString("fa-IR")}
                    </>
                  ) : (
                    "تعیین نشده"
                  )}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* وضعیت */}
        <div className="space-y-6">
          <GlassCard className="p-6 text-center">
            <h3 className="text-xs font-bold text-cream/40 uppercase tracking-wider mb-4">
              وضعیت فعلی
            </h3>

            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                appointment.status === "confirmed"
                  ? "bg-green-500/10 text-green-400"
                  : appointment.status === "canceled"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-gold/10 text-gold animate-pulse"
              }`}
            >
              {appointment.status === "confirmed" ? (
                <FiCheckCircle size={32} />
              ) : appointment.status === "canceled" ? (
                <FiXCircle size={32} />
              ) : (
                <HourglassIcon size={32} />
              )}
            </div>

            <p className="text-lg font-bold text-cream">
              {appointment.status === "confirmed"
                ? "تأیید شده"
                : appointment.status === "canceled"
                ? "لغو شده"
                : "در انتظار بررسی"}
            </p>

            <p className="text-xs text-cream/40 mt-4 border-t border-cream/10 pt-4">
              تاریخ ثبت درخواست:
              <br />
              {new Date(appointment.created_at).toLocaleDateString("fa-IR")}
            </p>
          </GlassCard>
        </div>
      </div>

      {/* مودال ویرایش */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="ویرایش نوبت">
        <EditAppointmentForm
          appointment={appointment}
          onSuccess={() => setIsEditOpen(false)}
        />
      </Modal>
    </main>
  );
}

function HourglassIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}