"use client";

import { EcosystemMap } from "./EcosystemMap";
import { FlowingGrid } from "@/components/ui/FlowingGrid";
import { DecryptedText } from "@/components/ui/DecryptedText";

export default function EcosystemMapSection() {
    return (
        <section id="ecosystem" className="relative w-full py-20 bg-transparent overflow-hidden">
            {/* React Bits 3D Perspective Flowing Grid */}
            <FlowingGrid className="opacity-20 dark:opacity-30" horizon={0.25} speed={0.35} gridColor="rgba(6, 182, 212, 0.25)" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto">
                    <p className="section-eyebrow mb-3">
                        <DecryptedText text="Interconnected Stack Universe" speed={30} sequential={true} animateOn="view" />
                    </p>
                    <h2 className="section-title text-4xl md:text-5xl mb-3">
                        Project &amp; Tech{" "}
                        <span className="accent-word-emerald">Ecosystem Map</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                        Hover or select any project or technology node to visualize cross-project architecture links and shared infrastructure hubs.
                    </p>
                </div>

                <EcosystemMap />
            </div>
        </section>
    );
}
