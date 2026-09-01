"use client";

import { Controller, useFieldArray, type Control, type FieldErrors } from "react-hook-form";
import { FiTrash2, FiPlus, FiCheckCircle, FiDownload, FiX } from "react-icons/fi";
import { Input, Textarea, FileUploader, MultiSelect, AudioRecorder } from "@/components/ui/inputs";
import FormSection from "@/forms/FormSection";
import type { MediaItem } from "@/types";

interface ContentFormFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  membersOptions: { value: string; label: string }[];
  mode?: "create" | "edit";
  existingMedia?: MediaItem[];
}

export default function ContentFormFields({
  control,
  errors,
  membersOptions,
  mode = "create",
  existingMedia = [],
}: ContentFormFieldsProps) {
  const {
    fields: audioFields,
    append: appendAudio,
    remove: removeAudio,
  } = useFieldArray({ control, name: "audio_clips" });

  return (
    <div className="flex flex-col gap-6">

      <FormSection title="اطلاعات اصلی" description="عنوان و متن محتوا">
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Input label="عنوان محتوا" required {...field} value={field.value ?? ""} error={fieldState.error?.message} />
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

      <FormSection title="رسانه‌ها" description="مدیریت فایل‌ها و پیام‌های صوتی">

        {/* --- فایل‌های موجود: مدیریت‌شان از طریق یک Controller واقعی روی
             existing_media_ids، نه با دستکاری داخلی react-hook-form
             (control._formValues / control._updateFormValues اصلاً APIهای
             رسمی RHF نیستند و کار نمی‌کردند) --- */}
        {mode === "edit" && existingMedia.length > 0 && (
          <Controller
            name="existing_media_ids"
            control={control}
            render={({ field }) => {
              const keptIds: string[] = field.value || [];
              const toggle = (id: string) => {
                field.onChange(
                  keptIds.includes(id)
                    ? keptIds.filter((mediaId) => mediaId !== id)
                    : [...keptIds, id]
                );
              };

              return (
                <div className="mb-6 space-y-3">
                  <p className="text-xs font-medium text-gold mb-2">فایل‌های ضمیمه فعلی:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {existingMedia.map((media) => {
                      const isKept = keptIds.includes(media.id);
                      return (
                        <div
                          key={media.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            isKept ? "bg-deep-2/30 border-cream/10" : "bg-red-500/5 border-red-500/20 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`h-8 w-8 rounded flex items-center justify-center ${isKept ? "bg-gold/10 text-gold" : "bg-gray-500/10 text-gray-500"}`}>
                              <FiCheckCircle size={16} />
                            </div>
                            <span className="text-sm text-cream/70 truncate">{media.text || "فایل ضمیمه"}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={media.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-md text-cream/40 hover:text-gold hover:bg-gold/10 transition-colors"
                              title="مشاهده/دانلود"
                            >
                              <FiDownload size={14} />
                            </a>

                            {isKept ? (
                              <button
                                type="button"
                                onClick={() => toggle(media.id)}
                                className="p-1.5 rounded-md text-cream/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="حذف از محتوا"
                              >
                                <FiX size={16} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => toggle(media.id)}
                                className="text-[10px] text-red-400 px-2 hover:text-cream/70"
                                title="بازگرداندن"
                              >
                                حذف شد — بازگردانی
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          />
        )}

        <Controller
          name="media_files"
          control={control}
          render={({ field }) => (
            <FileUploader
              label={mode === "edit" ? "افزودن فایل جدید" : "آپلود فایل"}
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
            <div key={audioField.id} className="flex items-start gap-2">
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
                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendAudio({ clip: null })}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gold/30 py-2.5 text-sm font-medium text-gold/80 transition-colors hover:border-gold/60 hover:text-gold mt-2"
          >
            <FiPlus size={14} /> افزودن پیام صوتی دیگر
          </button>
        </div>
      </FormSection>

      <FormSection title="گیرندگان محتوا" description="اعضایی که این محتوا را دریافت می‌کنند">
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