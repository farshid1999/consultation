import Image from "next/image";

type Props = {
  /** آدرس لوگو (مثلاً /partners/a.webp) */
  logo: string;
  /** نام نمایش‌داده‌شده زیر لوگو */
  name: string;
  /** لینک اختیاری؛ اگر بدهی کارت کلیک‌پذیر می‌شود */
  href?: string;
};

export default function LogoCard({ logo, name, href }: Props) {
  const content = (
    <div className="group flex h-full flex-col items-center gap-4 rounded-3xl border border-white/10 bg-deep-2/40 p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/10">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gold/20 bg-white/5 p-3 ring-1 ring-gold/10 transition-transform duration-500 group-hover:scale-105 md:h-28 md:w-28">
        <Image
          src={logo}
          alt={name}
          fill
          sizes="112px"
          className="object-contain p-2"
        />
      </div>
      <h3 className="text-sm font-bold leading-6 text-cream md:text-base">{name}</h3>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {content}
    </a>
  ) : (
    content
  );
}