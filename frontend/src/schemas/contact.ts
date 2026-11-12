import { z } from "zod";
import { messages } from "@/locales";

type ContactValidationMessages = (typeof messages)["fa"]["contact"]["validation"];

/**
 * اسکیمای فرم تماس؛ پیام‌های خطا از فایل ترجمه (fa/en) می‌آیند.
 */
export const createContactSchema = (v: ContactValidationMessages) =>
  z
    .object({
      first_name: z.string().min(1, v.firstName),
      last_name: z.string().min(1, v.lastName),
      phone: z.string().min(10, v.phone),
      contact_type: z.enum(["phone", "messenger", "email"], {
        required_error: v.contactType,
      }),
      messenger_type: z
        .enum(["whatsapp", "telegram", "eitaa", "rubika", "bale"])
        .optional()
        .nullable(),
      email: z.string().optional().nullable(),
      message: z.string().optional().nullable(),
    })
    .superRefine((data, ctx) => {
      if (data.contact_type === "messenger" && !data.messenger_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: v.messenger,
          path: ["messenger_type"],
        });
      }
    });

/** نسخه‌ی فارسی؛ برای سازگاری با کدهای قبلی که این نام را import می‌کنند */
export const contactCreateSchema = createContactSchema(
  messages.fa.contact.validation,
);

export type ContactCreateFormValues = z.infer<typeof contactCreateSchema>;
