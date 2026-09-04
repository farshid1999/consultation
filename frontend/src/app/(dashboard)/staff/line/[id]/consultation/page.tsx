"use client";

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import Link from "next/link";
import {FiArrowRight, FiSave, FiFileText, FiX, FiTrash2} from "react-icons/fi";
import {Input, Textarea, FileUploader} from "@/components/ui/inputs";
import FormSection from "@/forms/FormSection";
import {useConsultationForm, useSaveConsultationForm} from "@/hooks/useConsultation";

// اسکیمای اعتبارسنجی
const formSchema = z.object({
    title: z.string().min(1, "عنوان فرم الزامی است"),
    description: z.string().optional(),
    files: z.array(z.any()).optional(), // فایل‌های جدید
});

type FormValues = z.infer<typeof formSchema>;

// تابع تبدیل به FormData
function buildConsultationFormData(values: FormValues, keptFileIds: string[]): FormData {
    const formData = new FormData();
    formData.append("title", values.title);

    if (values.description) {
        formData.append("description", values.description);
    }

    // ارسال ID فایل‌هایی که باید نگه داشته شوند
    keptFileIds.forEach(id => {
        formData.append("existing_file_ids", id);
    });

    // افزودن فایل‌های جدید
    if (values.files && values.files.length > 0) {
        values.files.forEach((file) => {
            formData.append("files", file);
        });
    }

    return formData;
}

export default function ConsultationFormPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const lineId = params.id;

    // دریافت وضعیت فعلی فرم
    const {data: formData, isLoading, isError} = useConsultationForm(lineId);
    const saveForm = useSaveConsultationForm(lineId);

    const isEditMode = !!formData && !isError;

    // لیست ID فایل‌هایی که کاربر تصمیم گرفته نگه دارد (به صورت پیش‌فرض همه فایل‌های موجود)
    const [keptFileIds, setKeptFileIds] = useState<string[]>([]);

    const {control, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            files: [],
        },
    });

    // پر کردن فرم و تنظیم اولیه فایل‌های نگه‌داشته شده
    useEffect(() => {
        if (formData) {
            reset({
                title: formData.title,
                description: formData.description || "",
                files: [],
            });
            // تنظیم اولیه: همه فایل‌های موجود باید نگه داشته شوند مگر اینکه کاربر حذف کند
            setKeptFileIds(formData.forms.map(f => String(f.id)));
        }
    }, [formData, reset]);

    // تابع حذف یک فایل از لیست نگه‌داری
    const handleRemoveFile = (fileId: string) => {
        setKeptFileIds(prev => prev.filter(id => id !== fileId));
    };

    const onSubmit = async (values: FormValues) => {
        const fd = buildConsultationFormData(values, keptFileIds);

        await saveForm.mutateAsync({
            payload: fd,
            isEdit: isEditMode
        });
    };

    if (isLoading) {
        return (
            <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10 flex justify-center">
                <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block"></span>
            </main>
        );
    }

    return (
        <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10">

            {/* هدر */}
            <div className="mb-8 flex items-center justify-between border-b border-cream/10 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
                        <Link href="/staff/line" className="hover:text-gold transition-colors">بخش‌ها</Link>
                        <FiArrowRight size={12} className="rotate-180"/>
                        <span>فرم مشاوره</span>
                    </div>
                    <h1 className="page-title text-3xl font-extrabold text-cream">
                        {isEditMode ? "ویرایش فرم مشاوره" : "ایجاد فرم مشاوره جدید"}
                    </h1>
                    <h3>
                        {isEditMode && formData && (
                            <Link
                                href={`/staff/line/${params.id}/consultation/submisions/?consultationId=${formData.id}`}
                                className="flex items-center gap-2 text-sm text-gold hover:text-white transition-colors mr-auto"
                            >
                                <FiFileText size={16}/>
                                مشاهده پاسخ‌های دریافتی
                            </Link>
                        )}
                    </h3>
                </div>
            </div>

            {/* کارت اصلی فرم */}
            <div className="card p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-soft"/>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    <FormSection title="اطلاعات پایه" description="عنوان و توضیحات کلی فرم">
                        <Controller
                            name="title"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input label="عنوان فرم" required {...field} value={field.value ?? ""}
                                       error={fieldState.error?.message}/>
                            )}
                        />
                        <Controller
                            name="description"
                            control={control}
                            render={({field, fieldState}) => (
                                <Textarea label="توضیحات تکمیلی" wrapperClassName="mt-4" rows={4} {...field}
                                          value={field.value ?? ""} error={fieldState.error?.message}/>
                            )}
                        />
                    </FormSection>

                    <FormSection title="فایل‌های پیوست" description="مدیریت قراردادها و نمونه فرم‌ها">

                        {/* نمایش فایل‌های موجود در حالت ویرایش */}
                        {isEditMode && formData.forms.length > 0 && (
                            <div className="mb-6 space-y-3">
                                <p className="text-xs font-medium text-gold mb-2">فایل‌های موجود (برای حذف روی ضربدر
                                    کلیک کنید):</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {formData.forms.map((f) => {
                                        const isKept = keptFileIds.includes(String(f.id));
                                        return (
                                            <div
                                                key={f.id}
                                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                                    isKept
                                                        ? 'bg-deep-2/30 border-cream/10'
                                                        : 'bg-red-500/5 border-red-500/20 opacity-60'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <FiFileText size={16}
                                                                className={isKept ? "text-gold" : "text-gray-500"}/>
                                                    <a
                                                        href={f.file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-cream/70 hover:text-gold truncate"
                                                    >
                                                        مشاهده فایل
                                                    </a>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(String(f.id))}
                                                    className={`p-1.5 rounded-md transition-colors ${
                                                        isKept
                                                            ? 'text-cream/40 hover:bg-red-500/10 hover:text-red-400'
                                                            : 'text-red-400 bg-red-500/10'
                                                    }`}
                                                    title={isKept ? "حذف فایل" : "بازگردانی"}
                                                >
                                                    <FiX size={16}/>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* آپلود فایل جدید */}
                        <Controller
                            name="files"
                            control={control}
                            render={({field}) => (
                                <FileUploader
                                    label="افزودن فایل جدید"
                                    accept=".pdf,.doc,.docx,image/*"
                                    multiple
                                    maxFiles={5}
                                    maxSizeMB={10}
                                    value={field.value || []}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormSection>

                    {/* دکمه‌ها */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-cream/10">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-xl border border-cream/20 px-6 py-3 text-sm font-medium text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || saveForm.isPending}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-gold-soft to-gold px-8 py-3 text-sm font-bold text-deep shadow-gold transition-all hover:shadow-[0_10px_30px_-5px_rgba(201,162,77,0.4)] disabled:opacity-60"
                        >
                            <FiSave size={16}/>
                            {saveForm.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}