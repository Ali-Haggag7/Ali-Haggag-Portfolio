"use client";

import { memo, useState } from "react";
import type { ArchitectureMap, SystemNode } from "./architectureData";
import {
    CATEGORY_SPECS,
    getUpstreamNodes,
    getDownstreamNodes,
} from "./architectureData";
import { scarsData } from "../BattleScars/scars.data";
import {
    Activity,
    Cpu,
    ExternalLink,
    ShieldAlert,
    GitCommit,
    Workflow,
    ArrowRight,
    ArrowLeft,
    Compass,
    ChevronRight,
    CheckCircle2,
    Info,
    RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSystemForensicsProps {
    map: ArchitectureMap;
    selectedNodeId: string;
    onSelectNode: (nodeId: string) => void;
}

export const MobileSystemForensics = memo(function MobileSystemForensics({
    map,
    selectedNodeId,
    onSelectNode,
}: MobileSystemForensicsProps) {
    const [viewMode, setViewMode] = useState<"layers" | "dossier">("dossier");

    const selectedNode = map.nodes.find((n) => n.id === selectedNodeId) || map.nodes[0];
    const catSpec = CATEGORY_SPECS[selectedNode.category];

    // Find linked scar from BattleScars source of truth
    const linkedScar = selectedNode.scarId
        ? scarsData.find((s) => s.id === selectedNode.scarId)
        : null;

    // Derived dependencies
    const upstreamNodes = getUpstreamNodes(map, selectedNode.id);
    const downstreamNodes = getDownstreamNodes(map, selectedNode.id);

    const handleJumpToScar = (scarId: string) => {
        const scarElement =
            document.getElementById(`scar-${scarId}`) || document.getElementById("battle-scars");
        scarElement?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-full flex flex-col space-y-4">
            {/* View Mode Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl border border-border/80 bg-card/80 backdrop-blur-md">
                <button
                    type="button"
                    onClick={() => setViewMode("dossier")}
                    className={cn(
                        "cursor-pointer min-h-[44px] rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                        viewMode === "dossier"
                            ? "bg-foreground text-background font-bold shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Compass className="w-4 h-4" />
                    <span>Component Dossier</span>
                </button>

                <button
                    type="button"
                    onClick={() => setViewMode("layers")}
                    className={cn(
                        "cursor-pointer min-h-[44px] rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                        viewMode === "layers"
                            ? "bg-foreground text-background font-bold shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Workflow className="w-4 h-4" />
                    <span>System Spine ({map.nodes.length})</span>
                </button>
            </div>

            {/* Horizontal Component Selector Rail (Thumb-Friendly) */}
            <div className="overflow-x-auto custom-scrollbar pb-1 -mx-4 px-4 flex gap-2 snap-x">
                {map.nodes.map((node) => {
                    const isSelected = selectedNode.id === node.id;
                    const nodeSpec = CATEGORY_SPECS[node.category];

                    return (
                        <button
                            key={node.id}
                            type="button"
                            onClick={() => {
                                onSelectNode(node.id);
                                setViewMode("dossier");
                            }}
                            className={cn(
                                "cursor-pointer shrink-0 snap-start min-h-[48px] px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                isSelected
                                    ? "bg-card shadow-md ring-1"
                                    : "bg-card/60 hover:bg-muted/40"
                            )}
                            style={{
                                borderColor: isSelected
                                    ? nodeSpec.color
                                    : "hsl(var(--border) / 0.7)",
                            }}
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: nodeSpec.color }}
                            />
                            <div className="text-left">
                                <div
                                    className={cn(
                                        "text-xs font-semibold whitespace-nowrap",
                                        isSelected ? "text-foreground font-bold" : "text-muted-foreground"
                                    )}
                                >
                                    {node.label}
                                </div>
                                <div className="text-[9px] font-mono text-muted-foreground/75 truncate">
                                    {node.role}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ═══════════════════════════════════════════════════════════
               VIEW A: DETAILED COMPONENT DOSSIER
               ═══════════════════════════════════════════════════════════ */}
            {viewMode === "dossier" && (
                <div className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-4 sm:p-5 space-y-4 shadow-xl">
                    {/* Header */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase border inline-block"
                                style={{
                                    color: catSpec.color,
                                    backgroundColor: `color-mix(in srgb, ${catSpec.color} 12%, transparent)`,
                                    borderColor: `color-mix(in srgb, ${catSpec.color} 30%, transparent)`,
                                }}
                            >
                                {catSpec.badge}
                            </span>

                            {selectedNode.scarId && (
                                <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
                                    <ShieldAlert className="w-3 h-3" />
                                    <span>SCAR: {selectedNode.scarId}</span>
                                </span>
                            )}
                        </div>

                        <h3 className="text-lg font-bold font-display text-foreground tracking-tight">
                            {selectedNode.label}
                        </h3>

                        <div className="text-xs font-mono text-muted-foreground">
                            Role: <strong className="text-foreground">{selectedNode.role}</strong>
                        </div>
                    </div>

                    {/* Technical Foundation */}
                    <div className="rounded-xl border border-border/70 bg-muted/15 p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground uppercase font-semibold">
                            <Cpu className="w-3.5 h-3.5 text-[hsl(var(--accent-blue))]" />
                            <span>Technical Foundation</span>
                        </div>
                        <div className="text-xs font-mono font-medium text-foreground">
                            {selectedNode.tech}
                        </div>
                    </div>

                    {/* Architectural Responsibility */}
                    <div className="rounded-xl border border-border/60 bg-muted/10 p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground uppercase font-semibold">
                            <Info className="w-3.5 h-3.5 text-foreground/70" />
                            <span>Architectural Responsibility</span>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                            {selectedNode.details}
                        </p>
                    </div>

                    {/* Downstream Dispatches */}
                    {downstreamNodes.length > 0 && (
                        <div className="space-y-2 pt-1 border-t border-border/60">
                            <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                <ArrowRight className="w-3.5 h-3.5 text-[hsl(var(--accent-emerald))]" />
                                <span>Dispatches To ({downstreamNodes.length})</span>
                            </span>
                            <div className="space-y-2">
                                {downstreamNodes.map((dn) => {
                                    const dnSpec = CATEGORY_SPECS[dn.category];
                                    return (
                                        <button
                                            key={dn.id}
                                            type="button"
                                            onClick={() => onSelectNode(dn.id)}
                                            className="cursor-pointer w-full text-left min-h-[44px] p-2.5 rounded-xl border border-border/60 bg-muted/20 active:bg-muted/40 transition-all flex items-center justify-between gap-3 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                                    style={{ backgroundColor: dnSpec.color }}
                                                />
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-foreground truncate">
                                                        {dn.label}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground truncate">
                                                        {dn.role}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono text-muted-foreground shrink-0">
                                                Traverse →
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Upstream Invokers */}
                    {upstreamNodes.length > 0 && (
                        <div className="space-y-2 pt-1 border-t border-border/60">
                            <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                <ArrowLeft className="w-3.5 h-3.5 text-[hsl(var(--accent-blue))]" />
                                <span>Invoked By ({upstreamNodes.length})</span>
                            </span>
                            <div className="space-y-2">
                                {upstreamNodes.map((un) => {
                                    const unSpec = CATEGORY_SPECS[un.category];
                                    return (
                                        <button
                                            key={un.id}
                                            type="button"
                                            onClick={() => onSelectNode(un.id)}
                                            className="cursor-pointer w-full text-left min-h-[44px] p-2.5 rounded-xl border border-border/60 bg-muted/20 active:bg-muted/40 transition-all flex items-center justify-between gap-3 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                                    style={{ backgroundColor: unSpec.color }}
                                                />
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-foreground truncate">
                                                        {un.label}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground truncate">
                                                        {un.role}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono text-muted-foreground shrink-0">
                                                ← Upstream
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Historical Engineering Scar (If Present) */}
                    {selectedNode.scarId && (
                        <div className="space-y-2.5 pt-2 border-t border-red-500/20">
                            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 space-y-2">
                                <div className="text-xs font-bold text-red-300">
                                    Incident #{selectedNode.scarId}
                                </div>
                                {linkedScar && (
                                    <div className="text-[11px] font-sans text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground font-semibold block mb-0.5">
                                            {linkedScar.title}
                                        </strong>
                                        {linkedScar.symptom}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleJumpToScar(selectedNode.scarId!)}
                                    className="cursor-pointer w-full min-h-[44px] px-3 py-2 rounded-lg border border-red-500/40 bg-red-500/10 active:bg-red-500/20 text-red-300 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                >
                                    <GitCommit className="w-3.5 h-3.5" />
                                    <span>Inspect Scar Autopsy</span>
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
               VIEW B: COMPLETE ARCHITECTURE SPINE OVERVIEW
               ═══════════════════════════════════════════════════════════ */}
            {viewMode === "layers" && (
                <div className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-4 sm:p-5 space-y-4 shadow-xl">
                    <div className="rounded-xl border border-border/60 bg-muted/15 p-3 text-xs text-foreground/90 leading-relaxed font-sans">
                        <strong className="font-mono text-muted-foreground uppercase text-[10px] block mb-1">
                            Architecture Spine:
                        </strong>
                        {map.spineDescription}
                    </div>

                    <div className="space-y-2.5">
                        <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase">
                            System Components ({map.nodes.length})
                        </span>

                        <div className="space-y-2">
                            {map.nodes.map((node) => {
                                const isSelected = node.id === selectedNode.id;
                                const nodeSpec = CATEGORY_SPECS[node.category];

                                return (
                                    <button
                                        key={node.id}
                                        type="button"
                                        onClick={() => {
                                            onSelectNode(node.id);
                                            setViewMode("dossier");
                                        }}
                                        className={cn(
                                            "cursor-pointer w-full text-left min-h-[48px] p-3 rounded-xl border transition-all flex items-center justify-between gap-3 focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                            isSelected
                                                ? "bg-card shadow-md ring-1"
                                                : "bg-muted/20 active:bg-muted/40"
                                        )}
                                        style={{
                                            borderColor: isSelected
                                                ? nodeSpec.color
                                                : "hsl(var(--border) / 0.7)",
                                        }}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                                style={{ backgroundColor: nodeSpec.color }}
                                            />
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold text-foreground truncate">
                                                    {node.label}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground truncate">
                                                    {node.role} • {node.tech}
                                                </div>
                                            </div>
                                        </div>

                                        <span className="text-xs font-mono text-muted-foreground shrink-0">
                                            Inspect →
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
