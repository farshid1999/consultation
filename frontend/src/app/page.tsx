import dynamic from "next/dynamic";
import NeuralBackground from "@/components/background/NeuralBackground";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/layout/Footer";
import SectionDivider from "@/components/layout/SectionDivider";
import BackgroundAudioPlayer from "@/components/background/BackgroundAudioPlayer";

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

export default function HomePage() {
    return (
        <main className="relative min-h-screen overflow-x-hidden bg-deep">
            <NeuralBackground/>
            <Navbar/>

            <div className="relative z-10">
                <Hero/>
                <Partners
                    title="همراهان ما"
                    subtitle="مجموعه‌هایی که در مسیر رشد، کنار ما هستند"
                    items={[
                        {name: "روانشناسی", logo: "/ravan.jpg"},
                        {name: "موسقی تراپی", logo: "/music.jpg"},
                        {name: "پشتیبانی", logo: "/poshtiban.jpg"},
                        {name: "یوگبال", logo: "/yogbal.jpg"},
                    ]}
                />
                <WhySportsPsychology/>

                <Services/>
                <Process/>
                <Stats/>

                <Testimonials/>
                <Benefits/>
                <Stats/>
                <Testimonials/>
                <FAQ/>
                <CTA/>
                {/*<SectionDivider />*/}
                <Footer/>
            </div>
        </main>
    );
}
