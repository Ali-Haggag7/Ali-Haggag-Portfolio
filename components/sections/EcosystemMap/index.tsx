"use client";

import { useState, useCallback } from "react";
import {
    PROJECT_STATIONS,
    TECH_BRIDGES,
    type ProjectStation,
    type TechBridge,
    type FilterLens,
} from "./ecosystem.data";
import { EcosystemAtlas } from "./EcosystemAtlas";
import { EcosystemInspector } from "./EcosystemInspector";
import { MobileEcosystemExplorer } from "./MobileEcosystemExplorer";
import { DecryptedText } from "@/components/ui/DecryptedText";

export default function EcosystemMapSection() {
    // Current entity selected for inspection (project or tech bridge)
    const [selectedEntity, setSelectedEntity] = useState<
        | { type: "project"; data: ProjectStation }
        | { type: "tech"; data: TechBridge }
    >({
        type: "project",
        data: PROJECT_STATIONS[0], // Logic Arena default anchor
    });

    // Active exploration lens
    const [activeLens, setActiveLens] = useState<FilterLens>("all");

    // Select a project by ID
    const handleSelectProject = useCallback((projectId: string) => {
        const proj = PROJECT_STATIONS.find((p) => p.id === projectId);
        if (proj) {
            setSelectedEntity({ type: "project", data: proj });
        }
    }, []);

    // Select a technology by ID
    const handleSelectTech = useCallback((techId: string) => {
        const tech = TECH_BRIDGES.find((t) => t.id === techId);
        if (tech) {
            setSelectedEntity({ type: "tech", data: tech });
        }
    }, []);

    // Reset to overview (anchors on flagship system)
    const handleResetToOverview = useCallback(() => {
        setSelectedEntity({
            type: "project",
            data: PROJECT_STATIONS[0],
        });
        setActiveLens("all");
    }, []);

    return (
        <section
            id="ecosystem"
            className="relative w-full py-16 sm:py-20 bg-background overflow-hidden"
            aria-label="Engineering Ecosystem Atlas"
        >
            <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
                {/* ═══════════════════════════════════════════════════════════
                   SECTION HEADER: EDITORIAL & PRECISE
                   ═══════════════════════════════════════════════════════════ */}
                <div className="flex flex-col items-center text-center mb-8 sm:mb-12 max-w-3xl mx-auto space-y-2.5">
                    <p className="section-eyebrow">
                        <DecryptedText
                            text="Architecture Universe & Cross-Stack Topology"
                            speed={25}
                            sequential={true}
                            animateOn="view"
                        />
                    </p>
                    <h2 className="section-title text-3xl sm:text-4xl md:text-5xl tracking-tight">
                        Engineering{" "}
                        <span className="accent-word-emerald">Ecosystem Atlas</span>
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-sans">
                        An interactive instrument mapping cross-project dependencies, shared real-time
                        infrastructure hubs, and architectural pipelines across my core software systems.
                    </p>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                   DESKTOP EXPERIENCE: HIGH-PRECISION DUAL-BAY COCKPIT (>= lg)
                   Fits comfortably within ~1 viewport with zero long scrolling
                   ═══════════════════════════════════════════════════════════ */}
                <div className="hidden lg:grid grid-cols-12 gap-5 h-[640px] xl:h-[680px]">
                    {/* Left: Spatial Architecture Atlas & Highway Bus (7 cols) */}
                    <div className="col-span-7 xl:col-span-8 h-full min-h-0">
                        <EcosystemAtlas
                            selectedEntity={selectedEntity}
                            onSelectProject={handleSelectProject}
                            onSelectTech={handleSelectTech}
                            onResetToOverview={handleResetToOverview}
                            activeLens={activeLens}
                            onLensChange={setActiveLens}
                        />
                    </div>

                    {/* Right: Integrated Telemetry & Architectural Inspector (5 cols) */}
                    <div className="col-span-5 xl:col-span-4 h-full min-h-0">
                        <EcosystemInspector
                            selectedEntity={selectedEntity}
                            onSelectProject={handleSelectProject}
                            onSelectTech={handleSelectTech}
                        />
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                   MOBILE EXPERIENCE: PURPOSE-BUILT TOUCH EXPLORER (< lg)
                   No tiny unreadable canvas nodes; 100% thumb-friendly
                   ═══════════════════════════════════════════════════════════ */}
                <div className="block lg:hidden w-full">
                    <MobileEcosystemExplorer
                        selectedEntity={selectedEntity}
                        onSelectProject={handleSelectProject}
                        onSelectTech={handleSelectTech}
                    />
                </div>
            </div>
        </section>
    );
}
