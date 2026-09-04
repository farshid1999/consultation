// schemas/consultation.ts
import { z } from "zod";

export const responseSchema = z.object({
  title: z.string().min(1, "عنوان پاسخ الزامی است"),
  description: z.string().optional(),
  files: z.array(z.any()).optional(), // فایل‌های جدید آپلود شده
});

export type ResponseFormValues = z.infer<typeof responseSchema>;