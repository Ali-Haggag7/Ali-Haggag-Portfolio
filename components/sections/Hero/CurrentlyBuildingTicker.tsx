"use client";

import { memo } from "react";
import { ArrowRight } from "lucide-react";
import { BorderBeam } from "@/components/ui/BorderBeam";

export const CurrentlyBuildingTicker = memo(function CurrentlyBuildingTicker() {
    const handleJumpToScout = () => {
        const el = document.getElementById("scout-brain");
        el?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <button
            type="button"
            onClick={handleJumpToScout}
            className="relative overflow-hidden mb-12 sm:mb-6 max-w-[90vw] inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 dark:bg-purple-500/15 px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-mono text-purple-700 dark:text-purple-300 shadow-sm transition-all hover:bg-purple-500/20 hover:border-purple-500/60 cursor-pointer min-h-[44px] shrink-0"
        >
            <BorderBeam duration={6} borderWidth={1.5} colorFrom="hsl(var(--accent-purple))" colorTo="hsl(var(--accent-blue))" />
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 dark:bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600 dark:bg-purple-500" />
            </span>
            <span className="font-bold shrink-0">Building:</span>
            <span className="truncate">Scout v0.24 — Autonomous AI Agent</span>
            <ArrowRight className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" aria-hidden="true" />
        </button>
    );
});

