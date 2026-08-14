"use client";

import { forwardRef, useId, useRef, useState } from "react";
import type { DragEvent, MutableRefObject } from "react";
import { FiFile, FiUploadCloud, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import FieldWrapper, { describedBy } from "./FieldWrapper";

export interface FileUploaderProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
  value: File[];
  onChange: (files: File[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  /** e.g. "image/*", ".pdf,.docx". Passed straight to the native input's accept attribute. */
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  dropzoneText?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} بایت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} کیلوبایت`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} مگابایت`;
}

/**
 * A drag-and-drop file uploader with image thumbnail previews for image
 * files and a generic file icon for everything else. Fully controlled
 * (`value` / `onChange` over `File[]`), so it plugs into react-hook-form
 * via `Controller` just like MultiSelect. Validation (file count, size,
 * type) happens client-side before files are added and surfaces as a
 * local rejection message under the dropzone, independent of any
 * react-hook-form `error` passed in for the field itself.
 */
const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(function FileUploader(
  {
    id,
    label,
    error,
    helperText,
    required,
    wrapperClassName,
    className,
    value,
    onChange,
    onBlur,
    disabled,
    accept,
    multiple = true,
    maxFiles,
    maxSizeMB,
    dropzoneText = "فایل را بکشید و رها کنید یا کلیک کنید",
  },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rejection, setRejection] = useState<string | null>(null);

  const setRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = node;
  };

  const addFiles = (incoming: FileList | File[]) => {
    setRejection(null);
    const incomingArray = Array.from(incoming);
    const accepted: File[] = [];

    for (const file of incomingArray) {
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        setRejection(`حجم «${file.name}» بیش از ${maxSizeMB} مگابایت است`);
        continue;
      }
      accepted.push(file);
    }

    let next = multiple ? [...value, ...accepted] : accepted.slice(-1);

    if (maxFiles && next.length > maxFiles) {
      setRejection(`حداکثر ${maxFiles} فایل مجاز است`);
      next = next.slice(0, maxFiles);
    }

    onChange(next);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <FieldWrapper
      id={fieldId}
      label={label}
      required={required}
      error={error ?? rejection ?? undefined}
      helperText={helperText}
      className={wrapperClassName}
    >
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors duration-200",
          isDragging ? "border-gold/70 bg-gold/[0.06]" : "border-cream/15 hover:border-cream/25",
          (error || rejection) && "border-red-400/50",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <FiUploadCloud className={cn("text-2xl", isDragging ? "text-gold" : "text-cream/35")} aria-hidden="true" />
        <p className="text-sm text-cream/60">{dropzoneText}</p>
        {(accept || maxSizeMB) && (
          <p className="text-[0.7rem] text-cream/30">
            {accept && `فرمت مجاز: ${accept}`}
            {accept && maxSizeMB && " · "}
            {maxSizeMB && `حداکثر حجم: ${maxSizeMB} مگابایت`}
          </p>
        )}

        <input
          ref={setRef}
          id={fieldId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onBlur={onBlur}
          aria-describedby={describedBy(fieldId, error ?? rejection ?? undefined, helperText)}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {value.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {value.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const previewUrl = isImage ? URL.createObjectURL(file) : null;
            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-cream/10 bg-deep/40 px-3 py-2.5"
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream/[0.06] text-cream/40">
                    <FiFile aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0 flex-1 text-right">
                  <p className="truncate text-xs font-medium text-cream/80">{file.name}</p>
                  <p className="text-[0.7rem] text-cream/40">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`حذف ${file.name}`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-cream/40 transition-colors hover:bg-red-400/10 hover:text-red-400"
                >
                  <FiX aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </FieldWrapper>
  );
});

export default FileUploader;
