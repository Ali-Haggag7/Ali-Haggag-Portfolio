import Timeline from "@/components/magicui/timeline";
import Services from "@/components/magicui/services";
import Footer from "@/components/magicui/footer";
import { FloatingDock } from "@/components/magicui/floating-dock";
import Particles from "@/components/magicui/particles";
import HeroSection from "@/components/magicui/hero-section";
import BattleScars from "@/components/magicui/battle-scars";
import ProjectsSection from "@/components/projects-section";
import NeuralSkills from "@/components/NeuralSkills";
import { ModeToggle } from "@/components/mode-toggle";
import ContactSection from "@/components/magicui/ContactSection";

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
    </main>
  );
}