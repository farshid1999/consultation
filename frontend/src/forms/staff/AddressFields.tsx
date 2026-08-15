"use client";

import { Controller, type Control } from "react-hook-form";
import { Input } from "@/components/ui/inputs";

interface AddressFieldsProps {
  control: Control<any>;
  /** Dot-path to the address object, e.g. "user.address" or "user.club.address". */
  name: string;
}

/** Renders every AddressSerializer field, wired to `name.<field>` via Controller. */
export default function AddressFields({ control, name }: AddressFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Controller
        name={`${name}.country`}
        control={control}
        render={({ field, fieldState }) => (
          <Input label="کشور" required {...field} value={field.value ?? ""} error={fieldState.error?.message} />
        )}
      />
      <Controller
        name={`${name}.province`}
        control={control}
        render={({ field, fieldState }) => (
          <Input label="استان" required {...field} value={field.value ?? ""} error={fieldState.error?.message} />
        )}
      />
      <Controller
        name={`${name}.city`}
        control={control}
        render={({ field, fieldState }) => (
          <Input label="شهر" required {...field} value={field.value ?? ""} error={fieldState.error?.message} />
        )}
      />
      <Controller
        name={`${name}.postal_code`}
        control={control}
        render={({ field, fieldState }) => (
          <Input label="کد پستی" required {...field} value={field.value ?? ""} error={fieldState.error?.message} />
        )}
      />
      <Controller
        name={`${name}.street`}
        control={control}
        render={({ field, fieldState }) => (
          <Input
            label="خیابان / نشانی دقیق"
            required
            wrapperClassName="sm:col-span-2"
            {...field}
            value={field.value ?? ""}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name={`${name}.description`}
        control={control}
        render={({ field, fieldState }) => (
          <Input
            label="توضیحات آدرس (اختیاری)"
            wrapperClassName="sm:col-span-2"
            {...field}
            value={field.value ?? ""}
            error={fieldState.error?.message}
          />
        )}
      />
    </div>
  );
}
