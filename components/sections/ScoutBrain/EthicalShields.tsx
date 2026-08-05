"use client";

import { memo } from "react";
import { ETHICAL_SHIELDS } from "./scoutData";
import { ShieldCheck, Lock } from "lucide-react";

export const EthicalShields = memo(function EthicalShields() {
    return (
        <div className="w-full mt-8 pt-6">
            <div className="flex items-center gap-2 mb-4 text-xs font-display font-bold text-muted-foreground uppercase tracking-widest">
                <Lock className="h-3.5 w-3.5 text-[hsl(var(--accent-emerald))]" aria-hidden="true" />
                Hard Architectural Ethical Guardrails
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ETHICAL_SHIELDS.map((shield) => (
                    <div
                        key={shield.name}
                        className="flex flex-col justify-between rounded-xl border border-[hsl(var(--accent-emerald)/0.25)] bg-[hsl(var(--accent-emerald)/0.04)] p-4 transition-all duration-300 hover:border-[hsl(var(--accent-emerald)/0.5)] hover:bg-[hsl(var(--accent-emerald)/0.08)] cyber-card"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-display font-bold text-foreground tracking-tight">
                                {shield.name}
                            </span>
                            <span
                                className="hud-tag"
                                style={{
                                    color: "hsl(var(--accent-emerald))",
                                    borderColor: "hsl(var(--accent-emerald) / 0.4)",
                                    backgroundColor: "hsl(var(--accent-emerald) / 0.12)",
                                }}
                            >
                                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                                {shield.status}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {shield.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
});
