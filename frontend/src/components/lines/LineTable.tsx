"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  FiEye,
  FiSearch,
  FiUsers,
  FiBriefcase,
  FiPlus,
  FiFileText,
  FiClipboard,
  FiMoreVertical,
  FiChevronDown,
  FiCornerDownLeft,
  FiFolder,
} from "react-icons/fi";
import { Input } from "@/components/ui/inputs";
import { useLines } from "@/hooks/useLines";

/* ------------------------------------------------------------------ */
/* ساخت درخت والد/فرزند از روی لیست فلتی که از API می‌آید               */
/* ------------------------------------------------------------------ */
type RawLine = {
  id: string;
  title: string;
  descriptions: string | null;
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
      // یا واقعا لاین ریشه است، یا والدش در همین دیتای دریافتی نیست
      roots.push(node);
    }
  });

  return roots;
}

// درخت را به یک لیست تخت از ردیف‌ها (به همراه عمق هرکدام) برای رندر در جدول تبدیل می‌کند
function flattenTree(
  nodes: TreeLine[],
  depth: number,
  collapsed: Set<string>,
  out: { node: TreeLine; depth: number }[] = []
) {
  nodes.forEach((node) => {
    out.push({ node, depth });
    if (node.children.length > 0 && !collapsed.has(node.id)) {
      flattenTree(node.children, depth + 1, collapsed, out);
    }
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* منوی عملیات — یک دکمه‌ی سه‌نقطه به‌جای شش آیکون جدا                  */
/* ------------------------------------------------------------------ */
function getLineActions(lineId: string) {
  return [
    {
      href: `/staff/line/${lineId}`,
      icon: FiEye,
      label: "مشاهده جزئیات",
      hint: "پروفایل کامل این بخش",
      accent: "text-blue-400",
    },
    {
      href: `/staff/line/${lineId}/members`,
      icon: FiUsers,
      label: "اعضای بخش",
      hint: "کاربران عادی این بخش",
      accent: "text-[#4ade80]",
    },
    {
      href: `/staff/line/${lineId}/staff`,
      icon: FiBriefcase,
      label: "کارمندان بخش",
      hint: "کارمندان رسمی این بخش",
      accent: "text-purple-400",
    },
    {
      href: `/staff/line/${lineId}/content/create`,
      icon: FiPlus,
      label: "ایجاد محتوا",
      hint: "افزودن محتوای جدید به این بخش",
      accent: "text-gold",
    },
    {
      href: `/staff/line/${lineId}/content`,
      icon: FiFileText,
      label: "آرشیو محتوا",
      hint: "محتواهای منتشرشده‌ی این بخش",
      accent: "text-blue-400",
    },
    {
      href: `/staff/line/${lineId}/consultation`,
      icon: FiClipboard,
      label: "فرم‌ها و قراردادها",
      hint: "مدیریت فرم‌های مشاوره",
      accent: "text-purple-400",
    },
  ];
}

function LineActionsMenu({ lineId }: { lineId: string }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<
    { top: number; left: number; maxHeight: number } | null
  >(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const MENU_WIDTH = 256; // معادل w-64
  const ITEM_HEIGHT = 58; // ارتفاع تقریبی هر گزینه، برای تصمیم‌گیری جهت باز شدن
  const VIEWPORT_MARGIN = 16;

  function updatePosition() {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const itemsCount = getLineActions(lineId).length;
    const estimatedHeight = itemsCount * ITEM_HEIGHT + 8;

    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - VIEWPORT_MARGIN;

    // اگر پایین صفحه جا کافی برای کل منو نیست ولی بالا جای بیشتری هست، رو به بالا باز شود
    const openUpward = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
    const availableSpace = openUpward ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(160, Math.min(estimatedHeight, availableSpace));

    let left = rect.left + rect.width / 2 - MENU_WIDTH / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - MENU_WIDTH - 12));

    const top = openUpward
      ? Math.max(VIEWPORT_MARGIN, rect.top - maxHeight - 8)
      : rect.bottom + 8;

    setPosition({ top, left, maxHeight });
  }

  useEffect(() => {
    if (!open) return;

    updatePosition();

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    // با اسکرول یا تغییر اندازه، موقعیت و جهت منو باید دوباره محاسبه شود
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="عملیات بیشتر"
        className={`flex h-9 w-9 items-center justify-center rounded-full text-cream/50 transition-colors hover:bg-white/5 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${
          open ? "bg-white/5 text-gold" : ""
        }`}
      >
        <FiMoreVertical size={18} />
      </button>

      {open &&
        position &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: MENU_WIDTH,
              maxHeight: position.maxHeight,
            }}
            className="z-[100] overflow-y-auto overscroll-contain rounded-2xl border border-cream/10 bg-[#123832] py-1 shadow-2xl shadow-black/40"
          >
            {getLineActions(lineId).map((action) => (
              <Link
                key={action.href}
                href={action.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-white/5"
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ${action.accent}`}
                >
                  <action.icon size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-cream">{action.label}</span>
                  <span className="block text-xs text-cream/45">{action.hint}</span>
                </span>
              </Link>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* جدول اصلی                                                           */
/* ------------------------------------------------------------------ */
export default function LineTable() {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const { data: rawLines, isLoading, isError } = useLines({ search: search || undefined });

  const rows = useMemo(() => {
    const tree = buildLineTree((rawLines ?? []) as RawLine[]);
    return flattenTree(tree, 0, collapsed);
  }, [rawLines, collapsed]);

  function toggleCollapse(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* هدر جستجو با استایل کارت تیره */}
      <div className="toolbar-card flex items-center justify-between p-4">
        <div className="w-full max-w-xs">
          <Input
            placeholder="جست‌وجوی عنوان بخش..."
            leftIcon={<FiSearch />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* جدول با استایل تاریک */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-cream/10 bg-deep-2/50 text-xs font-medium text-cream/40">
                <th className="w-2/5 px-5 py-4">عنوان بخش</th>
                <th className="px-5 py-4">توضیحات</th>
                <th className="w-32 px-5 py-4 text-center">وضعیت</th>
                <th className="w-16 px-5 py-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/5">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-cream/40">
                    <span className="spinner-brand inline-block h-6 w-6 animate-spin rounded-full border-2" />
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-red-400">
                    دریافت اطلاعات با خطا مواجه شد.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-cream/40">
                    هیچ بخشی یافت نشد.
                  </td>
                </tr>
              )}

              {rows.map(({ node, depth }) => {
                const hasChildren = node.children.length > 0;
                const isCollapsed = collapsed.has(node.id);
                const isChild = depth > 0;

                return (
                  <tr
                    key={node.id}
                    className={`table-row-brand group transition-colors ${
                      isChild ? "bg-white/[0.015]" : ""
                    }`}
                  >
                    {/* عنوان با تورفتگی بر اساس عمق، برای نشان دادن سلسله‌مراتب */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2" style={{ paddingRight: depth * 24 }}>
                        {hasChildren ? (
                          <button
                            onClick={() => toggleCollapse(node.id)}
                            aria-label={isCollapsed ? "نمایش زیرمجموعه‌ها" : "پنهان کردن زیرمجموعه‌ها"}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-cream/40 transition-colors hover:bg-white/5 hover:text-gold"
                          >
                            <FiChevronDown
                              size={14}
                              className={`transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                            />
                          </button>
                        ) : (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center text-cream/20">
                            {isChild ? <FiCornerDownLeft size={13} /> : <FiFolder size={14} />}
                          </span>
                        )}

                        <span className={`font-bold ${isChild ? "text-cream/80" : "text-cream"}`}>
                          {node.title}
                        </span>

                        {hasChildren && (
                          <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[11px] font-medium text-gold">
                            {node.children.length}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* توضیحات */}
                    <td className="px-5 py-3.5 text-cream/70">
                      {node.descriptions ? (
                        <span className="line-clamp-1">{node.descriptions}</span>
                      ) : (
                        <span className="text-cream/30">—</span>
                      )}
                    </td>

                    {/* وضعیت */}
                    <td className="px-5 py-3.5 text-center">
                      {isChild ? (
                        <span className="badge-gold">زیرمجموعه</span>
                      ) : (
                        <span className="badge-green">ریشه</span>
                      )}
                    </td>

                    {/* عملیات */}
                    <td className="px-5 py-3.5 text-center">
                      <LineActionsMenu lineId={node.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}