"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FiArrowRight,
  FiPlus,
  FiTrash2,
  FiSearch,
  FiCheck,
} from "react-icons/fi";
import { useCreateAssignment } from "@/hooks/useAssignment";
import { useLineMembers } from "@/hooks/useLines";
import { Input, FileUploader } from "@/components/ui/inputs";
import { buildFormData, containsFile } from "@/services/api/formData";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "عنوان الزامی است").max(255),
  description: z.string().optional(),
  member_ids: z.array(z.string()).min(1, "حداقل یک عضو انتخاب کنید"),
  media_items: z
    .array(
      z.object({
        text: z.string().optional(),
        file: z.instanceof(File).nullable().optional(),
      }),
    )
    .optional(),
});

type FormValues = z.infer<typeof schema>;

export default function StaffCreateAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const lineId = params.id as string;
  const listHref = `/staff/line/${lineId}/assignments`;

  const { mutate: createAssignment, isPending, error } = useCreateAssignment();

  const [memberSearch, setMemberSearch] = useState("");
  const { data: membersData, isLoading: membersLoading } = useLineMembers(
    lineId,
    memberSearch ? { search: memberSearch } : undefined,
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { member_ids: [], media_items: [] },
  });

  const {
    fields: mediaFields,
    append: appendMedia,
    remove: removeMedia,
  } = useFieldArray({ control, name: "media_items" });

  const selectedMembers = watch("member_ids") ?? [];

  const toggleMember = (id: string) => {
    setValue(
      "member_ids",
      selectedMembers.includes(id)
        ? selectedMembers.filter((m) => m !== id)
        : [...selectedMembers, id],
      { shouldValidate: true },
    );
  };

  const selectAll = () =>
    setValue(
      "member_ids",
      membersData?.results?.map((m) => String(m.id)) ?? [],
      { shouldValidate: true },
    );

  const clearAll = () => setValue("member_ids", []);

  const onSubmit = (data: FormValues) => {
    const payload = {
      line: lineId,
      title: data.title,
      description: data.description,
      member_ids: data.member_ids,
      media_items: data.media_items
        ?.filter((item) => item.text?.trim() || item.file)
        .map((item) => ({
          media: {
            text: item.text ?? "",
            file: item.file ?? null,
          },
        })),
    };

    const body = containsFile(payload)
      ? buildFormData(payload as Record<string, unknown>)
      : payload;

    createAssignment(body as any, {
      onSuccess: () => router.push(listHref),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={listHref}
          className="text-cream/40 hover:text-cream transition-colors"
        >
          <FiArrowRight size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-cream">ساخت تکلیف</h1>
          <p className="text-cream/40 text-sm mt-1">
            تکلیف جدید برای اعضای این بخش
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-8 max-w-3xl"
      >
        {/* ۱. اطلاعات تکلیف */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gold border-b border-cream/10 pb-2">
            ۱. اطلاعات تکلیف
          </h2>

          <Input
            label="عنوان"
            placeholder="عنوان تکلیف"
            required
            error={errors.title?.message}
            {...register("title")}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-cream/60">
              توضیحات
            </label>
            <textarea
              placeholder="توضیحات تکلیف..."
              rows={4}
              className="w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 resize-none"
              {...register("description")}
            />
          </div>
        </section>

        {/* ۲. انتخاب اعضا */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gold border-b border-cream/10 pb-2">
            ۲. انتخاب اعضا
            {errors.member_ids && (
              <span className="text-red-400 text-xs font-normal mr-2">
                {errors.member_ids.message}
              </span>
            )}
          </h2>

          <div className="relative">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30"
              size={14}
            />
            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="جستجوی عضو..."
              className="w-full rounded-xl border border-cream/10 bg-cream/5 py-2.5 pr-9 pl-4 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
            />
          </div>

          {membersLoading ? (
            <p className="text-cream/30 text-sm">در حال بارگذاری اعضا...</p>
          ) : membersData?.results?.length === 0 ? (
            <p className="text-cream/30 text-sm text-center py-4">
              عضوی یافت نشد
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-cream/40">
                <span>
                  {selectedMembers.length} نفر انتخاب شده از{" "}
                  {membersData?.results?.length}
                </span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="hover:text-gold transition-colors"
                  >
                    انتخاب همه
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="hover:text-red-400 transition-colors"
                  >
                    حذف همه
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {membersData?.results?.map((member) => {
                  const isSelected = selectedMembers.includes(String(member.id));
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMember(String(member.id))}
                      className={cn(
                        "text-right px-3 py-2.5 rounded-xl text-sm transition-colors border flex items-start justify-between gap-2",
                        isSelected
                          ? "border-gold/50 bg-gold/10 text-gold"
                          : "border-cream/10 text-cream/50 hover:text-cream hover:border-cream/20",
                      )}
                    >
                      <div>
                        <p className="font-medium text-xs">
                          {member.user.first_name && member.user.last_name
                            ? `${member.user.first_name} ${member.user.last_name}`
                            : member.user.username}
                        </p>
                        <p className="text-xs opacity-50">
                          @{member.user.username}
                        </p>
                      </div>
                      {isSelected && (
                        <FiCheck size={12} className="mt-0.5 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* ۳. فایل‌ها */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-cream/10 pb-2">
            <h2 className="text-sm font-semibold text-gold">
              ۳. فایل‌ها (اختیاری)
            </h2>
            <button
              type="button"
              onClick={() => appendMedia({ text: "", file: null })}
              className="flex items-center gap-1.5 text-xs text-cream/50 hover:text-gold transition-colors"
            >
              <FiPlus size={14} />
              افزودن آیتم
            </button>
          </div>

          {mediaFields.length === 0 && (
            <p className="text-cream/30 text-sm text-center py-3">
              فایلی اضافه نشده
            </p>
          )}

          {mediaFields.map((f, index) => (
            <div
              key={f.id}
              className="p-4 rounded-xl border border-cream/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-cream/40">آیتم {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="text-cream/30 hover:text-red-400 transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>

              <textarea
                placeholder="متن یا توضیح (اختیاری)..."
                rows={2}
                className="w-full rounded-xl border border-cream/10 bg-cream/5 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 resize-none"
                {...register(`media_items.${index}.text`)}
              />

              <Controller
                control={control}
                name={`media_items.${index}.file`}
                render={({ field: { value, onChange, onBlur } }) => (
                  <FileUploader
                    label="فایل"
                    value={value ? [value] : []}
                    onChange={(files) => onChange(files[0] ?? null)}
                    onBlur={onBlur}
                    multiple={false}
                    maxSizeMB={10}
                    dropzoneText="فایل را بکشید یا کلیک کنید"
                  />
                )}
              />
            </div>
          ))}
        </section>

        {error && (
          <p className="text-xs text-red-400">
            {(error as any)?.detail ?? "خطایی رخ داد."}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-gold text-deep text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isPending ? "در حال ذخیره..." : "ثبت تکلیف"}
          </button>
          <Link
            href={listHref}
            className="px-6 py-2.5 rounded-xl border border-cream/20 text-cream/60 text-sm hover:text-cream hover:border-cream/40 transition-colors"
          >
            انصراف
          </Link>
        </div>
      </form>
    </div>
  );
}