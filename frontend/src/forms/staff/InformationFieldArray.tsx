"use client";

import { Controller, useFieldArray, type Control } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Input, FileUploader } from "@/components/ui/inputs";
import { cn } from "@/lib/utils";

interface InformationFieldArrayProps {
  /**
   * Typed `Control<any>` on purpose: this component recurses into its own
   * "children" field at unbounded depth, and react-hook-form's typed
   * `FieldArrayPath` inference can't express a self-referential structure
   * like informations[].children[].children[]... So the *outer* form
   * (StaffFormFields) stays fully typed against the Zod schema; only this
   * recursive boundary drops to a permissive type, which is the standard
   * escape hatch for this exact situation.
   */
  control: Control<any>;
  name: string;
  depth?: number;
}

const MAX_DEPTH = 4;

/**
 * Renders a repeatable list of Information nodes (title/text/file), each
 * of which can itself hold a nested repeatable list of child Information
 * nodes — matching InformationCreateSerializer's recursive
 * children-of-children create() logic exactly. Depth is capped at
 * MAX_DEPTH purely as a UI safety rail against runaway recursion; the
 * backend serializer itself has no such limit.
 */
export default function InformationFieldArray({ control, name, depth = 0 }: InformationFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({ control, name: name as never });

  return (
    <div className={cn(depth > 0 && "mr-2 border-r-2 border-gold/20 pr-4")}>
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => {
          const itemName = `${name}.${index}`;
          return (
            <div key={field.id} className="rounded-2xl border border-cream/10 bg-deep-2/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gold">
                  {depth === 0 ? `اطلاعات #${index + 1}` : `زیرمجموعه #${index + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="حذف این مورد"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-cream/40 transition-colors hover:bg-red-400/10 hover:text-red-400"
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Controller
                  name={`${itemName}.title`}
                  control={control}
                  render={({ field: f, fieldState }) => (
                    <Input label="عنوان" required {...f} value={f.value ?? ""} error={fieldState.error?.message} />
                  )}
                />
                <Controller
                  name={`${itemName}.text`}
                  control={control}
                  render={({ field: f, fieldState }) => (
                    <Input label="متن کوتاه" {...f} value={f.value ?? ""} error={fieldState.error?.message} />
                  )}
                />
              </div>

              <Controller
                name={`${itemName}.file`}
                control={control}
                render={({ field: f }) => (
                  <FileUploader
                    label="فایل پیوست (اختیاری)"
                    wrapperClassName="mt-3"
                    multiple={false}
                    maxFiles={1}
                    value={f.value ? [f.value as File] : []}
                    onChange={(files) => f.onChange(files[0] ?? null)}
                  />
                )}
              />

              {depth < MAX_DEPTH && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-cream/40">زیرمجموعه‌ها</p>
                  <InformationFieldArray control={control} name={`${itemName}.children`} depth={depth + 1} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append({ title: "", text: "", file: null, children: [] } as never)}
        className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-cream/20 px-4 py-2.5 text-xs font-medium text-cream/60 transition-colors hover:border-gold/40 hover:text-gold"
      >
        <FiPlus aria-hidden="true" />
        {depth === 0 ? "افزودن اطلاعات جدید" : "افزودن زیرمجموعه"}
      </button>
    </div>
  );
}
