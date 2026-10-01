"use client";

import { memo, useMemo } from "react";
import type { ArchitectureMap, SystemNode } from "./architectureData";
import {
    CATEGORY_SPECS,
    getUpstreamNodes,
    getDownstreamNodes,
    computeDependencyPath,
} from "./architectureData";
import { scarsData } from "../BattleScars/scars.data";
import {
    Activity,
    Cpu,
    ExternalLink,
    Layers,
    ShieldAlert,
    GitCommit,
    Workflow,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ForensicDossierInspectorProps {
    node: SystemNode;
    map: ArchitectureMap;
    onSelectNode: (nodeId: string) => void;
    className?: string;
}

export const ForensicDossierInspector = memo(function ForensicDossierInspector({
    node,
    map,
    onSelectNode,
    className,
}: ForensicDossierInspectorProps) {
    const categorySpec = CATEGORY_SPECS[node.category];

    // Find linked scar from BattleScars source of truth
    const linkedScar = useMemo(() => {
        if (!node.scarId) return null;
        return scarsData.find((s) => s.id === node.scarId) || null;
    }, [node.scarId]);

    // Derived dependencies
    const upstreamNodes = useMemo(() => getUpstreamNodes(map, node.id), [map, node.id]);
    const downstreamNodes = useMemo(() => getDownstreamNodes(map, node.id), [map, node.id]);
    const dependencyPath = useMemo(() => computeDependencyPath(map, node.id), [map, node.id]);

    const handleJumpToScar = (scarId: string) => {
        const scarElement =
            document.getElementById(`scar-${scarId}`) || document.getElementById("battle-scars");
        scarElement?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <aside
            className={cn(
                "flex flex-col h-full rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-300",
                className
            )}
            aria-label="Component Forensic Dossier"
        >
            {/* Top Dossier Title Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/70 bg-muted/20 text-xs font-mono">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: categorySpec.color }}
                    />
                    <span className="font-semibold tracking-wider uppercase text-[11px] text-foreground">
                        FORENSIC DOSSIER
                    </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                    SPECIMEN // {node.id.toUpperCase()}
                </span>
            </div>

            {/* Scrollable Dossier Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-sm">
                {/* 1. Header: Component Identity & Category */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase border"
                            style={{
                                color: categorySpec.color,
                                backgroundColor: `color-mix(in srgb, ${categorySpec.color} 12%, transparent)`,
                                borderColor: `color-mix(in srgb, ${categorySpec.color} 30%, transparent)`,
                            }}
                        >
                            {categorySpec.badge}
                        </span>
                        {node.scarId && (
                            <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
                                <ShieldAlert className="w-3 h-3" />
                                <span>SCAR: {node.scarId}</span>
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold font-display text-foreground tracking-tight">
                        {node.label}
                    </h3>

                    <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-foreground/70" />
                        <span>System Role:</span>
                        <strong className="text-foreground">{node.role}</strong>
                    </div>
                </div>

                {/* 2. Technical Foundation */}
                <div className="rounded-xl border border-border/70 bg-muted/15 p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground uppercase font-semibold">
                        <Cpu className="w-3.5 h-3.5 text-[hsl(var(--accent-blue))]" />
                        <span>Technical Foundation</span>
                    </div>
                    <div className="text-xs font-mono font-medium text-foreground">
                        {node.tech}
                    </div>
                </div>

                {/* 3. Engineering Details & Responsibilities */}
                <div className="rounded-xl border border-border/60 bg-card p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground uppercase font-semibold">
                        <Info className="w-3.5 h-3.5 text-foreground/70" />
                        <span>Architectural Responsibility</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                        {node.details}
                    </p>
                </div>

                {/* 4. Active Dependency Path Explorer */}
                <div className="space-y-3 pt-1 border-t border-border/60">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                            <Workflow className="w-3.5 h-3.5 text-[hsl(var(--accent-purple))]" />
                            <span>Dependency Path Traversal</span>
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                            Click node to follow
                        </span>
                    </div>

                    {/* Step-by-Step Breadcrumb Chain */}
                    {dependencyPath.length > 1 && (
                        <div className="p-2.5 rounded-xl border border-border/60 bg-muted/10 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                            {dependencyPath.map((step, idx) => (
                                <div key={step.id} className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => onSelectNode(step.id)}
                                        className={cn(
                                            "cursor-pointer px-2 py-0.5 rounded-md transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                            step.id === node.id
                                                ? "bg-foreground text-background font-bold shadow-xs"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                        )}
                                    >
                                        {step.label}
                                    </button>
                                    {idx < dependencyPath.length - 1 && (
                                        <ArrowRight className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Direct Upstream & Downstream Dependency Jump Cards */}
                    <div className="space-y-2">
                        {/* Downstream (Calls / Dispatches to) */}
                        {downstreamNodes.length > 0 && (
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1">
                                    <ArrowRight className="w-3 h-3 text-[hsl(var(--accent-emerald))]" />
                                    <span>Dispatches To ({downstreamNodes.length})</span>
                                </span>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {downstreamNodes.map((dn) => {
                                        const dnSpec = CATEGORY_SPECS[dn.category];
                                        return (
                                            <button
                                                key={dn.id}
                                                type="button"
                                                onClick={() => onSelectNode(dn.id)}
                                                className="cursor-pointer w-full text-left p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all flex items-center justify-between gap-2 group focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span
                                                        className="w-2 h-2 rounded-full shrink-0"
                                                        style={{ backgroundColor: dnSpec.color }}
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-semibold text-foreground group-hover:text-[hsl(var(--accent-blue))] transition-colors truncate">
                                                            {dn.label}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground truncate">
                                                            {dn.role}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground shrink-0">
                                                    Traverse →
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Upstream (Invoked By / Dependency Of) */}
                        {upstreamNodes.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1">
                                    <ArrowLeft className="w-3 h-3 text-[hsl(var(--accent-blue))]" />
                                    <span>Invoked By ({upstreamNodes.length})</span>
                                </span>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {upstreamNodes.map((un) => {
                                        const unSpec = CATEGORY_SPECS[un.category];
                                        return (
                                            <button
                                                key={un.id}
                                                type="button"
                                                onClick={() => onSelectNode(un.id)}
                                                className="cursor-pointer w-full text-left p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all flex items-center justify-between gap-2 group focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span
                                                        className="w-2 h-2 rounded-full shrink-0"
                                                        style={{ backgroundColor: unSpec.color }}
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-semibold text-foreground group-hover:text-[hsl(var(--accent-blue))] transition-colors truncate">
                                                            {un.label}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground truncate">
                                                            {un.role}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground shrink-0">
                                                    ← Upstream
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Historical Engineering Scar (If Present) */}
                {node.scarId && (
                    <div className="space-y-2.5 pt-2 border-t border-red-500/20">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold tracking-wide uppercase text-red-400 flex items-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                                <span>Historical Engineering Scar</span>
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                                INCIDENT #{node.scarId}
                            </span>
                        </div>

                        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3.5 space-y-2">
                            <div className="text-xs font-bold text-foreground">
                                {linkedScar ? linkedScar.title : node.scarId}
                            </div>

                            {linkedScar && (
                                <div className="space-y-1.5 text-[11px] font-sans text-muted-foreground leading-relaxed">
                                    <div>
                                        <strong className="text-red-300 font-mono text-[10px] uppercase block">
                                            Symptom:
                                        </strong>
                                        {linkedScar.symptom}
                                    </div>
                                    <div>
                                        <strong className="text-emerald-300 font-mono text-[10px] uppercase block">
                                            Architecture Fix:
                                        </strong>
                                        {linkedScar.solution}
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => handleJumpToScar(node.scarId!)}
                                className="cursor-pointer w-full min-h-[44px] px-3 py-2 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none"
                            >
                                <GitCommit className="w-3.5 h-3.5" />
                                <span>Inspect Full Scar Autopsy</span>
                                <ExternalLink className="w-3 h-3 text-red-400" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
});
