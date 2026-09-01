"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useContentDetail, useUpdateContent } from "@/hooks/useContent";
import { useLineMembers } from "@/hooks/useLines";
import { contentUpdateSchema, type ContentUpdateFormValues } from "@/schemas/content";
import ContentFormFields from "./ContentFormFields";
import type { ApiError, ContentUpdateInput } from "@/types";

export default function ContentUpdateForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const contentId = params.id;

  const { data: content, isLoading: isFetching } = useContentDetail(contentId);
  const { data: membersData } = useLineMembers(content?.line?.id || null);

  const membersOptions =
    membersData?.results.map((m: any) => ({
      value: m.id.toString(),
      label: `${m.user.first_name || ""} ${m.user.last_name || ""}`.trim() || `@${m.user.username}`,
    })) || [];

  const updateContent = useUpdateContent();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContentUpdateFormValues>({
    resolver: zodResolver(contentUpdateSchema),
    defaultValues: {
      title: "",
      text: "",
      member_ids: [],
      media_files: [],
      audio_clips: [],
      existing_media_ids: [],
    },
  });

  // مهم: فقط یک‌بار (اولین باری که content می‌رسد) فرم را reset می‌کنیم.
  // قبلاً این effect با هر تغییر رفرنس content اجرا می‌شد — از جمله
  // رفرچ‌های پس‌زمینه‌ی خودکار react-query (مثلاً وقتی پنجره دوباره
  // فوکوس می‌گیرد، مثل برگشتن از DevTools). یعنی existing_media_ids
  // کاربر (که تازه یک آیتم را toggle/حذف کرده بود) دوباره به لیست کامل
  // اولیه برمی‌گشت و تغییرش درست قبل از submit پاک می‌شد. برای همین
  // «افزودن» کار می‌کرد (media_files همیشه [] ریست می‌شد، چیزی برای
  // پاک شدن نداشت) ولی «حذف» همیشه بی‌اثر می‌شد.
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (content && !hasInitialized.current) {
      hasInitialized.current = true;
      reset({
        title: content.title,
        text: content.text || "",
        member_ids: content.recipients?.map((r) => r.member.id) || [],
        media_files: [],
        audio_clips: [],
        existing_media_ids: content.media?.map((m) => m.id) || [],
      });
    }
  }, [content, reset]);

  const onSubmit = async (values: ContentUpdateFormValues) => {
    const media: ContentUpdateInput["media"] = [];

    (values.media_files || []).forEach((file: File) => {
      media.push({ file });
    });

    (values.audio_clips || []).forEach((entry, index) => {
      if (!entry.clip) return;
      const audioBlob = entry.clip as Blob;
      const audioFile = new File(
        [audioBlob],
        `voice-update-${Date.now()}-${index}.webm`,
        { type: (audioBlob as any).type || "audio/webm" }
      );
      media.push({ file: audioFile });
    });

    const payload: ContentUpdateInput = {
      title: values.title,
      text: values.text,
      member_ids: values.member_ids,
      media,
      existing_media_ids: values.existing_media_ids || [],
    };

    try {
      await updateContent.mutateAsync({ id: contentId, payload });
      router.back();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message ?? "خطا در بروزرسانی محتوا");
      Object.entries(apiError.fieldErrors ?? {}).forEach(([field, messages]) => {
        if (field === "media") return;
        setError(field as never, { type: "server", message: messages[0] });
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block"></span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <ContentFormFields
        control={control}
        errors={errors}
        membersOptions={membersOptions}
        mode="edit"
        existingMedia={content?.media || []}
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
          {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </form>
  );
}