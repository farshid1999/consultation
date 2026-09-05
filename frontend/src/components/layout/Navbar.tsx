"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PiBrainDuotone } from "react-icons/pi";
import { navLinks } from "@/data/content";
import Button from "@/components/ui/Button";
import LinesNavDropdown from "@/components/ui/LinesNavDropdown";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <nav className="hidden items-center gap-8 lg:flex" aria-label="ناوبری اصلی">
            <img
              src="/logo.webp"
              alt="لوگو سفیران اوج آرامش"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-gold/30"
            />
            {navLinks.map((link) =>
              link.id === "lines" ? (
                <LinesNavDropdown key={link.id} label={link.label} />
              ) : (
                <a
                  key={link.id}
                  href={link.href}
                  className="relative text-caption font-medium text-cream/70 transition-colors duration-300 hover:text-gold focus-visible:outline-none focus-visible:text-gold after:absolute after:-bottom-1.5 after:right-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Logo text */}
          <a href="#" className="flex items-center gap-2.5" aria-label="بازگشت به ابتدای صفحه">
            <span className="text-h3 font-extrabold text-cream">سفیران اوج آرامش</span>
            {/* <PiBrainDuotone className="text-2xl text-gold" aria-hidden="true" /> */}
          </a>

          <div>
            <Button variant="primary" className="px-4 py-2 text-xs lg:px-6 lg:py-2.5 lg:text-sm">
              رزرو جلسه
            </Button>
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