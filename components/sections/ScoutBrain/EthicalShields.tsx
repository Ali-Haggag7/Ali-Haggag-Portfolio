"use client";

import { memo } from "react";
import { ETHICAL_SHIELDS } from "./scoutData";
import { ShieldCheck, Lock } from "lucide-react";

export const EthicalShields = memo(function EthicalShields() {
    return (
        <div className="w-full mt-8 pt-6">
            <div className="flex items-center gap-2 mb-4 text-xs font-display font-extrabold text-foreground uppercase tracking-widest">
                <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>Hard Architectural Ethical Guardrails</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ETHICAL_SHIELDS.map((shield) => (
                    <div
                        key={shield.name}
                        className="flex flex-col justify-between rounded-xl border border-emerald-500/30 dark:border-[hsl(var(--accent-emerald)/0.25)] bg-emerald-500/5 p-4 transition-all duration-300 hover:border-emerald-500/50 cyber-card"
                    >
                        <div className="flex items-center justify-between mb-2 gap-2">
                            <span className="text-xs font-display font-bold text-foreground tracking-tight">
                                {shield.name}
                            </span>
                            <span
                                className="hud-tag"
                                style={{
                                    color: "var(--tl-accent-emerald)",
                                    borderColor: "color-mix(in srgb, var(--tl-accent-emerald) 40%, transparent)",
                                    backgroundColor: "color-mix(in srgb, var(--tl-accent-emerald) 12%, transparent)",
                                }}
                            >
                                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                                {shield.status}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            {shield.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
});
