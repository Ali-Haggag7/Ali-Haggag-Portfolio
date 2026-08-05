"use client";

import { memo } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export const CurrentlyBuildingTicker = memo(function CurrentlyBuildingTicker() {
    const handleJumpToScout = () => {
        const el = document.getElementById("scout-brain");
        el?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <button
            type="button"
            onClick={handleJumpToScout}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-mono text-purple-300 shadow-sm transition-all hover:bg-purple-500/20 hover:border-purple-500/60 cursor-pointer min-h-[44px]"
        >
            <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span className="font-bold">Currently Building:</span>
            <span>Scout v0.24 — Autonomous AI Agent</span>
            <ArrowRight className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />
        </button>
    );
});
