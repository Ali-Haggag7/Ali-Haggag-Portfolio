"use client";

import { memo } from "react";
import type { SystemNode } from "./architectureData";
import { Server, Bug, ExternalLink, Cpu, Info } from "lucide-react";

interface NodeInspectorProps {
    node: SystemNode;
}

export const NodeInspector = memo(function NodeInspector({ node }: NodeInspectorProps) {
    const handleJumpToScar = (scarId: string) => {
        const scarElement = document.getElementById(`scar-${scarId}`) || document.getElementById("battle-scars");
        scarElement?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-full rounded-2xl border border-border bg-card p-5 md:p-6 shadow-xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    <h3 className="text-lg font-bold text-foreground font-mono">
                        {node.label}
                    </h3>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full border border-border/40">
                    {node.category} node
                </span>
            </div>

            {/* Role & Tech */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">
                    <span className="text-muted-foreground block mb-1">System Role:</span>
                    <span className="font-semibold text-foreground">{node.role}</span>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/50 p-3">
                    <span className="text-muted-foreground block mb-1">Tech Stack:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{node.tech}</span>
                </div>
            </div>

            {/* Architectural Responsibilities / Details */}
            <div className="rounded-xl border border-[var(--scar-code-border)] bg-[var(--scar-code-bg)] p-4 font-mono text-xs text-[var(--scar-code-fg)] leading-relaxed">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <span className="font-bold text-[var(--scar-code-fg)]">Architectural Responsibility:</span>
                </div>
                <p className="font-medium">{node.details}</p>
            </div>

            {/* Linked Battle Scar (if present) */}
            {node.scarId && (
                <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-mono font-medium">
                        <Bug className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" aria-hidden="true" />
                        <span>Linked Production Incident: <strong className="text-red-950 dark:text-white font-extrabold">{node.scarId}</strong></span>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleJumpToScar(node.scarId!)}
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline cursor-pointer min-h-[44px]"
                    >
                        View Scar Autopsy
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
});
