import { FiInstagram, FiLinkedin, FiMail, FiPhone } from "react-icons/fi";
import { navLinks } from "@/data/content";

export default function Footer() {
  return (
    <footer dir="rtl" className="relative bg-deep px-6 pb-10 pt-4 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-t border-cream/10 pt-14 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.webp"
                alt="لوگو سفیران اوج آرامش"
                className="h-12 w-12 rounded-full object-cover ring-1 ring-gold/30"
              />
              <span className="text-h3 font-extrabold text-cream">سفیران اوج آرامش</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/50">
              مشاوره‌ی تخصصی روان‌شناسی ورزشی؛ همراه ورزشکاران حرفه‌ای و آماتور در مسیر رسیدن به
              بهترین نسخه‌ی ذهنی خودشان.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="اینستاگرام"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition-colors duration-300 hover:border-gold/50 hover:text-gold"
              >
                <FiInstagram aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="لینکدین"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition-colors duration-300 hover:border-gold/50 hover:text-gold"
              >
                <FiLinkedin aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-caption font-semibold text-gold">دسترسی سریع</p>
            <ul className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="text-sm text-cream/55 transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-caption font-semibold text-gold">ارتباط با ما</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-cream/55">
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-gold" aria-hidden="true" />
                ۰۲۱-۹۱۰۰۰۰۰۰
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-gold" aria-hidden="true" />
                info@serenityambassadors.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 md:flex-row">
          <p>© {new Date().getFullYear()} سفیران اوج آرامش. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}