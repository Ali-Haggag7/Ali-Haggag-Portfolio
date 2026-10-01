"use client";

import { useState, useCallback } from "react";
import {
    ARCHITECTURE_MAPS,
    type ArchitectureMap,
} from "./architectureData";
import { SystemSpecimenSwitcher } from "./SystemSpecimenSwitcher";
import { ArchitectureForensicCanvas } from "./ArchitectureForensicCanvas";
import { ForensicDossierInspector } from "./ForensicDossierInspector";
import { MobileSystemForensics } from "./MobileSystemForensics";
import { DecryptedText } from "@/components/ui/DecryptedText";

export default function ArchitectureVisualizerSection() {
    const [selectedMapId, setSelectedMapId] = useState<ArchitectureMap["id"]>("logic-arena");

    const currentMap =
        ARCHITECTURE_MAPS.find((m) => m.id === selectedMapId) || ARCHITECTURE_MAPS[0];

    const [selectedNodeId, setSelectedNodeId] = useState<string>(currentMap.nodes[0].id);

    const handleMapChange = useCallback((mapId: ArchitectureMap["id"]) => {
        setSelectedMapId(mapId);
        const newMap = ARCHITECTURE_MAPS.find((m) => m.id === mapId);
        if (newMap && newMap.nodes.length > 0) {
            setSelectedNodeId(newMap.nodes[0].id);
        }
    }, []);

    const selectedNode =
        currentMap.nodes.find((n) => n.id === selectedNodeId) || currentMap.nodes[0];

    return (
        <section
            id="architecture"
            className="relative w-full py-16 sm:py-20 bg-background overflow-hidden"
            aria-label="System Architecture Forensics"
        >
            <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl space-y-6">
                {/* ═══════════════════════════════════════════════════════════
                   SECTION HEADER: EDITORIAL & PRECISE
                   ═══════════════════════════════════════════════════════════ */}
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-2.5">
                    <p className="section-eyebrow">
                        <DecryptedText
                            text="Architecture Anatomy & System Forensics"
                            speed={25}
                            sequential={true}
                            animateOn="view"
                        />
                    </p>
                    <h2 className="section-title text-3xl sm:text-4xl md:text-5xl tracking-tight">
                        Internal System{" "}
                        <span className="accent-word-emerald">X-Ray</span>
                    </h2>
                    <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-sans">
                        Inspect the internal anatomy of production software systems: execution authority,
                        worker threads, in-memory state pipelines, and historical battle scars.
                    </p>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                   SYSTEM SPECIMEN SWITCHER (COMPACT DECK)
                   ═══════════════════════════════════════════════════════════ */}
                <div className="max-w-4xl mx-auto w-full">
                    <SystemSpecimenSwitcher
                        activeMapId={selectedMapId}
                        onSelectMap={handleMapChange}
                    />
                </div>

                {/* ═══════════════════════════════════════════════════════════
                   DESKTOP EXPERIENCE: DUAL-BAY FORENSIC COCKPIT (>= lg)
                   Fits within ~1 viewport with zero endless scrolling
                   ═══════════════════════════════════════════════════════════ */}
                <div className="hidden lg:grid grid-cols-12 gap-5 h-[640px] xl:h-[680px]">
                    {/* Left: Layered Architectural Spine & Dynamic Bus (7 cols) */}
                    <div className="col-span-7 xl:col-span-8 h-full min-h-0">
                        <ArchitectureForensicCanvas
                            map={currentMap}
                            selectedNodeId={selectedNodeId}
                            onSelectNode={setSelectedNodeId}
                        />
                    </div>

                    {/* Right: Component Forensic Dossier & Scar Inspector (5 cols) */}
                    <div className="col-span-5 xl:col-span-4 h-full min-h-0">
                        <ForensicDossierInspector
                            node={selectedNode}
                            map={currentMap}
                            onSelectNode={setSelectedNodeId}
                        />
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                   MOBILE EXPERIENCE: PURPOSE-BUILT SYSTEM INSPECTOR (< lg)
                   Zero tiny unreadable canvas nodes; 100% thumb-friendly
                   ═══════════════════════════════════════════════════════════ */}
                <div className="block lg:hidden w-full">
                    <MobileSystemForensics
                        map={currentMap}
                        selectedNodeId={selectedNodeId}
                        onSelectNode={setSelectedNodeId}
                    />
                </div>
            </div>
        </section>
    );
}
