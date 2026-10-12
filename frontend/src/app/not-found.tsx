import Link from "next/link";
import { FiArrowRight, FiCompass } from "react-icons/fi";
import NeuralBackground from "@/components/background/NeuralBackground";

export const metadata = {
  title: "صفحه پیدا نشد",
};

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep px-6 text-cream"
    >
      <NeuralBackground />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold/20 bg-deep-2/40 backdrop-blur-md">
          <FiCompass size={36} className="text-gold" aria-hidden="true" />
        </div>

        <p className="bg-gradient-to-l from-gold to-gold-soft bg-clip-text text-7xl font-extrabold text-transparent md:text-8xl">
          ۴۰۴
        </p>

        <h1 className="mt-4 text-xl font-extrabold md:text-2xl">صفحه‌ای که دنبالش بودید پیدا نشد</h1>

        <p className="mt-3 text-sm leading-7 text-cream/50">
          ممکن است آدرس را اشتباه وارد کرده باشید، صفحه حذف شده باشد، یا به این بخش دسترسی نداشته باشید.
        </p>

        <div className="mt-6 h-[3px] w-16 rounded-full bg-gradient-to-l from-gold to-gold/10" />

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold px-6 py-3 text-sm font-bold text-deep transition-all hover:bg-gold/90"
        >
          <FiArrowRight size={14} aria-hidden="true" />
          بازگشت به صفحه‌ی اصلی
        </Link>
      </div>
    </main>
  );
}