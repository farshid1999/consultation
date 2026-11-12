import type { Metadata } from "next";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import NeuralBackground from "@/components/background/NeuralBackground";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/layout/Footer";
import SectionDivider from "@/components/layout/SectionDivider";
import LangMain from "@/components/layout/LangMain";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { DEFAULT_LANG, LANG_COOKIE, isLang, messages, type Lang } from "@/locales";

const Partners = dynamic(() => import("@/components/sections/Partners"));

// Below-the-fold sections are lazy-loaded to keep the initial hero paint fast.
const WhySportsPsychology = dynamic(() => import("@/components/sections/WhySportsPsychology"));
const Services = dynamic(() => import("@/components/sections/Services"));
const Process = dynamic(() => import("@/components/sections/Process"));
const Benefits = dynamic(() => import("@/components/sections/Benefits"));
const Stats = dynamic(() => import("@/components/sections/Stats"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const CTA = dynamic(() => import("@/components/sections/CTA"));

const siteUrl = "https://zehnavard.com";

/** زبان از کوکی خوانده می‌شود تا HTML از همان اول به زبان درست رندر شود (بدون پرش) */
async function getLang(): Promise<Lang> {
    const value = (await cookies()).get(LANG_COOKIE)?.value;
    return isLang(value) ? value : DEFAULT_LANG;
}

export async function generateMetadata(): Promise<Metadata> {
    const lang = await getLang();
    const m = messages[lang].meta;

    return {
        title: {absolute: m.title},
        description: m.description,
        openGraph: {
            type: "website",
            locale: m.ogLocale,
            url: siteUrl,
            siteName: messages[lang].brand,
            title: m.title,
            description: m.ogDescription,
            images: [{url: "/og-cover.jpg", width: 1200, height: 630, alt: messages[lang].brand}],
        },
        twitter: {
            card: "summary_large_image",
            title: m.title,
            description: m.twitterDescription,
            images: ["/og-cover.jpg"],
        },
    };
}

export default async function HomePage() {
    const lang = await getLang();

    return (
        <LanguageProvider initialLang={lang}>
        <LangMain className="relative min-h-screen overflow-x-hidden bg-deep">
            <NeuralBackground/>
            <Navbar/>

            <div className="relative z-10">
                <Hero/>
                {/*<Partners*/}
                {/*    title="همراهان ما"*/}
                {/*    subtitle="مجموعه‌هایی که در مسیر رشد، کنار ما هستند"*/}
                {/*    items={[*/}
                {/*        {name: "روانشناسی", logo: "/ravan.jpg"},*/}
                {/*        {name: "موسقی تراپی", logo: "/music.jpg"},*/}
                {/*        {name: "پشتیبانی", logo: "/poshtiban.jpg"},*/}
                {/*        {name: "یوگبال", logo: "/yogbal.jpg"},*/}
                {/*        {name: "حقوقی", logo: "/hogh.jpg"},*/}
                {/*    ]}*/}
                {/*/>*/}
                <WhySportsPsychology/>

                <Services/>
                <Process/>
                <Stats/>

                <Testimonials/>
                <Benefits/>
                <FAQ/>
                <CTA/>
                {/*<SectionDivider />*/}
                <Footer/>
            </div>
        </LangMain>
        </LanguageProvider>
    );
}
