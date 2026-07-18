import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  display: "swap",
});

const siteUrl = "https://zehnavard.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ذهن‌آورد | مشاوره‌ی تخصصی روان‌شناسی ورزشی",
  description:
    "پلتفرم تخصصی روان‌شناسی ورزشی برای ورزشکاران حرفه‌ای و آماتور؛ مدیریت اضطراب رقابتی، تقویت تمرکز و اعتمادبه‌نفس، و همراهی ذهنی تا روز مسابقه.",
  keywords: [
    "روان‌شناسی ورزشی",
    "مشاوره ورزشی",
    "اضطراب رقابتی",
    "تقویت تمرکز ورزشکاران",
    "روان‌شناس ورزشی",
  ],
  authors: [{ name: "ذهن‌آورد" }],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: siteUrl,
    siteName: "ذهن‌آورد",
    title: "ذهن‌آورد | مشاوره‌ی تخصصی روان‌شناسی ورزشی",
    description:
      "ذهنی که برای قهرمانی آماده می‌شود. مشاوره‌ی تخصصی روان‌شناسی ورزشی، متناسب با رشته و اهداف شما.",
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "ذهن‌آورد" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ذهن‌آورد | مشاوره‌ی تخصصی روان‌شناسی ورزشی",
    description: "ذهنی که برای قهرمانی آماده می‌شود.",
    images: ["/og-cover.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "ذهن‌آورد",
    description: "مشاوره‌ی تخصصی روان‌شناسی ورزشی برای ورزشکاران حرفه‌ای و آماتور",
    url: siteUrl,
    medicalSpecialty: "Sports Psychology",
    areaServed: "IR",
  };

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="font-vazir antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <QueryProvider>
          {children}
          <Toaster position="top-center" richColors dir="rtl" />
        </QueryProvider>
      </body>
    </html>
  );
}
