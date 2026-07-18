import dynamic from "next/dynamic";
import NeuralBackground from "@/components/background/NeuralBackground";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/layout/Footer";
import SectionDivider from "@/components/layout/SectionDivider";

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
      <NeuralBackground />
      <Navbar />

      <div className="relative z-10">
        <Hero />
        <WhySportsPsychology />
        <Services />
        <Process />
        <Benefits />
        <Stats />
        <Testimonials />
        <FAQ />
        <CTA />
        <SectionDivider />
        <Footer />
      </div>
    </main>
  );
}
