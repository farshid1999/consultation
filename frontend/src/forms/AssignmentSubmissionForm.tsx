"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentSubmissionSchema, type AssignmentSubmissionFormValues } from "@/schemas/assignment";
import { useCreateSubmission, useUpdateSubmission } from "@/hooks/useAssignment";
import { buildFormData, containsFile } from "@/services/api/formData";
import { FiPlus, FiTrash2, FiFile } from "react-icons/fi";
import { FileUploader } from "@/components/ui/Inputs"; // مسیر را بررسی کنید
import type { AssignmentSubmissionDetail } from "@/types/Assignment";

interface AssignmentSubmissionFormProps {
  assignmentId: string | number;
  mode?: "create" | "update";
  initialData?: AssignmentSubmissionDetail | null;
  onSuccess?: () => void;
}

export default function AssignmentSubmissionForm({
  assignmentId,
  mode = "create",
  initialData,
  onSuccess,
}: AssignmentSubmissionFormProps) {
  const { mutate: createSubmission, isPending: creating } = useCreateSubmission(assignmentId);
  const { mutate: updateSubmission, isPending: updating } = useUpdateSubmission(assignmentId);
  const isPending = creating || updating;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssignmentSubmissionFormValues>({
    resolver: zodResolver(assignmentSubmissionSchema),
    defaultValues: {
      media_items: initialData?.media_items?.map((item) => ({
        text: item.media.text || "",
        file: null,
      })) || [],
    },
  });

  const { fields: mediaFields, append, remove } = useFieldArray({
    control,
    name: "media_items",
  });

  const onSubmit = (data: AssignmentSubmissionFormValues) => {
    const payload = containsFile(data)
      ? buildFormData(data as Record<string, unknown>)
      : data;

    if (mode === "create") {
      createSubmission(payload as any, { onSuccess: () => onSuccess?.() });
    } else {
      updateSubmission(payload as any, { onSuccess: () => onSuccess?.() });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {mediaFields.length === 0 && (
        <div className="text-center py-8 border border-dashed border-cream/10 rounded-2xl">
          <p className="text-cream/40 text-sm mb-3">هنوز موردی اضافه نشده است</p>
          <button
            type="button"
            onClick={() => append({ text: "", file: null })}
            className="text-xs text-gold hover:text-gold/80 transition-colors font-medium"
          >
            + افزودن اولین مورد
          </button>
        </div>
      )}

      <div className="space-y-6">
        {mediaFields.map((f, index) => {
          const existingFile = initialData?.media_items?.[index]?.media.file;
          const existingFileName = existingFile ? existingFile.split("/").pop() : null;

          return (
            <div key={f.id} className="relative group">
              {/* دکمه حذف شناور */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute -top-2 -left-2 p-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100 z-10"
                title="حذف این مورد"
              >
                <FiTrash2 size={12} />
              </button>

              <div className="space-y-3">
                <textarea
                  placeholder="توضیحات یا متن پاسخ..."
                  rows={3}
                  className="w-full rounded-xl border border-cream/10 bg-deep/50 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 focus:bg-deep transition-all resize-none"
                  {...register(`media_items.${index}.text`)}
                />

                {mode === "update" && existingFileName && (
                  <div className="flex items-center gap-2 text-xs text-cream/50 bg-cream/5 p-2.5 rounded-lg border border-cream/5">
                    <FiFile size={14} className="text-gold/70" />
                    <span className="truncate max-w-[200px]">{existingFileName}</span>
                    <span className="text-cream/30 mr-auto">(برای تغییر، فایل جدید انتخاب کنید)</span>
                  </div>
                )}

                <Controller
                  control={control}
                  name={`media_items.${index}.file`}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FileUploader
                      label={existingFileName ? "تغییر فایل پیوست" : "افزودن فایل پیوست"}
                      value={value ? [value] : []}
                      onChange={(files) => onChange(files[0] ?? null)}
                      onBlur={onBlur}
                      multiple={false}
                      maxSizeMB={10}
                      dropzoneText="فایل را اینجا رها کنید یا کلیک کنید"
                    />
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>

      {mediaFields.length > 0 && (
        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => append({ text: "", file: null })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cream/10 text-cream/60 text-sm hover:text-cream hover:border-cream/30 transition-colors"
          >
            <FiPlus size={14} />
            افزودن مورد دیگر
          </button>
          
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-xl bg-gold py-2.5 text-sm font-semibold text-deep hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/10"
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-deep/30 border-t-deep"></span>
                در حال پردازش...
              </>
            ) : mode === "create" ? (
              "ثبت نهایی پاسخ"
            ) : (
              "ذخیره تغییرات"
            )}
          </button>
        </div>
      )}
    </form>
  );
}