"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiUsers,
  FiGrid,
  FiLogOut,
  FiLayers,
  FiFileText,
  FiUserCheck,
  FiMessageSquare,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useAuth";
import { IoSettingsOutline } from "react-icons/io5";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: FiGrid },
  { href: "/admin/users", label: "کاربران", icon: FiUsers },
  { href: "/admin/staff", label: "کارمندان", icon: FiUserCheck },
  { href: "/admin/content", label: "محتواها", icon: FiFileText },
  { href: "/admin/line", label: "بخش‌ها", icon: FiLayers },
  { href: "/admin/assignments", label: "تکالیف", icon: FiLayers },
  { href: "/admin/contacts", label: "پشتیبانی", icon: FiMessageSquare },
  { href: "/admin/settings", label: "تنظیمات", icon: IoSettingsOutline },
  { href: "/admin/appointment", label: "رزرو ها", icon: FiUserCheck },
];

/** محتوای منو؛ هم در سایدبار دسکتاپ و هم در کشوی موبایل استفاده می‌شود */
function SidebarContent({
  onLogout,
  onClose,
}: {
  onLogout: () => void;
  /** فقط در موبایل: دکمه‌ی بستن کشو */
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-start justify-between border-b border-cream/10 px-6 py-6">
        <div>
          <p className="text-gold font-semibold text-sm">پنل مدیریت</p>
          <p className="text-cream/40 text-xs mt-0.5">سفیران اوج آرامش</p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            className="-mt-1 flex h-9 w-9 items-center justify-center rounded-xl text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          // «/admin» فقط دقیق؛ بقیه برای زیرصفحه‌ها هم فعال بمانند
          const isActive =
            href === "/admin"
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                isActive
                  ? "bg-gold/10 text-gold font-medium"
                  : "text-cream/50 hover:text-cream hover:bg-cream/5",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cream/10 px-3 py-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/50 transition-colors hover:bg-red-400/5 hover:text-red-400"
        >
          <FiLogOut size={16} />
          خروج
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout } = useLogout();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.replace("/login"),
    });
  };

  // با تغییر صفحه، کشو بسته شود
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // وقتی کشو بازه: اسکرول صفحه قفل شود، Escape ببندد، و با بزرگ‌شدن صفحه بسته شود
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      {/* ── موبایل: نوار بالایی با دکمه‌ی منو ───────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-cream/10 bg-deep/90 px-4 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="باز کردن منو"
          aria-expanded={open}
          aria-controls="admin-mobile-drawer"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-cream/70 transition-colors hover:bg-cream/5 hover:text-gold"
        >
          <FiMenu size={20} />
        </button>
        <p className="text-gold text-sm font-semibold">پنل مدیریت</p>
      </header>

      {/* ── موبایل: پس‌زمینه‌ی تیره پشت کشو ─────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* ── موبایل: کشوی منو (از سمت راست باز می‌شود) ───────────────── */}
      <aside
        id="admin-mobile-drawer"
        data-brand-sidebar
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-64 max-w-[85vw] flex-col border-l border-cream/10 bg-deep shadow-2xl transition-[transform,visibility] duration-300 md:hidden",
          open ? "visible translate-x-0" : "invisible translate-x-full",
        )}
      >
        <SidebarContent onLogout={handleLogout} onClose={() => setOpen(false)} />
      </aside>

      {/* ── دسکتاپ: سایدبار ثابت مثل قبل ────────────────────────────── */}
      <aside
        data-brand-sidebar
        className="hidden w-60 shrink-0 flex-col border-l border-cream/10 bg-cream/[0.03] md:sticky md:top-0 md:flex md:h-screen"
      >
        <SidebarContent onLogout={handleLogout} />
      </aside>
    </>
  );
}