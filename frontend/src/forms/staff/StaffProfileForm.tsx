"use client";

import {useState} from "react";
import {useForm, Controller, useFieldArray} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {FiSave, FiPlus, FiTrash2, FiUpload} from "react-icons/fi";
import {Input, Textarea, FileUploader} from "@/components/ui/inputs";
import FormSection from "@/forms/FormSection";
import {useUpdateStaffProfile} from "@/hooks/useStaff";
import type {StaffProfile} from "@/types";

// اسکیمای اعتبارسنجی
const profileSchema = z.object({
    phone_number: z.string().min(1, "شماره تماس الزامی است"),
    email: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")),
    national_id: z.string().optional(),
    land_line: z.string().optional(),
    degree: z.string().optional(),
    job: z.string().optional(),
    bio: z.string().optional(),
    birth_date: z.string().optional(),
    avatar: z.any().optional(),

    // آدرس
    address: z.object({
        country: z.string().optional(),
        province: z.string().optional(),
        city: z.string().optional(),
        street: z.string().optional(),
        postal_code: z.string().optional(),
        description: z.string().optional(),
    }).optional(),
    informations: z.array(z.object({
        id: z.number().optional(),
        title: z.string().min(1, "عنوان الزامی است"),
        text: z.string().optional(),
        file: z.any().optional(), // File | string(url) | null
    })).optional(),
});


type ProfileFormValues = z.infer<typeof profileSchema>;

interface StaffProfileFormProps {
    initialData: StaffProfile;
}

export default function StaffProfileForm({initialData}: StaffProfileFormProps) {
    const updateProfile = useUpdateStaffProfile();
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(initialData.avatar || null);

    const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            phone_number: initialData.phone_number,
            email: initialData.email || "",
            national_id: initialData.national_id || "",
            land_line: initialData.land_line || "",
            degree: initialData.degree || "",
            job: initialData.job || "",
            bio: initialData.bio || "",
            birth_date: initialData.birth_date || "",
            address: {
                country: initialData.address?.country ?? "",
                province: initialData.address?.province ?? "",
                city: initialData.address?.city ?? "",
                street: initialData.address?.street ?? "",
                postal_code: initialData.address?.postal_code ?? "",
                description: initialData.address?.description ?? "",
            },
            informations: (initialData.informations ?? []).map((i) => ({
                id: i.id, title: i.title, text: i.text ?? "", file: i.file ?? null,
            })),
        },
    });

    // مدیریت آرایه اطلاعات تکمیلی (مدارک)
    const {fields, append, remove} = useFieldArray({
        control,
        name: "informations",
    });

    const onSubmit = async (values: ProfileFormValues) => {
        const fd = new FormData();

        // فیلدهای ساده: همه را بفرست تا پاک‌کردن مقدار هم کار کند
        (["phone_number", "email", "national_id", "land_line",
            "degree", "job", "bio", "birth_date"] as const).forEach((k) => {
            fd.append(k, values[k] ?? "");
        });

        if (values.avatar instanceof File) fd.append("avatar", values.avatar);

        // آدرس: فقط اگر حداقل یک فیلد پر بود
        const addr = values.address;
        if (addr && Object.values(addr).some(Boolean)) {
            fd.append("address", JSON.stringify(addr));
        }

        // مدارک: JSON بدون فایل + فایل‌ها با کلید info_file_<index>
        const infos = values.informations ?? [];
        fd.append(
            "informations",
            JSON.stringify(infos.map(({id, title, text}) => ({id, title, text: text ?? ""}))),
        );
        infos.forEach((info, i) => {
            if (info.file instanceof File) fd.append(`info_file_${i}`, info.file);
        });

        await updateProfile.mutateAsync(fd);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* بخش 1: اطلاعات شخصی و تماس */}
            <FormSection title="اطلاعات شخصی" description="اطلاعات پایه و راه‌های ارتباطی">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller name="phone_number" control={control} render={({field, fieldState}) => (
                        <Input label="شماره موبایل" required {...field} error={fieldState.error?.message}/>
                    )}/>

                    <Controller name="email" control={control} render={({field, fieldState}) => (
                        <Input label="ایمیل" type="email" {...field} error={fieldState.error?.message}/>
                    )}/>

                    <Controller name="national_id" control={control} render={({field, fieldState}) => (
                        <Input label="کد ملی" {...field} error={fieldState.error?.message}/>
                    )}/>

                    <Controller name="birth_date" control={control} render={({field, fieldState}) => (
                        <Input label="تاریخ تولد" type="date" {...field} error={fieldState.error?.message}
                               className="dir-ltr"/>
                    )}/>
                </div>

                <div className="mt-6">
                    <Controller name="avatar" control={control} render={({field}) => (
                        <div className="flex items-center gap-4">
                            {previewAvatar && <img src={previewAvatar} alt="Preview"
                                                   className="w-16 h-16 rounded-full object-cover border border-gold/20"/>}
                            <FileUploader
                                label="تغییر تصویر پروفایل"
                                accept="image/*"
                                maxFiles={1}
                                value={field.value ? [field.value] : []}
                                onChange={(files) => {
                                    if (files[0]) {
                                        field.onChange(files[0]);
                                        setPreviewAvatar(URL.createObjectURL(files[0]));
                                    }
                                }}
                            />
                        </div>
                    )}/>
                </div>
            </FormSection>

            {/* بخش 2: اطلاعات شغلی و بیوگرافی */}
            <FormSection title="اطلاعات شغلی" description="سوابق تحصیلی و شغلی">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller name="degree" control={control} render={({field, fieldState}) => (
                        <Input label="مدرک تحصیلی" {...field} error={fieldState.error?.message}/>
                    )}/>
                    <Controller name="job" control={control} render={({field, fieldState}) => (
                        <Input label="عنوان شغلی" {...field} error={fieldState.error?.message}/>
                    )}/>
                </div>
                <Controller name="bio" control={control} render={({field, fieldState}) => (
                    <Textarea label="درباره من" wrapperClassName="mt-4" rows={4} {...field}
                              error={fieldState.error?.message}/>
                )}/>
            </FormSection>

            {/* بخش 3: آدرس */}
            <FormSection title="آدرس محل سکونت" description="آدرس دقیق پستی">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller name="address.country" control={control} render={({field}) => (
                        <Input label="کشور" {...field} />
                    )}/>
                    <Controller name="address.province" control={control} render={({field}) => (
                        <Input label="استان" {...field} />
                    )}/>
                    <Controller name="address.city" control={control} render={({field}) => (
                        <Input label="شهر" {...field} />
                    )}/>
                    <Controller name="address.postal_code" control={control} render={({field}) => (
                        <Input label="کد پستی" {...field} />
                    )}/>
                </div>
                <Controller name="address.street" control={control} render={({field}) => (
                    <Input label="خیابان و پلاک" wrapperClassName="mt-4" {...field} />
                )}/>
            </FormSection>

            {/* بخش 4: مدارک و اطلاعات تکمیلی (Dynamic) */}
            <FormSection title="مدارک و سوابق" description="افزودن مدارک معتبر یا سوابق کاری">
                <div className="space-y-4">
                    {fields.map((item, index) => (
                        <div key={item.id}
                             className="p-4 rounded-xl border border-cream/10 bg-deep-2/30 relative group">
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute left-4 top-4 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FiTrash2 size={18}/>
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name={`informations.${index}.title`}
                                    control={control}
                                    render={({field}) => <Input label="عنوان مدرک/سابقه" {...field} />}
                                />
                                <Controller
                                    name={`informations.${index}.file`}
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <FileUploader
                                                label="فایل ضمیمه"
                                                maxFiles={1}
                                                value={field.value instanceof File ? [field.value] : []}
                                                onChange={(files) => field.onChange(files[0] ?? null)}
                                            />
                                            {typeof field.value === "string" && field.value && (
                                                <a
                                                    href={field.value}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-1 inline-block text-xs text-gold"
                                                >
                                                    مشاهده فایل فعلی
                                                </a>
                                            )}
                                        </div>
                                    )}
                                />


                            </div>
                            <Controller
                                name={`informations.${index}.text`}
                                control={control}
                                render={({field}) => <Textarea label="توضیحات" wrapperClassName="mt-3"
                                                               rows={2} {...field} />}
                            />
                        </div>
                    ))}


                    <button
                        type="button"
                        onClick={() => append({title: "", text: "", file: null})}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-gold/30 text-gold hover:bg-gold/5 transition-colors"
                    >
                        <FiPlus size={16}/> افزودن مورد جدید
                    </button>
                </div>
            </FormSection>

            {/* دکمه ذخیره */}
            <div className="flex justify-end pt-6 border-t border-cream/10">
                <button
                    type="submit"
                    disabled={isSubmitting || updateProfile.isPending}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-gold-soft to-gold px-8 py-3 text-sm font-bold text-deep shadow-gold transition-opacity disabled:opacity-60"
                >
                    <FiSave size={16}/>
                    {updateProfile.isPending ? "در حال ذخیره..." : "ذخیره تمام تغییرات"}
                </button>
            </div>

        </form>
    );
}