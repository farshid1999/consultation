"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PiBrainDuotone } from "react-icons/pi";
import { navLinks } from "@/data/content";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
        {/* Navigation — right side in RTL reading order */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="ناوبری اصلی">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="relative text-caption font-medium text-cream/70 transition-colors duration-300 hover:text-gold focus-visible:outline-none focus-visible:text-gold after:absolute after:-bottom-1.5 after:right-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Logo — visually anchored to the left */}
        <a href="#" className="flex items-center gap-2.5" aria-label="بازگشت به ابتدای صفحه">
          <span className="text-h3 font-extrabold text-cream">ذهن‌آورد</span>
          <PiBrainDuotone className="text-2xl text-gold" aria-hidden="true" />
        </a>

        <div className="hidden lg:block">
          <Button variant="primary" className="px-6 py-2.5 text-sm">
            رزرو جلسه
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
