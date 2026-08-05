"use client";

import { useState, useCallback, useEffect } from "react";
import { ARCHITECTURE_MAPS, type ArchitectureMap } from "./architectureData";
import { ArchitectureMapSVG } from "./ArchitectureMapSVG";
import { NodeInspector } from "./NodeInspector";
import { Server } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ArchitectureVisualizerSection() {
    const [selectedMapId, setSelectedMapId] = useState<ArchitectureMap["id"]>("logic-arena");

    const currentMap = ARCHITECTURE_MAPS.find((m) => m.id === selectedMapId) || ARCHITECTURE_MAPS[0];
    const [selectedNodeId, setSelectedNodeId] = useState<string>(currentMap.nodes[0].id);

    // Mobile check for static fallbacks
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    const handleMapChange = useCallback((mapId: ArchitectureMap["id"]) => {
        setSelectedMapId(mapId);
        const newMap = ARCHITECTURE_MAPS.find((m) => m.id === mapId);
        if (newMap && newMap.nodes.length > 0) {
            setSelectedNodeId(newMap.nodes[0].id);
        }
    }, []);

    const selectedNode = currentMap.nodes.find((n) => n.id === selectedNodeId) || currentMap.nodes[0];

    return (
        <section id="architecture" className="relative w-full py-20 bg-transparent overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto">
                    <p className="section-eyebrow mb-3">System Architecture</p>
                    <h2 className="section-title text-4xl md:text-5xl mb-3">
                        Interactive{" "}
                        <span className="accent-word">Node Graphs</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                        Explore how Ali structures monorepos, real-time WebSockets, AST parsers, and isolated AI worker threads in production.
                    </p>

                    {/* System Map Switcher Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                        {ARCHITECTURE_MAPS.map((map) => (
                            <button
                                key={map.id}
                                type="button"
                                onClick={() => handleMapChange(map.id)}
                                className={cn(
                                    "flex min-h-[44px] items-center gap-2 px-5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer",
                                    selectedMapId === map.id
                                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Server className="h-3.5 w-3.5" aria-hidden="true" />
                                {map.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Visualizer Grid */}
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* SVG Map */}
                    <ArchitectureMapSVG
                        map={currentMap}
                        selectedNodeId={selectedNodeId}
                        onSelectNode={setSelectedNodeId}
                    />

                    {/* Selected Node Inspector Panel */}
                    <NodeInspector node={selectedNode} />
                </div>
            </div>
        </section>
    );
}
