"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentCreateSchema, type AppointmentCreateFormValues } from "@/schemas/appointment";
import { useCreateAppointment } from "@/hooks/useAppointment";
import { Input } from "@/components/ui/Inputs";

interface AppointmentCreateFormProps {
  lineId: string;
  memberOptions: { id: string; label: string }[];
  staffOptions: { id: string; label: string }[];
  onSuccess?: () => void;
}

export default function AppointmentCreateForm({
  lineId,
  memberOptions,
  staffOptions,
  onSuccess,
}: AppointmentCreateFormProps) {
  const { mutate: createAppointment, isPending, error } = useCreateAppointment();

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentCreateFormValues>({
    resolver: zodResolver(appointmentCreateSchema),
    defaultValues: {
      line: lineId,
      status: "pending",
    },
  });

  const onSubmit = (data: AppointmentCreateFormValues) => {
    createAppointment(data, {
      onSuccess: () => onSuccess?.(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gold border-b border-cream/10 pb-2">
          اطلاعات جلسه
        </h2>

        {/* Member */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-cream/60">
            عضو <span className="text-red-400">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50"
            {...field("member")}
          >
            <option value="">انتخاب عضو</option>
            {memberOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
          {errors.member && (
            <p className="text-xs text-red-400">{errors.member.message}</p>
          )}
        </div>

        {/* Staff */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-cream/60">
            کارمند <span className="text-red-400">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50"
            {...field("staff")}
          >
            <option value="">انتخاب کارمند</option>
            {staffOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.staff && (
            <p className="text-xs text-red-400">{errors.staff.message}</p>
          )}
        </div>

        {/* Appointment Time */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-cream/60">
            زمان جلسه <span className="text-red-400">*</span>
          </label>
          <input
            type="datetime-local"
            className="w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50"
            {...field("appointment_time")}
          />
          {errors.appointment_time && (
            <p className="text-xs text-red-400">{errors.appointment_time.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-cream/60">
            وضعیت <span className="text-red-400">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50"
            {...field("status")}
          >
            <option value="pending">در انتظار</option>
            <option value="confirmed">تأیید شده</option>
            <option value="cancelled">لغو شده</option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-400">{errors.status.message}</p>
          )}
        </div>
      </section>

      {error && (
        <p className="text-xs text-red-400">
          {(error as any)?.detail ?? "خطایی رخ داد."}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-deep hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {isPending ? "در حال ذخیره..." : "ثبت جلسه"}
      </button>
    </form>
  );
}