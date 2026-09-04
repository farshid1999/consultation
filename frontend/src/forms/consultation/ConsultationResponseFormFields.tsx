"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { FiFileText, FiDownload, FiX } from "react-icons/fi";
import { Input, Textarea, FileUploader } from "@/components/ui/inputs";
import FormSection from "@/forms/FormSection";
import type { ConsultationFormDetail } from "@/types";
import type { ResponseFormValues } from "@/schemas/consultation";

interface ConsultationResponseFormFieldsProps {
  control: Control<ResponseFormValues>;
  errors: FieldErrors<ResponseFormValues>;
  formDetails?: ConsultationFormDetail;
  mode?: "create" | "edit";
  existingFiles?: { id: string; file: string }[];
  keptFileIds?: string[];
  onToggleKeptFile?: (id: string) => void;
}

export default function ConsultationResponseFormFields({
  control,
  errors,
  formDetails,
  mode = "create",
  existingFiles = [],
  keptFileIds = [],
  onToggleKeptFile,
}: ConsultationResponseFormFieldsProps) {

  return (
    <div className="flex flex-col gap-6">

      {/* --- فایل‌های راهنما (نمونه‌فرمی که استاف ضمیمه کرده) --- */}
      {formDetails && formDetails.forms.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
            <FiFileText /> فایل‌های راهنما و نمونه فرم
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formDetails.forms.map((f) => (
              <a
                key={f.id}
                href={f.file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold transition-colors bg-deep-2/30 p-2 rounded-lg border border-cream/5"
              >
                <FiDownload size={14} />
                <span className="truncate">مشاهده فایل راهنما</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <FormSection title={mode === "edit" ? "ویرایش پاسخ شما" : "ثبت پاسخ شما"} description="لطفاً فرم را با دقت تکمیل نمایید">

        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              label="عنوان پاسخ"
              required
              {...field}
              value={field.value ?? ""}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Textarea
              label="متن کامل پاسخ"
              wrapperClassName="mt-4"
              rows={6}
              showCounter
              maxLength={2000}
              {...field}
              value={field.value ?? ""}
              error={fieldState.error?.message}
            />
          )}
        />

        {/* --- فایل‌های قبلاً ارسال‌شده (فقط در حالت ویرایش) --- */}
        {mode === "edit" && existingFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-xs font-medium text-gold">فایل‌های قبلاً ارسال‌شده (برای حذف روی ضربدر بزنید):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {existingFiles.map((f) => {
                const isKept = keptFileIds.includes(f.id);
                return (
                  <div
                    key={f.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isKept ? "bg-deep-2/30 border-cream/10" : "bg-red-500/5 border-red-500/20 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FiFileText size={16} className={isKept ? "text-gold" : "text-gray-500"} />
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
                      onClick={() => onToggleKeptFile?.(f.id)}
                      className={`p-1.5 rounded-md transition-colors ${
                        isKept
                          ? "text-cream/40 hover:bg-red-500/10 hover:text-red-400"
                          : "text-red-400 bg-red-500/10"
                      }`}
                      title={isKept ? "حذف فایل" : "بازگردانی"}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Controller
          name="files"
          control={control}
          render={({ field }) => (
            <div className="mt-6">
              <FileUploader
                label={mode === "edit" ? "افزودن فایل جدید" : "پیوست فایل‌های تکمیل شده"}
                accept=".pdf,.doc,.docx,image/*"
                multiple
                maxFiles={5}
                maxSizeMB={10}
                value={field.value || []}
                onChange={field.onChange}
              />
            </div>
          )}
        />

      </FormSection>

    </div>
  );
}