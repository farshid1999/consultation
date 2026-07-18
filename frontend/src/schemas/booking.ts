import { z } from "zod";

export const bookingSchema = z.object({
  fullName: z
    .string()
    .min(3, "نام و نام‌خانوادگی باید حداقل ۳ حرف باشد")
    .max(60, "نام وارد شده بیش از حد طولانی است"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل را به‌صورت صحیح وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"),
  sport: z.string().min(2, "رشته‌ی ورزشی را وارد کنید"),
  message: z.string().max(300, "پیام نباید بیش از ۳۰۰ کاراکتر باشد").optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
