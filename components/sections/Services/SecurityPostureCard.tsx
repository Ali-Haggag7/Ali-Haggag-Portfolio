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
        <div className="w-full max-w-4xl mx-auto my-12 p-6 rounded-2xl border border-[hsl(var(--accent-emerald)/0.4)] cyber-card tactical-corner-reticles bg-card/90 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2 font-display text-xs md:text-sm font-bold tracking-wide text-[hsl(var(--accent-emerald))]">
                    <ShieldCheck className="h-5 w-5 text-[hsl(var(--accent-emerald))] animate-pulse" aria-hidden="true" />
                    <span>5-LAYER SECURITY POSTURE MATRIX</span>
                </div>
                <span
                    className="hud-tag"
                    style={{
                        color: "hsl(var(--accent-emerald))",
                        borderColor: "hsl(var(--accent-emerald) / 0.4)",
                        backgroundColor: "hsl(var(--accent-emerald) / 0.1)",
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-emerald))] animate-ping" />
                    STATUS // ZERO VULNS
                </span>
            </div>

            <div className="space-y-3">
                {SECURITY_LAYERS.map((layer) => (
                    <div
                        key={layer.layer}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20 transition-all duration-200 hover:border-[hsl(var(--accent-emerald)/0.5)] hover:bg-muted/40"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[hsl(var(--accent-emerald)/0.3)] bg-[hsl(var(--accent-emerald)/0.1)] text-xs font-mono font-bold text-[hsl(var(--accent-emerald))]">
                                L0{layer.layer}
                            </span>
                            <div>
                                <h4 className="text-sm font-bold font-display text-foreground">
                                    {layer.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {layer.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                            <span className="text-muted-foreground">Implemented in:</span>
                            <span className="font-semibold text-[hsl(var(--accent-emerald))] bg-[hsl(var(--accent-emerald)/0.1)] px-2.5 py-0.5 rounded border border-[hsl(var(--accent-emerald)/0.2)]">
                                {layer.projects}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
