"use client";

import { Controller, useFieldArray, type Control, type FieldErrors } from "react-hook-form";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { Input, Textarea, FileUploader, MultiSelect, AudioRecorder } from "@/components/ui/inputs";
import FormSection from "@/forms/FormSection";

interface ContentFormFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  membersOptions: { value: string; label: string }[];
}

export default function ContentFormFields({
  control,
  errors,
  membersOptions,
}: ContentFormFieldsProps) {
  const {
    fields: audioFields,
    append: appendAudio,
    remove: removeAudio,
  } = useFieldArray({ control, name: "audio_clips" });

  return (
    <div className="flex flex-col gap-6">

      {/* --- اطلاعات اصلی محتوا --- */}
      <FormSection title="اطلاعات اصلی" description="عنوان و متن محتوا">
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              label="عنوان محتوا"
              required
              {...field}
              value={field.value ?? ""}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="text"
          control={control}
          render={({ field, fieldState }) => (
            <Textarea
              label="متن توضیحات"
              wrapperClassName="mt-4"
              showCounter
              maxLength={1000}
              {...field}
              value={field.value ?? ""}
              error={fieldState.error?.message}
            />
          )}
        />
      </FormSection>

      {/* --- رسانه‌ها: فایل (many) + صدا (many) --- */}
      <FormSection
        title="رسانه‌ها"
        description="می‌توانید چند فایل و چند پیام صوتی اضافه کنید"
      >
        <Controller
          name="media_files"
          control={control}
          render={({ field }) => (
            <FileUploader
              label="آپلود فایل (تصویر، سند و...)"
              wrapperClassName="mb-6"
              accept="image/*,.pdf,.doc,.docx"
              multiple
              maxFiles={10}
              maxSizeMB={10}
              value={field.value || []}
              onChange={field.onChange}
            />
          )}
        />

        <div className="flex flex-col gap-3">
          {audioFields.map((audioField, index) => (
            <div key={audioField.id} className="flex items-center gap-2">
              <div className="flex-1">
                <Controller
                  name={`audio_clips.${index}.clip`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <AudioRecorder
                      label={`پیام صوتی ${index + 1}`}
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                      maxDurationSeconds={120}
                    />
                  )}
                />
              </div>
              <button
                type="button"
                onClick={() => removeAudio(index)}
                aria-label="حذف این صدا"
                className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendAudio({ clip: null })}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gold/30 py-2.5 text-sm font-medium text-gold/80 transition-colors hover:border-gold/60 hover:text-gold"
          >
            <FiPlus size={14} />
            افزودن پیام صوتی دیگر
          </button>
        </div>
      </FormSection>

      {/* --- انتخاب گیرندگان (Members) --- */}
      <FormSection
        title="گیرندگان محتوا"
        description="اعضایی که این محتوا را دریافت می‌کنند"
      >
        <Controller
          name="member_ids"
          control={control}
          render={({ field, fieldState }) => (
            <MultiSelect
              label="انتخاب اعضا"
              options={membersOptions}
              value={field.value || []}
              onChange={field.onChange}
              onBlur={field.onBlur}
              searchable
              placeholder="اعضا را جست‌وجو و انتخاب کنید..."
              error={fieldState.error?.message}
            />
          )}
        />
      </FormSection>

    </div>
  );
}