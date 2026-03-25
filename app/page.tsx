import Timeline from "@/components/magicui/timeline";
import Services from "@/components/magicui/services";
import Globe from "@/components/magicui/globe";
import Footer from "@/components/magicui/footer";
import { FloatingDock } from "@/components/magicui/floating-dock";
import Particles from "@/components/magicui/particles";
import HeroSection from "@/components/magicui/hero-section";
import BattleScars from "@/components/magicui/battle-scars";
import ProjectsSection from "@/components/projects-section";
import NeuralSkills from "@/components/NeuralSkills";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden relative selection:bg-blue-500/30">

      {/* Background Particles */}
      <Particles />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <ModeToggle />
      </div>

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 4. Skills Section */}
      <NeuralSkills />

      {/* Projects Grid */}
      <ProjectsSection />

      {/* Battle Scars Section */}
      <BattleScars />

      {/* Timeline Section */}
      <Timeline />

      {/* Services Section */}
      <Services />

      {/* <Reviews /> 
        TODO: Uncomment this section when I get my first freelance client reviews on Upwork.
      */}

      {/* Global Connection Section - Masterclass UI */}
      <section id="contact" className="py-32 w-full relative overflow-hidden flex items-center justify-center">
        {/* Ambient glowing background behind the text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">

          {/* Left Side: Typography & Call to Action */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* Live Availability Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 text-sm font-semibold tracking-wide">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              Available for Remote Opportunities
            </div>

            <h2 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tighter mb-6 leading-[1.1]">
              Working <br />
              {/* Beautiful Gradient Text */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600">
                Worldwide.
              </span>
            </h2>

            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-medium">
              Based in Egypt 🇪🇬. Architecting high-performance MERN applications, real-time systems, and AI-driven solutions for clients across the globe. Distance is just a detail.
            </p>

            {/* Premium Animated Contact Button */}
            <a
              href="mailto:ali.haggag2005@gmail.com"
              className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-base font-bold text-background transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] active:scale-95"
            >
              <span>Let's Build Together</span>
              <div className="h-2 w-2 rounded-full bg-blue-500 transition-transform duration-300 group-hover:scale-150 group-hover:bg-cyan-400"></div>
            </a>
          </div>

          {/* Right Side: The Holographic Globe */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative mt-10 lg:mt-0">
            <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
              {/* Subtle back-light for the globe */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
              <Globe className="w-full h-full relative z-10" />
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating Dock */}
      <div className="fixed z-50 bottom-4 right-4 md:bottom-8 md:left-1/2 md:right-auto md:-translate-x-1/2">
        <FloatingDock />
      </div>

    </main>
  );
}