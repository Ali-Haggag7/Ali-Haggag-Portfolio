"use client";

import { memo } from "react";
import { type TourPersona } from "./tourData";
import { Bot, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    persona: TourPersona;
    currentStepIndex: number;
    onNext: () => void;
    onPrev: () => void;
    onEndTour: () => void;
}

export const TourHUDOverlay = memo(function TourHUDOverlay({
    persona,
    currentStepIndex,
    onNext,
    onPrev,
    onEndTour,
}: Props) {
    const step = persona.steps[currentStepIndex];
    if (!step) return null;

    const totalSteps = persona.steps.length;
    const isFirst = currentStepIndex === 0;
    const isLast = currentStepIndex === totalSteps - 1;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] w-[92%] max-w-xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="relative rounded-3xl border border-purple-500/50 bg-card/95 backdrop-blur-2xl p-5 md:p-6 shadow-[0_20px_50px_rgba(168,85,247,0.25)] space-y-4 text-foreground font-mono">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                            <Bot className="h-5 w-5 animate-pulse" aria-hidden="true" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                AI Tour Guide
                                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                                    Step {currentStepIndex + 1} of {totalSteps}
                                </span>
                            </span>
                            <span className="text-[11px] text-muted-foreground block">
                                {persona.title}
                            </span>
                        </div>
                    </div>

                    {/* Exit Button */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onEndTour}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label="Exit Tour"
                            title="Exit Tour (Esc)"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Step Content */}
                <div className="space-y-3">
                    <h4 className="text-base font-bold font-display text-foreground tracking-tight">
                        {step.title}
                    </h4>
                    <div
                        dir="ltr"
                        className="text-xs md:text-sm text-foreground/90 leading-relaxed p-4 rounded-2xl border border-border/80 bg-muted/20 backdrop-blur-md text-left"
                    >
                        {step.commentary}
                    </div>

                    {step.actionHint && (
                        <div className="pt-2 mt-4 flex items-center">
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--scar-medium)] bg-[color-mix(in_srgb,var(--scar-medium)_12%,transparent)] px-4 py-2 rounded-xl border border-[color-mix(in_srgb,var(--scar-medium)_35%,transparent)] shadow-sm animate-bounce">
                                <Sparkles className="h-4 w-4 text-[var(--scar-medium)] shrink-0" aria-hidden="true" />
                                <span>{step.actionHint}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls Row */}
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <button
                        type="button"
                        onClick={onPrev}
                        disabled={isFirst}
                        className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[44px]",
                            isFirst
                                ? "opacity-30 cursor-not-allowed text-muted-foreground border border-transparent"
                                : "bg-muted/40 border border-border text-foreground hover:bg-muted"
                        )}
                    >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        <span>Previous</span>
                    </button>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-1.5">
                        {persona.steps.map((_, idx) => (
                            <span
                                key={idx}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    idx === currentStepIndex
                                        ? "w-6 bg-[hsl(var(--accent-purple))] shadow-[0_0_10px_hsl(var(--accent-purple)/0.5)]"
                                        : "w-2 bg-border/60"
                                )}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={isLast ? onEndTour : onNext}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider bg-[hsl(var(--accent-purple))] text-white shadow-md shadow-[hsl(var(--accent-purple)/0.3)] hover:opacity-90 transition-all cursor-pointer min-h-[44px]"
                    >
                        <span>{isLast ? "Finish Tour" : "Next Step"}</span>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
});
