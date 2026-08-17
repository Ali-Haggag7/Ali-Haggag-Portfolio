"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
import { type TourPersona } from "./tourData";
import { TourPersonaModal } from "./TourPersonaModal";
import { SpotlightCutoutOverlay } from "./SpotlightCutoutOverlay";
import { Compass, Sparkles } from "lucide-react";

export const InteractiveTourGuide = memo(function InteractiveTourGuide() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePersona, setActivePersona] = useState<TourPersona | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Keyboard Listener
    useEffect(() => {
        if (!activePersona) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName ?? "")) return;

            if (e.key === "Escape") {
                setActivePersona(null);
                setCurrentStepIndex(0);
            } else if (e.key === "ArrowRight" || e.key === " ") {
                e.preventDefault();
                setCurrentStepIndex((prev) => Math.min(prev + 1, activePersona.steps.length - 1));
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activePersona]);

    const handleSelectPersona = useCallback((persona: TourPersona) => {
        setIsModalOpen(false);
        setActivePersona(persona);
        setCurrentStepIndex(0);
    }, []);

    const handleNext = useCallback(() => {
        if (!activePersona) return;
        setCurrentStepIndex((prev) => Math.min(prev + 1, activePersona.steps.length - 1));
    }, [activePersona]);

    const handlePrev = useCallback(() => {
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const handleEndTour = useCallback(() => {
        setActivePersona(null);
        setCurrentStepIndex(0);
    }, []);

    return (
        <>
            {/* Floating Tour Trigger Button — desktop only to keep mobile screen 100% unobscured */}
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                title="Start Guided AI Portfolio Tour"
                aria-label="Start Guided AI Portfolio Tour"
                className={cn(
                    "hidden md:inline-flex fixed bottom-6 left-6 z-45 items-center gap-2 rounded-full border border-purple-500/40 dark:border-[hsl(var(--accent-purple)/0.4)]",
                    "bg-background/95 dark:bg-card/95 backdrop-blur-xl px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider",
                    "text-purple-600 dark:text-[hsl(var(--accent-purple))] shadow-xl shadow-purple-500/10 dark:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
                    "hover:bg-purple-500/10 dark:hover:bg-[hsl(var(--accent-purple)/0.15)] hover:border-purple-500/60 dark:hover:border-[hsl(var(--accent-purple)/0.6)] hover:scale-105 active:scale-95",
                    "transition-all duration-300 cursor-pointer animate-in fade-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
            >
                <Compass className="h-4 w-4 text-purple-600 dark:text-[hsl(var(--accent-purple))]" aria-hidden="true" />
                <span>Guided Tour</span>
                <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-[hsl(var(--accent-purple))]" aria-hidden="true" />
            </button>

            {/* Persona Selection Modal */}
            <TourPersonaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectPersona={handleSelectPersona}
            />

            {/* Active Tour Spotlight Cutout & Speech Bubble Overlay */}
            {activePersona && (
                <SpotlightCutoutOverlay
                    persona={activePersona}
                    currentStepIndex={currentStepIndex}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onEndTour={handleEndTour}
                />
            )}
        </>
    );
});
