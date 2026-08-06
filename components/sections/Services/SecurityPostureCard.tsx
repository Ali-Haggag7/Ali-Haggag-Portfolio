"use client";

import { memo } from "react";
import { ShieldCheck, Lock, Key, Terminal, CheckCircle2 } from "lucide-react";

export const SECURITY_LAYERS = Object.freeze([
    {
        layer: 1,
        name: "AES-256-GCM Field Encryption",
        projects: "Scout AI Agent",
        description: "Encrypts candidate CV data & PII at rest before DB insertion.",
    },
    {
        layer: 2,
        name: "HttpOnly JWT & Token Versioning",
        projects: "Blog Pro / StudentHub",
        description: "Prevents XSS token theft with HttpOnly cookies & automatic token invalidation on role change.",
    },
    {
        layer: 3,
        name: "Zod Anti-Corruption Layer (ACL)",
        projects: "Cybership Carrier API",
        description: "Strict payload schema boundaries preventing external API malformed payload injection.",
    },
    {
        layer: 4,
        name: "Sandboxed AST Interpreter",
        projects: "AliScript DSL Engine",
        description: "Node-by-node AST execution without eval() under a deterministic 2,000 ops quota.",
    },
    {
        layer: 5,
        name: "Redis Rate-Limiting & Helmet",
        projects: "Logic Arena / Nginx Gateway",
        description: "Protecting public endpoints against DDoS & brute-force attempts with Redis sliding windows.",
    },
]);

export const SecurityPostureCard = memo(function SecurityPostureCard() {
    return (
        <div className="w-full max-w-4xl mx-auto my-12 p-4 sm:p-6 rounded-2xl border border-emerald-500/30 dark:border-[hsl(var(--accent-emerald)/0.4)] cyber-card tactical-corner-reticles bg-card/90 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2 font-display text-xs md:text-sm font-extrabold tracking-wide text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" aria-hidden="true" />
                    <span>5-LAYER SECURITY POSTURE MATRIX</span>
                </div>
                <span
                    className="hud-tag"
                    style={{
                        color: "var(--tl-accent-emerald)",
                        borderColor: "color-mix(in srgb, var(--tl-accent-emerald) 40%, transparent)",
                        backgroundColor: "color-mix(in srgb, var(--tl-accent-emerald) 12%, transparent)",
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-[hsl(var(--accent-emerald))] animate-ping" />
                    STATUS // ZERO VULNS
                </span>
            </div>

            <div className="space-y-3">
                {SECURITY_LAYERS.map((layer) => (
                    <div
                        key={layer.layer}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-border/60 bg-slate-100/60 dark:bg-muted/20 transition-all duration-200 hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-muted/40"
                    >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/40 dark:border-[hsl(var(--accent-emerald)/0.3)] bg-emerald-500/10 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 sm:mt-0">
                                L0{layer.layer}
                            </span>
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-bold font-display text-foreground leading-snug">
                                    {layer.name}
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-muted-foreground font-medium leading-relaxed">
                                    {layer.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 text-xs font-mono pt-2 sm:pt-0 border-t border-slate-200/60 dark:border-border/30 sm:border-0">
                            <span className="text-slate-600 dark:text-muted-foreground font-medium text-[11px]">Implemented in:</span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-[hsl(var(--accent-emerald)/0.1)] px-2.5 py-0.5 rounded border border-emerald-500/30 dark:border-[hsl(var(--accent-emerald)/0.2)]">
                                {layer.projects}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
