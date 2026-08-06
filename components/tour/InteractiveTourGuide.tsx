"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { type TourPersona } from "./tourData";
import { TourPersonaModal } from "./TourPersonaModal";
import { SpotlightCutoutOverlay } from "./SpotlightCutoutOverlay";
import { TourHUDOverlay } from "./TourHUDOverlay";
import { Compass, Sparkles } from "lucide-react";

export const InteractiveTourGuide = memo(function InteractiveTourGuide() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePersona, setActivePersona] = useState<TourPersona | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Scroll & spotlight are now handled inside SpotlightCutoutOverlay with proper timing.

    // Keyboard Listener
    useEffect(() => {
        if (!activePersona) return;

        const handleKeyDown = (e: KeyboardEvent) => {
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
            {/* Floating Tour Trigger Button — sits above the dock */}
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                title="Start Guided AI Portfolio Tour"
                aria-label="Start Guided AI Portfolio Tour"
                className="fixed bottom-4 md:bottom-6 left-4 md:left-6 z-50 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[hsl(var(--accent-purple)/0.4)] bg-card/90 backdrop-blur-xl px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider text-[hsl(var(--accent-purple))] shadow-xl hover:bg-[hsl(var(--accent-purple)/0.15)] hover:border-[hsl(var(--accent-purple)/0.6)] transition-all cursor-pointer animate-in fade-in duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Compass className="h-4 w-4 text-[hsl(var(--accent-purple))]" aria-hidden="true" />
                <span>Guided Tour</span>
                <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent-purple))]" aria-hidden="true" />
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
