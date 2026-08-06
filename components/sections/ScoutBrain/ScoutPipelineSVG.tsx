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
        <div className="w-full overflow-x-auto py-4">
            <div className="min-w-[640px] flex items-start justify-between relative px-6 pt-1 pb-2">
                {/* Connecting Track Line - Positioned with tight 4px gap below 56px icon boxes */}
                <div
                    aria-hidden="true"
                    className="absolute top-[76px] left-12 right-12 h-1 bg-border/60 -translate-y-1/2 -z-10 rounded-full"
                />

                {/* Active Progress Beam */}
                <div
                    aria-hidden="true"
                    className="absolute top-[70px] left-12 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-400 -translate-y-1/2 -z-10 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                    style={{
                        width: `calc(${progressPercent}% * (100% - 6rem) / 100)`,
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
                                "group relative flex flex-col items-center p-2 rounded-2xl transition-all duration-300 cursor-pointer min-h-[44px]",
                                isActive ? "scale-105" : "hover:scale-102"
                            )}
                        >
                            {/* Step Node Icon Container (56px) */}
                            <div
                                className={cn(
                                    "flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-md relative z-10",
                                    isActive
                                        ? "bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                        : isPassed
                                        ? "bg-purple-500/10 border-purple-500/50 text-purple-600 dark:text-purple-300"
                                        : "bg-slate-100 dark:bg-card border-slate-200 dark:border-border text-slate-600 dark:text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                                )}
                            >
                                <Icon className="h-6 w-6" aria-hidden="true" />
                            </div>

                            {/* 12px Spacer Div where track line passes through center (70px from top) */}
                            <div className="h-5 w-full pointer-events-none" />

                            {/* Step Title & Number */}
                            <div className="text-center space-y-0.5">
                                <span className="text-[10px] font-mono font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase block">
                                    Step 0{step.number}
                                </span>
                                <span className={cn("text-xs font-bold font-mono transition-colors block", isActive ? "text-foreground" : "text-slate-600 dark:text-muted-foreground group-hover:text-foreground")}>
                                    {step.title}
                                </span>
                            </div>

                            {/* Pulse ring for active step */}
                            {isActive && (
                                <span
                                    aria-hidden="true"
                                    className="absolute top-2 h-14 w-14 rounded-2xl border border-purple-500/60 animate-ping pointer-events-none"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
});
