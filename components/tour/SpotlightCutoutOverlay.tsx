"use client";

import { memo, useEffect, useState } from "react";
import { type TourPersona } from "./tourData";
import { useTypewriter } from "./typewriter";
import { Bot, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    persona: TourPersona;
    currentStepIndex: number;
    onNext: () => void;
    onPrev: () => void;
    onEndTour: () => void;
}

export const SpotlightCutoutOverlay = memo(function SpotlightCutoutOverlay({
    persona,
    currentStepIndex,
    onNext,
    onPrev,
    onEndTour,
}: Props) {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const step = persona.steps[currentStepIndex];
    const totalSteps = persona.steps.length;
    const isFirst = currentStepIndex === 0;
    const isLast = currentStepIndex === totalSteps - 1;

    const { displayedText, isDone } = useTypewriter(step?.commentary ?? "", 20);

    // Scroll target into view (centered) then measure its bounding rect
    useEffect(() => {
        if (!step) return;

        const el = document.getElementById(step.targetId);
        if (!el) {
            setTargetRect(null);
            return;
        }

        // Scroll to center or start of element, then measure after scroll settles
        el.scrollIntoView({ behavior: "smooth", block: step.targetId === "hero-terminal" ? "start" : "center" });

        // Immediate measurement
        setTargetRect(el.getBoundingClientRect());

        // Wait for smooth scroll animation to settle before re-measuring accurately
        const measureTimeout = setTimeout(() => {
            const rect = el.getBoundingClientRect();
            setTargetRect(rect);
        }, 500);

        // Live tracking on scroll and resize
        const updateRect = () => {
            setTargetRect(el.getBoundingClientRect());
        };
        window.addEventListener("scroll", updateRect, { passive: true });
        window.addEventListener("resize", updateRect, { passive: true });

        return () => {
            clearTimeout(measureTimeout);
            window.removeEventListener("scroll", updateRect);
            window.removeEventListener("resize", updateRect);
        };
    }, [step]);

    if (!step) return null;

    // Spotlight cutout geometry — 12px padding around the element
    const PAD = 12;
    const cutoutX = targetRect ? Math.max(0, targetRect.left - PAD) : window.innerWidth / 2 - 200;
    const cutoutY = targetRect ? Math.max(0, targetRect.top - PAD) : window.innerHeight / 2 - 150;
    const cutoutW = targetRect ? targetRect.width + PAD * 2 : 400;
    const cutoutH = targetRect ? targetRect.height + PAD * 2 : 300;

    return (
        <div className="fixed inset-0 z-[400] overflow-hidden pointer-events-none">
            {/* SVG Darkened Screen Mask with Cutout Spotlight Hole (Deep Game Tutorial Vignette) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto" aria-hidden="true">
                <defs>
                    <mask id="tour-spotlight-mask">
                        {/* Full white = fully darkened */}
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {/* Black cutout = crystal-clear transparent hole */}
                        <rect
                            x={cutoutX}
                            y={cutoutY}
                            width={cutoutW}
                            height={cutoutH}
                            rx="18"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.88)"
                    mask="url(#tour-spotlight-mask)"
                    onClick={onEndTour}
                />
            </svg>

            {/* Animated Game Tutorial Focus Reticle & Pulse Ring around Target Element */}
            {targetRect && (
                <div
                    style={{
                        left: `${cutoutX}px`,
                        top: `${cutoutY}px`,
                        width: `${cutoutW}px`,
                        height: `${cutoutH}px`,
                    }}
                    className="absolute pointer-events-none rounded-[18px] border-2 border-[hsl(var(--accent-purple))] shadow-[0_0_40px_hsl(var(--accent-purple)/0.7),inset_0_0_20px_hsl(var(--accent-purple)/0.25)] transition-all duration-300"
                >
                    {/* Game Tutorial "Interactive Target" Badge */}
                    <div className="absolute -top-7 left-4 px-2.5 py-0.5 rounded-md bg-[hsl(var(--accent-purple))] text-white font-mono text-[10px] font-bold tracking-wider flex items-center gap-1.5 shadow-lg animate-bounce">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>INTERACTIVE FOCUS ZONE</span>
                    </div>

                    {/* Corner Reticle Accents */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white rounded-tl-sm" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white rounded-tr-sm" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white rounded-bl-sm" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white rounded-br-sm" />
                </div>
            )}

            {/* Speech Bubble Card — fixed to bottom center of viewport with full pointer-events */}
            <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[420] w-[94%] max-w-xl animate-in slide-in-from-bottom-8 duration-300 pointer-events-auto">
                <div className="relative rounded-3xl border border-[hsl(var(--accent-purple)/0.5)] cyber-card tactical-corner-reticles p-5 md:p-6 shadow-2xl space-y-4 text-foreground bg-card/95 backdrop-blur-2xl">

                    {/* Header Row */}
                    <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--accent-purple)/0.15)] text-[hsl(var(--accent-purple))] border border-[hsl(var(--accent-purple)/0.3)] shadow-inner">
                                <Bot className="h-5 w-5 animate-pulse" aria-hidden="true" />
                            </div>
                            <div>
                                <div className="text-xs font-bold font-display text-foreground flex items-center gap-2">
                                    <span>Ali&apos;s AI Tour Guide</span>
                                    <span
                                        className="hud-tag"
                                        style={{
                                            color: "hsl(var(--accent-purple))",
                                            borderColor: "hsl(var(--accent-purple) / 0.4)",
                                            backgroundColor: "hsl(var(--accent-purple) / 0.12)",
                                        }}
                                    >
                                        Step {currentStepIndex + 1} of {totalSteps}
                                    </span>
                                </div>
                                <span className="text-[11px] text-muted-foreground block font-mono mt-0.5">
                                    {persona.title}
                                </span>
                            </div>
                        </div>

                        {/* Exit Button */}
                        <button
                            type="button"
                            onClick={onEndTour}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="Exit Tour"
                            title="Exit Tour (Esc)"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Step Title & Content */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold font-display tracking-tight text-foreground">
                                {step.title}
                            </h4>
                            <span className="hud-tag" style={{ color: "hsl(var(--muted-foreground))", backgroundColor: "hsl(var(--muted)/0.5)", borderColor: "hsl(var(--border)/0.6)" }}>
                                #{step.targetId}
                            </span>
                        </div>

                        {/* Typewriter Commentary */}
                        <div className="text-xs md:text-sm text-foreground/90 leading-relaxed p-4 rounded-2xl border border-border/80 bg-muted/20 backdrop-blur-md relative min-h-[64px]">
                            <span>{displayedText}</span>
                            {!isDone && (
                                <span className="inline-block w-1.5 h-4 ml-1 bg-[hsl(var(--accent-purple))] animate-pulse align-middle" />
                            )}
                        </div>

                        {/* Interactive Task Hint Badge — Safe Clearance Top Margin (mt-4 pt-1) to avoid collision during bounce */}
                        {step.actionHint && (
                            <div className="pt-2 mt-4 flex items-center">
                                <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--scar-medium)] bg-[color-mix(in_srgb,var(--scar-medium)_12%,transparent)] px-4 py-2 rounded-xl border border-[color-mix(in_srgb,var(--scar-medium)_35%,transparent)] shadow-sm animate-bounce">
                                    <Sparkles className="h-4 w-4 text-[var(--scar-medium)] shrink-0" aria-hidden="true" />
                                    <span>{step.actionHint}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Controls */}
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

                        {/* Step Progress Pills */}
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
        </div>
    );
});
