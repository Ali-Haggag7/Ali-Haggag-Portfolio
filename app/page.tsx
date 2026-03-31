import ClientShell from "@/components/layout/ClientShell";
import HeroSection from "@/components/sections/Hero";
import NeuralSkills from "@/components/sections/NeuralSkills";
import ProjectsSection from "@/components/sections/Projects";
import BattleScars from "@/components/sections/BattleScars";
import Timeline from "@/components/sections/Timeline";
import Services from "@/components/sections/Services";
import ContactSection from "@/components/sections/Contact";
import { GitHubStatsPanel } from "@/components/sections/Contact/GitHubStatsPanel";
import { Suspense } from "react";

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
      <ContactSection
        statsPanel={
          <Suspense fallback={
            <div className="w-full flex flex-col gap-4 animate-pulse">
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 rounded-xl bg-muted/30" />
                ))}
              </div>
              <div className="h-24 rounded-xl bg-muted/30" />
              <div className="h-16 rounded-xl bg-muted/30" />
            </div>
          }>
            <GitHubStatsPanel />
          </Suspense>
        }
      />
      <ClientShell />
    </main>
  );
}