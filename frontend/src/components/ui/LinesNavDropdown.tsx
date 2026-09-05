"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiCornerDownLeft, FiLayers } from "react-icons/fi";
import { usePublicLines } from "@/hooks/useLines";

/* ------------------------------------------------------------------ */
/* ساخت درخت والد/فرزند از روی لیست فلتی که usePublicLines برمی‌گرداند */
/* ------------------------------------------------------------------ */
type RawLine = {
  id: string;
  title: string;
  descriptions?: string | null;
  parent: string | null;
};

type TreeLine = RawLine & { children: TreeLine[] };

function buildLineTree(rawLines: RawLine[]): TreeLine[] {
  const byId = new Map<string, TreeLine>();
  rawLines.forEach((raw) => byId.set(raw.id, { ...raw, children: [] }));

  const roots: TreeLine[] = [];

  rawLines.forEach((raw) => {
    const node = byId.get(raw.id)!;
    if (raw.parent && byId.has(raw.parent)) {
      byId.get(raw.parent)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

/* ------------------------------------------------------------------ */
/* یک ردیف از منو — بازگشتی، تا هر تعداد سطح زیرمجموعه که وجود داشته باشد */
/* ------------------------------------------------------------------ */
function LineNode({
  node,
  depth = 0,
  onNavigate,
}: {
  node: TreeLine;
  depth?: number;
  onNavigate: () => void;
}) {
  return (
    <div>
      <Link
        href={`/line/${node.id}`}
        onClick={onNavigate}
        className={`group flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-gold/10 hover:text-gold ${
          depth === 0 ? "text-sm font-bold text-cream/85" : "text-xs text-cream/55"
        }`}
      >
        {depth === 0 ? (
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/60 transition-colors group-hover:bg-gold" />
        ) : (
          <FiCornerDownLeft size={11} className="shrink-0 text-cream/25" />
        )}
        <span className="truncate">{node.title}</span>
      </Link>

      {node.children.length > 0 && (
        <div className="mr-3 mt-1 space-y-0.5 border-r border-cream/10 pr-3">
          {node.children.map((child) => (
            <LineNode key={child.id} node={child} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* خود دراپ‌داون — با هاور باز می‌شود                                   */
/* ------------------------------------------------------------------ */
export default function LinesNavDropdown({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: rawLines, isLoading } = usePublicLines();
  const tree = useMemo(() => buildLineTree((rawLines ?? []) as RawLine[]), [rawLines]);

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className="relative flex items-center gap-1 text-caption font-medium text-cream/70 transition-colors duration-300 after:absolute after:-bottom-1.5 after:right-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:text-gold hover:after:w-full focus-visible:text-gold focus-visible:outline-none"
      >
        {label}
        <FiChevronDown
          size={13}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-1/2 top-full z-50 mt-5 w-[22rem] max-w-[90vw] translate-x-1/2 rounded-3xl border border-cream/10 bg-deep/95 p-5 shadow-glass backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center gap-2 px-1 text-[11px] font-medium text-gold/70">
              <FiLayers size={13} />
              بخش‌های تخصصی
            </div>

            <div className="max-h-[24rem] space-y-1 overflow-y-auto pl-1 pr-1">
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-9 animate-pulse rounded-xl bg-cream/5" />
                ))}

              {!isLoading && tree.length === 0 && (
                <p className="px-2 py-4 text-center text-xs text-cream/40">
                  بخشی برای نمایش ثبت نشده است.
                </p>
              )}

              {!isLoading &&
                tree.map((root) => (
                  <LineNode key={root.id} node={root} onNavigate={() => setOpen(false)} />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}