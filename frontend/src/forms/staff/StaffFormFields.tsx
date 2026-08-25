"use client";

import { useState } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Input, Textarea, DatePicker, FileUploader, Switch } from "@/components/ui/inputs";
import FormSection from "./FormSection";
import AddressFields from "./AddressFields";
import ClubFields from "./ClubFields";
import InformationFieldArray from "./InformationFieldArray";

interface StaffFormFieldsProps {
  /**
   * `Control<any>` here for the same reason InformationFieldArray uses it:
   * this component is shared verbatim between the create form (required
   * password/hire_date) and the edit form (everything optional), which are
   * two different Zod schemas. Keeping one field-set component instead of
   * duplicating ~300 lines of JSX is worth the loosened typing at this one
   * boundary — every field path below still matches both schemas exactly.
   */
  control: Control<any>;
  errors: FieldErrors<any>;
  mode: "create" | "edit";
  /** Whether the address/club sections should start expanded (edit mode with existing data). */
  initialShowAddress?: boolean;
  initialShowClub?: boolean;
}

export default function StaffFormFields({
  control,
  mode,
  initialShowAddress = false,
  initialShowClub = false,
}: StaffFormFieldsProps) {
  const [showAddress, setShowAddress] = useState(initialShowAddress);
  const [showClub, setShowClub] = useState(initialShowClub);

  return (
    <div className="flex flex-col gap-6">
      {/* --- Staff-specific fields --- */}
      <FormSection title="اطلاعات استخدامی" description="مربوط به رکورد کارمند، نه حساب کاربری او">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="employee_code"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label="کد پرسنلی"
                required={mode === "create"}
                {...field}
                value={field.value ?? ""}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="position"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label="سمت"
                required={mode === "create"}
                {...field}
                value={field.value ?? ""}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="hire_date"
            control={control}
            render={({ field, fieldState }) => (
              <DatePicker
                label="تاریخ استخدام"
                required={mode === "create"}
                value={field.value ?? null}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </FormSection>

      {/* --- Account credentials --- */}
      <FormSection title="حساب کاربری" description="اطلاعات ورود کارمند به سامانه">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="user.username"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label="نام کاربری"
                required={mode === "create"}
                {...field}
                value={field.value ?? ""}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="user.password"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                type="password"
                label={mode === "create" ? "رمز عبور" : "رمز عبور جدید (اختیاری)"}
                required={mode === "create"}
                {...field}
                value={field.value ?? ""}
                error={fieldState.error?.message}
                helperText={mode === "edit" ? "خالی بگذارید تا تغییر نکند" : undefined}
              />
            )}
          />
          <Controller
            name="user.phone_number"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label="شماره موبایل"
                required={mode === "create"}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                {...field}
                value={field.value ?? ""}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="user.land_line"
            control={control}
            render={({ field, fieldState }) => (
              <Input label="تلفن ثابت" {...field} value={field.value ?? ""} error={fieldState.error?.message} />
            )}
          />
          <Controller
            name="user.email"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                type="email"
                label="ایمیل"
                {...field}
                value={field.value ?? ""}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </FormSection>

      {/* --- Personal info --- */}
      <FormSection title="اطلاعات شخصی">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="user.first_name"
            control={control}
            render={({ field, fieldState }) => (
              <Input label="نام" {...field} value={field.value ?? ""} error={fieldState.error?.message} />
            )}
          />
          <Controller
            name="user.last_name"
            control={control}
            render={({ field, fieldState }) => (
              <Input label="نام‌خانوادگی" {...field} value={field.value ?? ""} error={fieldState.error?.message} />
            )}
          />
          <Controller
            name="user.birth_date"
            control={control}
            render={({ field, fieldState }) => (
              <DatePicker
                label="تاریخ تولد"
                value={field.value ?? null}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="user.degree"
            control={control}
            render={({ field, fieldState }) => (
              <Input label="مدرک تحصیلی" {...field} value={field.value ?? ""} error={fieldState.error?.message} />
            )}
          />
          {/*<Controller*/}
          {/*  name="user.job"*/}
          {/*  control={control}*/}
          {/*  render={({ field, fieldState }) => (*/}
          {/*    <Input label="شغل" {...field} value={field.value ?? ""} error={fieldState.error?.message} />*/}
          {/*  )}*/}
          {/*/>*/}
          {/*<Controller*/}
          {/*  name="user.sport_discipline"*/}
          {/*  control={control}*/}
          {/*  render={({ field, fieldState }) => (*/}
          {/*    <Input label="رشته‌ی ورزشی" {...field} value={field.value ?? ""} error={fieldState.error?.message} />*/}
          {/*  )}*/}
          {/*/>*/}
          {/*<Controller*/}
          {/*  name="user.referral_code"*/}
          {/*  control={control}*/}
          {/*  render={({ field, fieldState }) => (*/}
          {/*    <Input label="کد معرف" {...field} value={field.value ?? ""} error={fieldState.error?.message} />*/}
          {/*  )}*/}
          {/*/>*/}
          {/*<Controller*/}
          {/*  name="user.is_student"*/}
          {/*  control={control}*/}
          {/*  render={({ field }) => (*/}
          {/*    <Switch*/}
          {/*      label="دانشجو است؟"*/}
          {/*      checked={Boolean(field.value)}*/}
          {/*      onChange={(e) => field.onChange(e.target.checked)}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*/>*/}
        </div>

        {/*<Controller*/}
        {/*  name="user.professional_background"*/}
        {/*  control={control}*/}
        {/*  render={({ field, fieldState }) => (*/}
        {/*    <Textarea*/}
        {/*      label="سوابق حرفه‌ای"*/}
        {/*      wrapperClassName="mt-4"*/}
        {/*      {...field}*/}
        {/*      value={field.value ?? ""}*/}
        {/*      error={fieldState.error?.message}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*/>*/}
        {/*<Controller*/}
        {/*  name="user.bio"*/}
        {/*  control={control}*/}
        {/*  render={({ field, fieldState }) => (*/}
        {/*    <Textarea*/}
        {/*      label="بیوگرافی"*/}
        {/*      showCounter*/}
        {/*      maxLength={500}*/}
        {/*      wrapperClassName="mt-4"*/}
        {/*      {...field}*/}
        {/*      value={field.value ?? ""}*/}
        {/*      error={fieldState.error?.message}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*/>*/}

        <Controller
          name="user.avatar"
          control={control}
          render={({ field }) => (
            <FileUploader
              label="تصویر پروفایل"
              wrapperClassName="mt-4"
              accept="image/*"
              multiple={false}
              maxFiles={1}
              maxSizeMB={5}
              value={field.value ? [field.value as File] : []}
              onChange={(files) => field.onChange(files[0] ?? null)}
            />
          )}
        />
      </FormSection>

      {/* --- Address (optional nested object) --- */}
      <FormSection
        title="آدرس"
        description="اختیاری — در صورت نیاز فعال کنید"
        action={
          <Switch checked={showAddress} onChange={(e) => setShowAddress(e.target.checked)} aria-label="فعال‌سازی آدرس" />
        }
      >
        {showAddress ? (
          <AddressFields control={control} name="user.address" />
        ) : (
          <p className="text-xs text-cream/35">آدرس ثبت نشده است.</p>
        )}
      </FormSection>

      {/* --- Club (optional nested object with its own required address) --- */}
      {/*<FormSection*/}
      {/*  title="عضویت باشگاه"*/}
      {/*  description="اختیاری — در صورت نیاز فعال کنید"*/}
      {/*  action={<Switch checked={showClub} onChange={(e) => setShowClub(e.target.checked)} aria-label="فعال‌سازی باشگاه" />}*/}
      {/*>*/}
      {/*  {showClub ? (*/}
      {/*    <ClubFields control={control} name="user.club" />*/}
      {/*  ) : (*/}
      {/*    <p className="text-xs text-cream/35">باشگاهی ثبت نشده است.</p>*/}
      {/*  )}*/}
      {/*</FormSection>*/}

      {/* --- Informations: the recursive "many" tree --- */}
      <FormSection
        title="اطلاعات تکمیلی"
        description="هر تعداد مورد دلخواه؛ هر مورد می‌تواند خودش زیرمجموعه‌های نامحدود داشته باشد"
      >
        <InformationFieldArray control={control} name="user.informations" />
      </FormSection>
    </div>
  );
}
