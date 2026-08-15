import { z } from "zod";

// ── Shared ────────────────────────────────────────────────────────────────────

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

// ── Create User ───────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام کاربری نباید بیشتر از ۵۰ کاراکتر باشد"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
  first_name: z.string().min(1, "نام الزامی است"),
  last_name: z.string().min(1, "نام خانوادگی الزامی است"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
  phone_number: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),
  land_line: z.string().optional(),
  is_student: z.boolean().optional(),
  degree: z.string().max(100).optional(),
  job: z.string().max(100).optional(),
  sport_discipline: z.string().max(100).optional(),
  professional_background: z.string().optional(),
  referral_code: z.string().optional(),
  bio: z.string().optional(),
  birth_date: z.string().optional(), // YYYY-MM-DD
  address: addressSchema.optional(),
  club: clubSchema.optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// ── Update User ───────────────────────────────────────────────────────────────

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .partial()
  .extend({
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد").optional(),
  });

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;