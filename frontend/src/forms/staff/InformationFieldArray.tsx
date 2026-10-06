"use client";

  import {Controller, useController, useFieldArray, useWatch, type Control} from "react-hook-form";
import {FiPlus, FiTrash2, FiPaperclip} from "react-icons/fi";
import {Input, FileUploader} from "@/components/ui/inputs";
import {cn} from "@/lib/utils";
import {MEDIA_BASE_URL} from "@/lib/axios";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/ui/inputs/RichTextEditor"), {
    ssr: false,
    loading: () => <div className="h-40 animate-pulse rounded-xl bg-deep-2/40"/>,
});

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
function ExistingFile({control, name}: { control: Control<any>; name: string }) {
    const {field} = useController({control, name: `${name}.existing_file`});
    const newFile = useWatch({control, name: `${name}.file`});
    const existing = field.value as string | null | undefined;

    if (!existing || newFile) return null;

    const href = existing.startsWith("http") ? existing : `${MEDIA_BASE_URL}${existing}`;
    const isImage = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(existing);
    const fileName = decodeURIComponent(existing.split("?")[0].split("/").pop() ?? "فایل");

    return (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-gold/20 bg-gold/5 p-3">
            {isImage ? (
                <a href={href} target="_blank" rel="noreferrer" className="shrink-0">
                    <img src={href} alt="" className="h-16 w-16 rounded-lg object-cover"/>
                </a>
            ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <FiPaperclip size={22}/>
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-cream/80" dir="ltr">{fileName}</p>
                <a href={href} target="_blank" rel="noreferrer" className="text-[11px] text-gold hover:underline">
                    مشاهده / دانلود
                </a>
            </div>
            <button
                type="button"
                onClick={() => field.onChange(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cream/40 transition-colors hover:bg-red-400/10 hover:text-red-400"
                aria-label="حذف فایل فعلی"
                title="حذف فایل فعلی"
            >
                <FiTrash2 size={16}/>
            </button>
        </div>
    );
}

/**
 * Renders a repeatable list of Information nodes (title/text/file), each
 * of which can itself hold a nested repeatable list of child Information
 * nodes — matching InformationCreateSerializer's recursive
 * children-of-children create() logic exactly. Depth is capped at
 * MAX_DEPTH purely as a UI safety rail against runaway recursion; the
 * backend serializer itself has no such limit.
 */
export default function InformationFieldArray({control, name, depth = 0}: InformationFieldArrayProps) {
    const {fields, append, remove} = useFieldArray({control, name: name as never});
    const setValue = (n: string, v: any) =>
        control._formValues && (control as any)._subjects
            ? (control as any).register && undefined
            : undefined;

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
                                    <FiTrash2 aria-hidden="true"/>
                                </button>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <Controller
                                    name={`${itemName}.title`}
                                    control={control}
                                    render={({field: f, fieldState}) => (
                                        <Input label="عنوان" required {...f} value={f.value ?? ""}
                                               error={fieldState.error?.message}/>
                                    )}
                                />

                                <Controller
                                    name={`${itemName}.text`}
                                    control={control}
                                    render={({field: f, fieldState}) => (
                                        <RichTextEditor
                                            label="متن"
                                            className="mt-3"
                                            value={f.value ?? ""}
                                            onChange={f.onChange}
                                            onBlur={f.onBlur}
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>

                            <Controller
                                name={`${itemName}.file`}
                                control={control}
                                render={({field: f}) => (
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

                            <ExistingFile control={control} name={itemName}/>

                            {depth < MAX_DEPTH && (
                                <div className="mt-4">
                                    <p className="mb-2 text-xs text-cream/40">زیرمجموعه‌ها</p>
                                    <InformationFieldArray control={control} name={`${itemName}.children`}
                                                           depth={depth + 1}/>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => append({title: "", text: "", existing_file: null, file: null, children: []} as never)}
                className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-cream/20 px-4 py-2.5 text-xs font-medium text-cream/60 transition-colors hover:border-gold/40 hover:text-gold"
            >
                <FiPlus aria-hidden="true"/>
                {depth === 0 ? "افزودن اطلاعات جدید" : "افزودن زیرمجموعه"}
            </button>
        </div>
    );
}
