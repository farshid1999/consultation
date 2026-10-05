"use client";

import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { FiChevronDown, FiDownload } from "react-icons/fi";
import { mediaUrl } from "@/utils/staffUtils";
import type { PublicInformation } from "@/types/publicStaff";

function Node({ info, depth }: { info: PublicInformation; depth: number }) {
  const [open, setOpen] = useState(depth === 0);
  const file = mediaUrl(info.file);
  const isImage = file ? /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(file) : false;
  const hasBody = Boolean(info.text?.trim() || file || info.children.length);

  return (
    <div className={depth > 0 ? "mr-3 border-r-2 border-gold/20 pr-4" : ""}>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-deep-2/40">
        <button
          type="button"
          onClick={() => hasBody && setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 p-4 text-right"
        >
          <span className="font-bold text-cream">{info.title}</span>
          {hasBody && (
            <FiChevronDown
              className={`shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {open && hasBody && (
          <div className="space-y-4 border-t border-white/5 p-4">
            {info.text?.trim() && (
              <div
                className="prose prose-invert max-w-none text-sm leading-8 text-cream/80"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(info.text) }}
              />
            )}

            {file &&
              (isImage ? (
                <a href={file} target="_blank" rel="noreferrer">
                  <img src={file} alt={info.title} className="max-h-72 rounded-xl border border-white/10 object-cover" />
                </a>
              ) : (
                <a
                  href={file}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 text-xs text-gold transition-colors hover:bg-gold/10"
                >
                  <FiDownload size={14} /> دانلود فایل
                </a>
              ))}

            {info.children.length > 0 && (
              <div className="space-y-3">
                {info.children.map((c) => (
                  <Node key={c.id} info={c} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InformationTree({ items }: { items: PublicInformation[] }) {
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <Node key={i.id} info={i} depth={0} />
      ))}
    </div>
  );
}