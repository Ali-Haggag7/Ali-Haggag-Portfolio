"use client";

import { memo } from "react";
import type { CognitiveStep } from "./scoutData";
import { Terminal, Info } from "lucide-react";

interface ScoutInspectorProps {
    step: CognitiveStep;
}

export const ScoutInspector = memo(function ScoutInspector({ step }: ScoutInspectorProps) {
    return (
        <div className="w-full rounded-2xl border border-border cyber-card tactical-corner-reticles p-5 md:p-6 shadow-xl space-y-4">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2 text-[hsl(var(--accent-purple))] font-display text-sm font-bold tracking-wide">
                    <Terminal className="h-4 w-4 text-[hsl(var(--accent-purple))]" aria-hidden="true" />
                    <span>Inspection Window — {step.title} Stage</span>
                </div>
                <span
                    className="hud-tag"
                    style={{
                        color: "hsl(var(--accent-purple))",
                        borderColor: "hsl(var(--accent-purple) / 0.4)",
                        backgroundColor: "hsl(var(--accent-purple) / 0.1)",
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-purple))] animate-pulse" />
                    Phase 0{step.number} / 05
                </span>
            </div>

            {/* Description & Inspector Content */}
            <div className="space-y-3">
                <h4 className="text-base font-bold text-foreground font-display tracking-tight">
                    {step.inspectorData.heading}
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                </p>

                {/* Log / Code Snippet */}
                <div className="rounded-xl border border-[var(--scar-code-border)] bg-[var(--scar-code-bg)] p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto shadow-inner">
                    <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/10 text-[10px] uppercase font-mono tracking-widest text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-red-500/60 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/60 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/60 inline-block" />
                        <span className="ml-2 font-bold text-slate-300">EXECUTION STREAM</span>
                    </div>
                    <pre className="whitespace-pre-wrap">{step.inspectorData.codeSnippet}</pre>
                </div>

                {/* System Detail Note — Masterclass Callout Box */}
                <div className="rounded-xl border border-l-4 border-border border-l-[hsl(var(--accent-purple))] bg-muted/20 p-4 shadow-sm space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="hud-tag" style={{ color: "hsl(var(--accent-purple))", backgroundColor: "hsl(var(--accent-purple) / 0.15)", borderColor: "hsl(var(--accent-purple) / 0.3)" }}>
                            <Info className="h-3.5 w-3.5" aria-hidden="true" />
                            GUARD SPEC
                        </span>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[hsl(var(--accent-purple))]">System Guardrail</span>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-foreground/90 leading-relaxed pl-0.5">
                        {step.inspectorData.details}
                    </p>
                </div>
            </div>
        </div>
    );
});
