import { z } from "zod";

// ── Login ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ── Register ──────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  country: z.string().min(1, "کشور الزامی است"),
  province: z.string().min(1, "استان الزامی است"),
  city: z.string().min(1, "شهر الزامی است"),
  street: z.string().min(1, "آدرس الزامی است"),
  postal_code: z.string().optional(),
  description: z.string().optional(),
});

export const clubSchema = z.object({
  name: z.string().min(1, "نام باشگاه الزامی است"),
  address: addressSchema,
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام کاربری نباید بیشتر از ۵۰ کاراکتر باشد"),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
  first_name: z.string().min(1, "نام الزامی است"),
  last_name: z.string().min(1, "نام خانوادگی الزامی است"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  phone_number: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),
  is_student: z.boolean().optional(),
  degree: z.string().optional(),
  job: z.string().optional(),
  sport_discipline: z.string().optional(),
  professional_background: z.string().optional(),
  club: clubSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;