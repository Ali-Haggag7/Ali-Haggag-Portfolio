"use client";

import { useState, useCallback, useEffect } from "react";
import { COGNITIVE_STEPS, type CognitiveStep } from "./scoutData";
import { ScoutPipelineSVG } from "./ScoutPipelineSVG";
import { ScoutInspector } from "./ScoutInspector";
import { EthicalShields } from "./EthicalShields";
import { Hyperspeed } from "@/components/ui/Hyperspeed";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { DecryptedText } from "@/components/ui/DecryptedText";

export default function ScoutBrainVisualizerSection() {
    const [activeStepId, setActiveStepId] = useState<CognitiveStep["id"]>("observe");
    const [isAutoLooping, setIsAutoLooping] = useState(true);

    const activeStep = COGNITIVE_STEPS.find((s) => s.id === activeStepId) || COGNITIVE_STEPS[0];

    const handleSelectStep = useCallback((id: CognitiveStep["id"]) => {
        setActiveStepId(id);
        setIsAutoLooping(false); // User took control
    }, []);

    // Auto cycle through steps every 4 seconds unless user interacted
    useEffect(() => {
        if (!isAutoLooping) return;

        const timer = setInterval(() => {
            setActiveStepId((currentId) => {
                const idx = COGNITIVE_STEPS.findIndex((s) => s.id === currentId);
                const nextIdx = (idx + 1) % COGNITIVE_STEPS.length;
                return COGNITIVE_STEPS[nextIdx].id;
            });
        }, 4000);

        return () => clearInterval(timer);
    }, [isAutoLooping]);

    return (
        <section id="scout-brain" className="relative w-full py-20 bg-transparent z-0 overflow-hidden">
            {/* React Bits Hyperspeed 3D Warp Field Background */}
            <Hyperspeed className="opacity-25 dark:opacity-35" speed={0.9} starCount={80} />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto">
                    <p className="section-eyebrow mb-3">
                        <DecryptedText text="Graduation Project Architecture" speed={30} sequential={true} animateOn="view" />
                    </p>
                    <h2 className="section-title text-4xl md:text-5xl mb-3">
                        Scout{" "}
                        <span className="accent-word">Cognitive Brain Loop</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                        Watch how Ali engineered Scout&apos;s crash-safe 5-stage cognitive architecture — main-thread reasoning with Playwright worker_threads isolation.
                    </p>
                </div>

                {/* Main Visualizer Grid */}
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Pipeline SVG with BorderBeam */}
                    <div className="relative rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm overflow-hidden">
                        <BorderBeam duration={10} borderWidth={1.5} colorFrom="hsl(var(--accent-purple))" colorTo="hsl(var(--accent-blue))" />
                        <ScoutPipelineSVG activeStepId={activeStepId} onSelectStep={handleSelectStep} />
                    </div>

                    {/* Step Inspector Panel */}
                    <ScoutInspector step={activeStep} />

                    {/* Ethical Shields */}
                    <EthicalShields />
                </div>
            </div>
        </section>
    );
}
