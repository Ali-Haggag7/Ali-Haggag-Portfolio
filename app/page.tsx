import ClientShell from "@/components/layout/ClientShell";
import HeroSection from "@/components/sections/Hero";
import NeuralSkills from "@/components/sections/NeuralSkills";
import ProjectsSection from "@/components/sections/Projects";
import BattleScars from "@/components/sections/BattleScars";
import Timeline from "@/components/sections/Timeline";
import Services from "@/components/sections/Services";
import ContactSection from "@/components/sections/Contact";
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden relative">
      <HeroSection />
      <NeuralSkills />
      <ProjectsSection />
      <Suspense fallback={<div className="h-20" />}>
        <BattleScars />
      </Suspense>
      <Timeline />
      <Services />
      <ContactSection />
      <ClientShell />
    </main>
  );
}