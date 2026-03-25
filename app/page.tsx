import Particles from "@/components/ui/particles";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { FloatingDock } from "@/components/layout/floating-dock";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/layout/Chatbot";

import HeroSection from "@/components/sections/Hero";
import NeuralSkills from "@/components/sections/NeuralSkills";
import ProjectsSection from "@/components/sections/Projects";
import BattleScars from "@/components/sections/BattleScars";
import Timeline from "@/components/sections/Timeline";
import Services from "@/components/sections/Services";
import ContactSection from "@/components/sections/Contact";
// import Reviews from "@/components/sections/Reviews";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden relative selection:bg-blue-500/30">
      <Particles />
      <ModeToggle />

      <HeroSection />
      <NeuralSkills />
      <ProjectsSection />
      <BattleScars />
      <Timeline />
      <Services />

      {/* <Reviews /> 
        TODO: Uncomment this section when I get my first freelance client reviews.
      */}

      <ContactSection />
      <Footer />

      <FloatingDock />
      <Chatbot />
    </main>
  );
}