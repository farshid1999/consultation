import { z } from "zod";

// ── Appointment ───────────────────────────────────────────────────────────────

export const appointmentCreateSchema = z.object({
  line: z.string({ required_error: "لاین الزامی است" }),
  member: z.string({ required_error: "عضو الزامی است" }),
  staff: z.string({ required_error: "کارمند الزامی است" }),
  status: z.string({ required_error: "وضعیت الزامی است" }),
  appointment_time: z.string({ required_error: "زمان جلسه الزامی است" }),
});

export const appointmentUpdateSchema = z.object({
  status: z.string().optional(),
  appointment_time: z.string().optional(),
});

export type AppointmentCreateFormValues = z.infer<typeof appointmentCreateSchema>;
export type AppointmentUpdateFormValues = z.infer<typeof appointmentUpdateSchema>;