"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateContent } from "@/hooks/useContent";
import { useLineMembers } from "@/hooks/useLines";
import ContentFormFields from "./ContentFormFields";
import type { ApiError, ContentCreateInput } from "@/types";

const contentSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  text: z.string().optional(),
  member_ids: z.array(z.string()).min(1, "حداقل یک عضو را انتخاب کنید"),
  media_files: z.array(z.any()).optional(),
  audio_clips: z.array(z.object({ clip: z.any().nullable() })).optional(),
});

type ContentFormValues = z.infer<typeof contentSchema>;

export default function ContentCreateForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const lineId = params.id;

  const createContent = useCreateContent();
  const { data: membersData } = useLineMembers(lineId);

  const membersOptions =
    membersData?.results.map((m: any) => {
      const fullName = `${m.user.first_name || ""} ${m.user.last_name || ""}`.trim();
      return {
        value: m.id.toString(),
        label: fullName || `@${m.user.username}`,
      };
    }) || [];

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      text: "",
      member_ids: [],
      media_files: [],
      audio_clips: [],
    },
  });

  const onSubmit = async (values: ContentFormValues) => {
    // فایل‌ها و صداها هر دو به یک آرایه‌ی تخت media تبدیل می‌شوند؛
    // متن فقط یک‌بار در سطح content.text می‌نشیند، نه روی هیچ‌کدام
    // از رسانه‌ها.
    const media: ContentCreateInput["media"] = [];

    (values.media_files || []).forEach((file: File) => {
      media.push({ file });
    });

    (values.audio_clips || []).forEach((entry, index) => {
      if (!entry.clip) return;
      const audioBlob = entry.clip as Blob;
      const audioFile = new File(
        [audioBlob],
        `voice-${Date.now()}-${index}.webm`,
        { type: (audioBlob as any).type || "audio/webm" }
      );
      media.push({ file: audioFile });
    });

    const payload: ContentCreateInput = {
      line: lineId,
      title: values.title,
      text: values.text || undefined,
      member_ids: values.member_ids,
      media,
    };

    try {
      await createContent.mutateAsync(payload);
      router.back();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message ?? "خطا در ایجاد محتوا");
      Object.entries(apiError.fieldErrors ?? {}).forEach(([field, messages]) => {
        if (field === "media") return;
        setError(field as never, { type: "server", message: messages[0] });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <ContentFormFields
        control={control}
        errors={errors}
        membersOptions={membersOptions}
      />

      <div className="flex items-center justify-end gap-3 border-t border-cream/10 pt-6 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-cream/20 px-6 py-3 text-sm font-medium text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-gradient-to-b from-gold-soft to-gold px-8 py-3 text-sm font-bold text-deep shadow-gold transition-opacity disabled:opacity-60"
        >
          {isSubmitting ? "در حال ارسال..." : "انتشار محتوا"}
        </button>
      </div>
    </form>
  );
}