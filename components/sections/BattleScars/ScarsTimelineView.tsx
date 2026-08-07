"use client";

import { memo, useState } from "react";
import type { Scar } from "./scars.data";
import { cn } from "@/lib/utils";
import { Bug, AlertTriangle, ShieldAlert, ChevronDown, ExternalLink } from "lucide-react";

interface ScarsTimelineViewProps {
    scars: readonly Scar[];
    isMobile: boolean;
}

export const ScarsTimelineView = memo(function ScarsTimelineView({
    scars,
    isMobile,
}: ScarsTimelineViewProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="relative max-w-4xl mx-auto py-6">
            {/* Growth Trajectory Banner */}
            <div className="mb-10 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 text-center space-y-1.5 backdrop-blur-sm">
                <span className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase block">
                    Trajectory of Incident Complexity
                </span>
                <p className="text-sm font-mono text-foreground leading-relaxed break-words">
                    Infrastructure &amp; Network (v2.0) ➔ Compilers &amp; AST (v2.5) ➔ 3D &amp; Canvas Performance (v3.5) ➔ Autonomous AI Agent Cycles (Scout v0.24)
                </p>
            </div>

            {/* Vertical Spine Line */}
            <div
                aria-hidden="true"
                className="absolute left-5 md:left-1/2 top-28 bottom-6 w-0.5 md:-translate-x-1/2 bg-border/60 rounded-full"
            />

            {/* Timeline Incidents List */}
            <div className="space-y-8">
                {scars.map((scar, index) => {
                    const isEven = index % 2 === 0;
                    const isExpanded = expandedId === scar.id;
                    const Icon = scar.icon || Bug;

                    const severityColor =
                        scar.severity === "critical"
                            ? "var(--scar-critical)"
                            : scar.severity === "high"
                            ? "var(--scar-high)"
                            : "var(--scar-medium)";

                    return (
                        <div
                            key={scar.id}
                            id={`scar-${scar.id}`}
                            className={cn(
                                "group relative flex flex-col md:flex-row items-start md:items-center justify-between w-full scroll-mt-28",
                                isEven && "md:flex-row-reverse"
                            )}
                        >
                            {/* Spine Dot Indicator */}
                            <div
                                className="absolute left-5 md:left-1/2 md:-translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background z-10 transition-transform duration-300 group-hover:scale-110 shrink-0"
                                style={{ borderColor: severityColor }}
                            >
                                <Icon className="h-4 w-4" style={{ color: severityColor }} aria-hidden="true" />
                            </div>

                            {/* Timeline Card — on mobile: offset past the dot (left-5 + w-10 = 60px ≈ ml-16) */}
                            <div
                                className={cn(
                                    "ml-16 md:ml-0 min-w-0 w-[calc(100%-4rem)] md:w-[45%] rounded-2xl p-4 md:p-5 border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md",
                                    "hover:border-foreground/20"
                                )}
                                style={{ borderLeftWidth: "3px", borderLeftColor: severityColor }}
                            >
                                {/* Header badges */}
                                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                                    <span className="text-xs font-mono font-bold text-foreground bg-muted/40 px-2.5 py-0.5 rounded-full border border-border/40 break-all">
                                        {scar.project}
                                    </span>
                                    <span
                                        className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0"
                                        style={{
                                            color: severityColor,
                                            borderColor: `color-mix(in srgb, ${severityColor} 40%, transparent)`,
                                            backgroundColor: `color-mix(in srgb, ${severityColor} 10%, transparent)`,
                                        }}
                                    >
                                        {scar.severity}
                                    </span>
                                </div>

                                {/* Title */}
                                <h4 className="text-base md:text-lg font-bold text-foreground font-mono tracking-tight break-words">
                                    {scar.title}
                                </h4>

                                {/* Symptom summary */}
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed break-words">
                                    <strong className="text-foreground">Symptom:</strong> {scar.symptom}
                                </p>

                                {/* Expand Details Button */}
                                <button
                                    type="button"
                                    onClick={() => toggleExpand(scar.id)}
                                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-foreground/80 hover:text-foreground cursor-pointer min-h-[44px]"
                                >
                                    {isExpanded ? "Hide Autopsy" : "View Autopsy"}
                                    <ChevronDown
                                        className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")}
                                        aria-hidden="true"
                                    />
                                </button>

                                {/* Expanded Autopsy Details */}
                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-border/60 text-xs space-y-3 font-mono">
                                        <div>
                                            <span className="text-red-400 font-bold block mb-0.5">Root Cause:</span>
                                            <p className="text-muted-foreground leading-relaxed break-words">{scar.rootCause}</p>
                                        </div>
                                        <div>
                                            <span className="text-emerald-400 font-bold block mb-0.5">Fix / Resolution:</span>
                                            <p className="text-muted-foreground leading-relaxed break-words">{scar.solution}</p>
                                        </div>
                                        {scar.codeSnippet && (
                                            <div className="rounded-xl border border-border/80 bg-[var(--scar-code-bg)] p-3 text-slate-300 overflow-x-auto max-w-full">
                                                <pre className="text-[11px] leading-relaxed">{scar.codeSnippet}</pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
