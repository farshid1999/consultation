import { z } from "zod";
import { userCreateSchema, userUpdateSchema } from "./user";

/** Mirrors StaffCreateSerializer: user (nested, required) + employee_code/hire_date/position. */
export const staffCreateSchema = z.object({
  user: userCreateSchema,
  employee_code: z.string().min(1, "کد پرسنلی الزامی است"),
  hire_date: z.date({ required_error: "تاریخ استخدام الزامی است" }),
  position: z.string().min(1, "سمت الزامی است"),
});

/** Mirrors StaffUpdateSerializer: everything optional (partial update). */
export const staffUpdateSchema = z.object({
  user: userUpdateSchema.optional(),
  employee_code: z.string().min(1, "کد پرسنلی الزامی است").optional(),
  hire_date: z.date().nullable().optional(),
  position: z.string().min(1, "سمت الزامی است").optional(),
});

export type StaffCreateFormValues = z.infer<typeof staffCreateSchema>;
export type StaffUpdateFormValues = z.infer<typeof staffUpdateSchema>;
