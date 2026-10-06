"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
}

export default function RichTextEditor({
  label, value, onChange, onBlur, error, className,
}: RichTextEditorProps) {
  const [cfg, setCfg] = useState<typeof import("@/lib/ckeditor-config") | null>(null);

  useEffect(() => {
    import("@/lib/ckeditor-config").then(setCfg);
  }, []);

  if (!cfg) {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && <label className="text-xs text-cream/60">{label}</label>}
        <div className="h-32 rounded-xl bg-deep-2/30 border border-cream/10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)} dir="rtl">
      {label && <label className="text-xs text-cream/60">{label}</label>}

      <div className={cn("rich-editor rounded-xl overflow-hidden", error && "ring-1 ring-red-400/60")}>
        <CKEditor
          editor={cfg.ClassicEditor}
          data={value ?? ""}
          config={{
            licenseKey: "GPL",
            plugins: cfg.editorPlugins,
            translations: cfg.editorTranslations,
            language: { ui: "fa", content: "fa" },
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