"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
// اصلاح مسیرها به حروف کوچک و ایمپورت صحیح FormSection
import { Input, Textarea, FileUploader, MultiSelect, AudioRecorder } from "@/components/ui/inputs";
import type { LineMember } from "@/types";
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

  return (
    <div className="flex flex-col gap-6">

      {/* --- اطلاعات اصلی محتوا --- */}
      <FormSection title="اطلاعات اصلی" description="عنوان و متن محتوا">
        <div className="grid gap-4 sm:grid-cols-2">
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

          {/*<Controller*/}
          {/*  name="parent"*/}
          {/*  control={control}*/}
          {/*  render={({ field, fieldState }) => (*/}
          {/*    <Input*/}
          {/*      label="شناسه والد (اختیاری)"*/}
          {/*      type="number"*/}
          {/*      {...field}*/}
          {/*      value={field.value ?? ""}*/}
          {/*      error={fieldState.error?.message}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*/>*/}
        </div>

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

        {/* --- رسانه‌ها (فایل و صوت) --- */}
      <FormSection
        title="رسانه‌ها"
        description="فایل‌های ضمیمه و پیام‌های صوتی"
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
              maxFiles={5}
              maxSizeMB={10}
              value={field.value || []}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="audio_clip"
          control={control}
          render={({ field, fieldState }) => (
            <AudioRecorder
              label="ضبط پیام صوتی"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              maxDurationSeconds={120}
            />
          )}
        />
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