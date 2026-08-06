"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { COGNITIVE_STEPS, type CognitiveStep } from "./scoutData";
import { Eye, Brain, ListChecks, Play, ShieldCheck } from "lucide-react";

interface ScoutPipelineSVGProps {
    activeStepId: string;
    onSelectStep: (id: CognitiveStep["id"]) => void;
}

const STEP_ICONS = {
    observe: Eye,
    reason: Brain,
    plan: ListChecks,
    act: Play,
    verify: ShieldCheck,
};

export const ScoutPipelineSVG = memo(function ScoutPipelineSVG({
    activeStepId,
    onSelectStep,
}: ScoutPipelineSVGProps) {
    const activeIndex = COGNITIVE_STEPS.findIndex((s) => s.id === activeStepId);
    const progressPercent = activeIndex >= 0 ? (activeIndex / (COGNITIVE_STEPS.length - 1)) * 100 : 0;

    return (
        <div className="w-full py-3">
            <div className="w-full flex items-start justify-between relative px-1 sm:px-6 pt-1 pb-2">
                {/* Connecting Track Line */}
                <div
                    aria-hidden="true"
                    className="absolute top-7 sm:top-9 left-6 right-6 sm:left-12 sm:right-12 h-1 bg-border/60 -translate-y-1/2 -z-10 rounded-full"
                />

                {/* Active Progress Beam */}
                <div
                    aria-hidden="true"
                    className="absolute top-7 sm:top-9 left-6 sm:left-12 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-400 -translate-y-1/2 -z-10 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                    style={{
                        width: `calc(${progressPercent}% * (100% - 3rem) / 100)`,
                    }}
                />

                {COGNITIVE_STEPS.map((step, idx) => {
                    const Icon = STEP_ICONS[step.id];
                    const isActive = activeStepId === step.id;
                    const isPassed = idx <= activeIndex;

                    return (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => onSelectStep(step.id)}
                            className={cn(
                                "group relative flex flex-col items-center p-1 sm:p-2 rounded-2xl transition-all duration-300 cursor-pointer min-h-[44px]",
                                isActive ? "scale-105" : "hover:scale-102"
                            )}
                        >
                            {/* Step Node Icon Container (40px mobile / 56px desktop) */}
                            <div
                                className={cn(
                                    "flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl border-2 transition-all duration-300 shadow-md relative z-10",
                                    isActive
                                        ? "bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                        : isPassed
                                        ? "bg-purple-500/10 border-purple-500/50 text-purple-600 dark:text-purple-300"
                                        : "bg-slate-100 dark:bg-card border-slate-200 dark:border-border text-slate-600 dark:text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden="true" />
                            </div>

                            {/* Spacer */}
                            <div className="h-2 sm:h-4 w-full pointer-events-none" />

                            {/* Step Title & Number */}
                            <div className="text-center space-y-0.5">
                                <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase block">
                                    0{step.number}
                                </span>
                                <span className={cn("text-[10px] sm:text-xs font-bold font-mono transition-colors block leading-tight", isActive ? "text-foreground" : "text-slate-600 dark:text-muted-foreground group-hover:text-foreground")}>
                                    {step.title}
                                </span>
                            </div>

                            {/* Pulse ring for active step */}
                            {isActive && (
                                <span
                                    aria-hidden="true"
                                    className="absolute top-1 sm:top-2 h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl border border-purple-500/60 animate-ping pointer-events-none"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
});
