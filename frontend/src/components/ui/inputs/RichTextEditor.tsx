"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  BlockQuote,
  Undo,
} from "ckeditor5";
import faTranslations from "ckeditor5/translations/fa.js";
import "ckeditor5/ckeditor5.css";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  onBlur,
  error,
  className,
}: RichTextEditorProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} dir="rtl">
      {label && <label className="text-xs text-cream/60">{label}</label>}

      <div className={cn("rich-editor rounded-xl", error && "ring-1 ring-red-400/60")}>
        <CKEditor
          editor={ClassicEditor}
          data={value ?? ""}
          config={{
            licenseKey: "GPL",
            language: { ui: "fa", content: "fa" },
            translations: [faTranslations],
            plugins: [Essentials, Paragraph, Heading, Bold, Italic, Underline, Link, List, BlockQuote, Undo],
            toolbar: [
              "undo", "redo", "|",
              "heading", "|",
              "bold", "italic", "underline", "link", "|",
              "bulletedList", "numberedList", "blockQuote",
            ],
          }}
          onChange={(_, editor) => onChange(editor.getData())}
          onBlur={() => onBlur?.()}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}