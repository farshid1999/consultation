"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentCreateSchema, type AssignmentCreateFormValues } from "@/schemas/assignment";
import { useCreateAssignment } from "@/hooks/useAssignment";
import { Input, Textarea } from "@/components/ui/Inputs";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface AssignmentCreateFormProps {
  lineId: number;
  memberOptions: { id: number; label: string }[];
  onSuccess?: () => void;
}

export default function AssignmentCreateForm({ lineId, memberOptions, onSuccess }: AssignmentCreateFormProps) {
  const { mutate: createAssignment, isPending, error } = useCreateAssignment();

  const {
    register: field,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssignmentCreateFormValues>({
    resolver: zodResolver(assignmentCreateSchema),
    defaultValues: {
      line: lineId,
      member_ids: [],
      media_items: [],
    },
  });

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control,
    name: "media_items",
  });

  const selectedMembers = watch("member_ids") ?? [];

  const toggleMember = (id: number) => {
    const current = selectedMembers;
    if (current.includes(id)) {
      setValue("member_ids", current.filter((m) => m !== id));
    } else {
      setValue("member_ids", [...current, id]);
    }
  };

  const onSubmit = (data: AssignmentCreateFormValues) => {
    createAssignment(data, {
      onSuccess: () => onSuccess?.(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gold border-b border-cream/10 pb-2">اطلاعات تکلیف</h2>

        <Input
          label="عنوان"
          placeholder="عنوان تکلیف"
          required
          error={errors.title?.message}
          {...field("title")}
        />

        <div className="w-full space-y-1.5">
          <label className="block text-xs font-medium text-cream/60">توضیحات</label>
          <textarea
            placeholder="توضیحات تکلیف..."
            rows={4}
            className="w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 resize-none"
            {...field("description")}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gold border-b border-cream/10 pb-2">
          اعضا
          {errors.member_ids && (
            <span className="text-red-400 text-xs font-normal mr-2">{errors.member_ids.message}</span>
          )}
        </h2>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {memberOptions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMember(m.id)}
              className={`text-right px-3 py-2 rounded-xl text-sm transition-colors border ${
                selectedMembers.includes(m.id)
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-cream/10 text-cream/50 hover:text-cream hover:border-cream/20"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-cream/10 pb-2">
          <h2 className="text-sm font-semibold text-gold">فایل‌ها</h2>
          <button
            type="button"
            onClick={() => appendMedia({ media: { text: "" } })}
            className="flex items-center gap-1.5 text-xs text-cream/50 hover:text-gold transition-colors"
          >
            <FiPlus size={14} />
            افزودن فایل
          </button>
        </div>

        {mediaFields.map((f, index) => (
          <div key={f.id} className="flex items-start gap-3 p-3 rounded-xl border border-cream/10">
            <div className="flex-1 space-y-2">
              <Input
                placeholder="متن"
                size="sm"
                {...field(`media_items.${index}.media.text`)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeMedia(index)}
              className="text-cream/30 hover:text-red-400 transition-colors mt-2"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </section>

      {error && (
        <p className="text-xs text-red-400">
          {(error as any)?.detail ?? "خطایی رخ داد."}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gold py-3 text-sm font-semibold text-deep hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {isPending ? "در حال ذخیره..." : "ثبت تکلیف"}
      </button>
    </form>
  );
}