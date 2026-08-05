import ClientShell from "@/components/layout/ClientShell";
import HeroSection from "@/components/sections/Hero";
import EvolutionArc from "@/components/sections/Evolution";
import EngineeringMetrics from "@/components/sections/Metrics";
import NeuralSkills from "@/components/sections/NeuralSkills";
import ProjectsSection from "@/components/sections/Projects";
import EcosystemMapSection from "@/components/sections/EcosystemMap";
import ScoutBrainVisualizerSection from "@/components/sections/ScoutBrain";
import AliScriptPlaygroundSection from "@/components/sections/AliScriptPlayground";
import ArchitectureVisualizerSection from "@/components/sections/ArchitectureVisualizer";
import BattleScars from "@/components/sections/BattleScars";
import Services from "@/components/sections/Services";
import ContactSection from "@/components/sections/Contact";
import { BattleScarsSkeleton } from "@/components/sections/BattleScars/Skeleton";
import { GitHubStatsPanel } from "@/components/sections/Contact/GitHubStatsPanel";
import { InteractiveTourGuide } from "@/components/tour/InteractiveTourGuide";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden relative">
      <HeroSection />
      <EvolutionArc />
      <EngineeringMetrics />
      <NeuralSkills />
      <Suspense fallback={null}>
        <ProjectsSection />
      </Suspense>
      <EcosystemMapSection />
      <ScoutBrainVisualizerSection />
      <AliScriptPlaygroundSection />
      <ArchitectureVisualizerSection />
      <Suspense fallback={<BattleScarsSkeleton />}>
        <BattleScars />
      </Suspense>
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
      <InteractiveTourGuide />
    </main>
  );
}