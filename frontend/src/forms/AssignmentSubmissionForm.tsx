"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentSubmissionSchema, type AssignmentSubmissionFormValues } from "@/schemas/assignment";
import { useCreateSubmission, useUpdateSubmission } from "@/hooks/useAssignment";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface AssignmentSubmissionFormProps {
  assignmentId: number;
  mode?: "create" | "update";
  onSuccess?: () => void;
}

export default function AssignmentSubmissionForm({
  assignmentId,
  mode = "create",
  onSuccess,
}: AssignmentSubmissionFormProps) {
  const { mutate: createSubmission, isPending: creating } = useCreateSubmission(assignmentId);
  const { mutate: updateSubmission, isPending: updating } = useUpdateSubmission(assignmentId);
  const isPending = creating || updating;

  const {
    register: field,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssignmentSubmissionFormValues>({
    resolver: zodResolver(assignmentSubmissionSchema),
    defaultValues: { media_items: [] },
  });

  const { fields: mediaFields, append, remove } = useFieldArray({
    control,
    name: "media_items",
  });

  const onSubmit = (data: AssignmentSubmissionFormValues) => {
    if (mode === "create") {
      createSubmission(data, { onSuccess: () => onSuccess?.() });
    } else {
      updateSubmission(data, { onSuccess: () => onSuccess?.() });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gold">فایل‌های ارسالی</h2>
          <button
            type="button"
            onClick={() => append({ text: "" })}
            className="flex items-center gap-1.5 text-xs text-cream/50 hover:text-gold transition-colors"
          >
            <FiPlus size={14} />
            افزودن
          </button>
        </div>

        {mediaFields.length === 0 && (
          <p className="text-cream/30 text-sm text-center py-4">فایلی اضافه نشده</p>
        )}

        {mediaFields.map((f, index) => (
          <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl border border-cream/10">
            <textarea
              placeholder="متن یا توضیح..."
              rows={2}
              className="flex-1 bg-transparent text-sm text-cream placeholder:text-cream/30 focus:outline-none resize-none"
              {...field(`media_items.${index}.text`)}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-cream/30 hover:text-red-400 transition-colors shrink-0"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-deep hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {isPending ? "در حال ارسال..." : mode === "create" ? "ارسال تکلیف" : "ویرایش تکلیف"}
      </button>
    </form>
  );
}