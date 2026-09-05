import { z } from "zod";

export const contactCreateSchema = z.object({
  first_name: z.string().min(1, "نام الزامی است"),
  last_name: z.string().min(1, "نام خانوادگی الزامی است"),
  phone: z.string().min(10, "شماره تماس معتبر نیست"),
  contact_type: z.enum(["phone", "messenger", "email"], {
    required_error: "نوع ارتباط الزامی است",
  }),
  messenger_type: z.enum(["whatsapp", "telegram", "eitaa", "rubika", "bale"]).optional().nullable(),
  email: z.string().email("ایمیل معتبر نیست").optional().nullable(),
  message: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.contact_type === "messenger" && !data.messenger_type) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "انتخاب پیام‌رسان الزامی است",
      path: ["messenger_type"],
    });
  }
  if (data.contact_type === "email" && !data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ایمیل الزامی است",
      path: ["email"],
    });
  }
});

export type ContactCreateFormValues = z.infer<typeof contactCreateSchema>;