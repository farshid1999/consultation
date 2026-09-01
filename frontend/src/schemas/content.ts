// schemas/content.ts
import { z } from "zod";

export const contentUpdateSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است").optional(),
  text: z.string().optional(),
  member_ids: z.array(z.string()).optional(),

  media_files: z.array(z.any()).optional(), // فایل‌های جدید
  audio_clips: z.array(z.object({ clip: z.any().nullable() })).optional(), // صداهای جدید (many)

  // لیستی از UUID فایل‌های قدیمی که کاربر تصمیم گرفته نگه دارد.
  // نکته: Media هم مثل بقیه‌ی مدل‌ها UUIDField دارد، نه عدد — این‌جا
  // قبلاً z.number() بود که باعث fail شدن همیشگی این schema و در نتیجه
  // هیچ‌وقت صدا زده نشدن onSubmit می‌شد.
  existing_media_ids: z.array(z.string()).optional(),
});

export type ContentUpdateFormValues = z.infer<typeof contentUpdateSchema>;