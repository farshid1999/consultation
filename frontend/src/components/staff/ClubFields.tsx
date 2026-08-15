"use client";

import { Controller, type Control } from "react-hook-form";
import { Input } from "@/components/ui/inputs";
import AddressFields from "./AddressFields";

interface ClubFieldsProps {
  control: Control<any>;
  /** Dot-path to the club object, e.g. "user.club". */
  name: string;
}

/** Renders ClubSerializer's fields — name plus its own required nested address. */
export default function ClubFields({ control, name }: ClubFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Controller
        name={`${name}.name`}
        control={control}
        render={({ field, fieldState }) => (
          <Input label="نام باشگاه" required {...field} value={field.value ?? ""} error={fieldState.error?.message} />
        )}
      />
      <div>
        <p className="mb-3 text-xs font-medium text-cream/50">آدرس باشگاه</p>
        <AddressFields control={control} name={`${name}.address`} />
      </div>
    </div>
  );
}
