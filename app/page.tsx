import dynamic from "next/dynamic";
import { Suspense } from "react";
import ClientShell from "@/components/layout/ClientShell";
import HeroSection from "@/components/sections/Hero";
import EvolutionArc from "@/components/sections/Evolution";
import EngineeringMetrics from "@/components/sections/Metrics";
import NeuralSkills from "@/components/sections/NeuralSkills";
import { BattleScarsSkeleton } from "@/components/sections/BattleScars/Skeleton";

// Dynamic Code Splitting for heavy interactive sections to eliminate main-thread blocking time (TBT)
const ProjectsSection = dynamic(() => import("@/components/sections/Projects"), {
  loading: () => <div className="w-full min-h-[400px] flex items-center justify-center" />,
});
const EcosystemMapSection = dynamic(() => import("@/components/sections/EcosystemMap"), {
  loading: () => <div className="w-full min-h-[300px]" />,
});
const ScoutBrainVisualizerSection = dynamic(() => import("@/components/sections/ScoutBrain"), {
  loading: () => <div className="w-full min-h-[300px]" />,
});
const AliScriptPlaygroundSection = dynamic(() => import("@/components/sections/AliScriptPlayground"), {
  loading: () => <div className="w-full min-h-[400px]" />,
});
const ArchitectureVisualizerSection = dynamic(() => import("@/components/sections/ArchitectureVisualizer"), {
  loading: () => <div className="w-full min-h-[300px]" />,
});
const BattleScars = dynamic(() => import("@/components/sections/BattleScars"), {
  loading: () => <BattleScarsSkeleton />,
});
const Services = dynamic(() => import("@/components/sections/Services"), {
  loading: () => <div className="w-full min-h-[400px]" />,
});
const ContactSection = dynamic(() => import("@/components/sections/Contact"), {
  loading: () => <div className="w-full min-h-[300px]" />,
});
const GitHubStatsPanel = dynamic(() =>
  import("@/components/sections/Contact/GitHubStatsPanel").then((m) => m.GitHubStatsPanel)
);
const InteractiveTourGuide = dynamic(() =>
  import("@/components/tour/InteractiveTourGuide").then((m) => m.InteractiveTourGuide)
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-x-hidden">
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
          <Suspense
            fallback={
              <div className="w-full flex flex-col gap-4 animate-pulse">
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-muted/30" />
                  ))}
                </div>
                <div className="h-24 rounded-xl bg-muted/30" />
                <div className="h-16 rounded-xl bg-muted/30" />
              </div>
            }
          >
            <GitHubStatsPanel />
          </Suspense>
        }
      />
      <ClientShell />
      <InteractiveTourGuide />
    </main>
  );
}