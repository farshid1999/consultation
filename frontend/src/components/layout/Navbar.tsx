"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PiUserCircle } from "react-icons/pi";
import { navLinks } from "@/data/content";
import Button from "@/components/ui/Button";
import LinesNavDropdown from "@/components/ui/LinesNavDropdown";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // دریافت اطلاعات کاربر
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // تابع کمکی برای ساخت آواتار پیش‌فرض اگر عکس نداشت
  const renderAvatar = () => {
    if (user?.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.first_name}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/50 shadow-sm"
        />
      );
    }
    // SVG پیش‌فرض اگر آواتار نداشت
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-teal-500 text-cream shadow-sm ring-2 ring-gold/30">
        <PiUserCircle className="text-xl" />
      </div>
    );
  };

  return (
    <>
      {/* ── Desktop / Top Navbar ─────────────────────────────────────── */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-6"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 transition-all duration-500 md:px-8",
            scrolled
              ? "border border-cream/10 bg-deep/80 py-2.5 shadow-glass backdrop-blur-xl"
              : "border border-transparent bg-transparent py-1"
          )}
        >
          {/* Navigation + logo image — right side in RTL */}
          {/* اضافه کردن flex-nowrap برای اطمینان از افقی ماندن آیتم‌ها */}
          <nav
            className="hidden flex-nowrap items-center gap-6 lg:flex xl:gap-8"
            aria-label="ناوبری اصلی"
          >
            <img
              src="/logo.webp"
              alt="لوگو سفیران اوج آرامش"
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-gold/30 md:h-14 md:w-14"
            />
            {navLinks.map((link) =>
              link.id === "lines" ? (
                <LinesNavDropdown key={link.id} label={link.label} />
              ) : (
                <a
                  key={link.id}
                  href={link.href}
                  // اضافه کردن whitespace-nowrap برای جلوگیری از شکستن متن
                  className="relative whitespace-nowrap text-caption font-medium text-cream/70 transition-colors duration-300 hover:text-gold focus-visible:outline-none focus-visible:text-gold after:absolute after:-bottom-1.5 after:right-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Logo text */}
          <a href="#" className="flex shrink-0 items-center gap-2.5" aria-label="بازگشت به ابتدای صفحه">
            <span className="text-h3 font-extrabold text-cream">سفیران اوج آرامش</span>
          </a>

          {/* Action Area: Login or Profile */}
          <div className="relative shrink-0">
            {!user ? (
              // حالت لاگین نبودن
              <Link href="/login">
                <Button variant="primary" className="px-4 py-2 text-xs lg:px-6 lg:py-2.5 lg:text-sm">
                  ورود / ثبت‌نام
                </Button>
              </Link>
            ) : (
              // حالت لاگین بودن
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                className="group flex max-w-[200px] items-center gap-2 rounded-full bg-cream/5 px-2 py-1.5 pr-3 transition-all hover:bg-cream/10 focus:outline-none focus:ring-2 focus:ring-gold/50 md:max-w-none"
              >
                <div className="flex flex-col items-end leading-tight">
                  <span className="truncate text-sm font-bold text-gold">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="truncate text-[10px] text-cream/60 dir-ltr">
                    {user.phone_number || user.email}
                  </span>
                </div>
                {renderAvatar()}
              </button>
            )}

            {/* Dropdown Menu for Logged In User */}
            {isProfileOpen && user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 top-full mt-2 w-48 rounded-2xl border border-cream/10 bg-deep/95 p-2 shadow-xl backdrop-blur-xl"
              >
                <Link
                  href="/profile"
                  className="block rounded-xl px-4 py-2 text-sm text-cream/80 hover:bg-gold/10 hover:text-gold"
                >
                  پروفایل من
                </Link>
                <Link
                  href="/dashboard"
                  className="block rounded-xl px-4 py-2 text-sm text-cream/80 hover:bg-gold/10 hover:text-gold"
                >
                  داشبورد
                </Link>
                <button
                  onClick={() => {
                    // logic for logout
                    console.log("Logout");
                  }}
                  className="w-full rounded-xl px-4 py-2 text-right text-sm text-red-400 hover:bg-red-500/10"
                >
                  خروج
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Bottom Nav ────────────────────────────────────────── */}
      <nav
        dir="rtl"
        aria-label="ناوبری موبایل"
        className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-cream/10 bg-deep/90 backdrop-blur-xl"
      >
        <ul className="flex items-center justify-around px-1 py-2 pb-safe">
          {navLinks.slice(0, 4).map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className="flex items-center justify-center px-3 py-2 rounded-xl text-[11px] font-medium text-cream/55 hover:text-gold hover:bg-gold/[0.07] transition-all duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}