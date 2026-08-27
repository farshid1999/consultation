"use client";

import {useRouter, useParams} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {toast} from "sonner";
import {useCreateContent} from "@/hooks/useContent";
import {useLineMembers} from "@/hooks/useLines"; // برای گرفتن لیست اعضا
import ContentFormFields from "./ContentFormFields";
import type {ContentCreateInput} from "@/types";

// اسکیمای اعتبارسنجی
const contentSchema = z.object({
    title: z.string().min(1, "عنوان الزامی است"),
    text: z.string().optional(),
    parent: z.string().optional(),
    member_ids: z.array(z.string()).min(1, "حداقل یک عضو را انتخاب کنید"),
    media_files: z.array(z.any()).optional(), // فایل‌های آپلودی
    audio_clip: z.any().optional(), // فایل صوتی (Blob)
});

type ContentFormValues = z.infer<typeof contentSchema>;

export default function ContentCreateForm() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const lineId = params.id;

    const createContent = useCreateContent();

    // دریافت لیست اعضای لاین برای پر کردن MultiSelect
    const {data: membersData} = useLineMembers(lineId);

    // --- اصلاح اینجا: چک کردن وجود نام و نام خانوادگی ---
    const membersOptions = membersData?.results.map((m: any) => {
        const fullName = `${m.user.first_name || ""} ${m.user.last_name || ""}`.trim();

        return {
            value: m.id.toString(),
            // اگر نام کامل خالی بود، یوزرنیم را نمایش بده
            label: fullName || `@${m.user.username}`,
        };
    }) || [];

    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<ContentFormValues>({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            title: "",
            text: "",
            member_ids: [],
            media_files: [],
            audio_clip: null,
        },
    });


    const onSubmit = async (values: ContentFormValues) => {
        const mediaPayload: ContentCreateInput['media'] = [];

        // اضافه کردن فایل‌های آپلودی
        if (values.media_files) {
            values.media_files.forEach((file: File) => {
                mediaPayload.push({file});
            });
        }

        // اضافه کردن فایل صوتی
        if (values.audio_clip) {
            const audioFile = new File([values.audio_clip], "voice-message.webm", {type: values.audio_clip.type});
            mediaPayload.push({file: audioFile});
        }

        const payload: ContentCreateInput = {
            line: lineId,
            title: values.title,
            text: values.text,
            parent: values.parent ? Number(values.parent) : undefined,
            member_ids: values.member_ids.map(Number),
            media: mediaPayload,
        };

        try {
            await createContent.mutateAsync(payload);
            router.back();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
            <ContentFormFields
                control={control}
                errors={errors}
                membersOptions={membersOptions}
            />

            {/* دکمه‌ها */}
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