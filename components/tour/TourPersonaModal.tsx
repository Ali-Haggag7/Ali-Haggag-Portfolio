"use client";

import { memo, useEffect, useRef } from "react";
import { TOUR_PERSONAS, type TourPersona } from "./tourData";
import { Sparkles, X, Briefcase, Cpu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelectPersona: (persona: TourPersona) => void;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const TourPersonaModal = memo(function TourPersonaModal({
    isOpen,
    onClose,
    onSelectPersona,
}: Props) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Focus trap & Escape key listener
    useEffect(() => {
        if (!isOpen) return;

        const prevFocus = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key !== "Tab") return;

            const focusable = Array.from(
                dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
            );
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            prevFocus?.focus();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tour-persona-modal-title"
                tabIndex={-1}
                className="relative w-full max-w-2xl rounded-3xl border border-[hsl(var(--accent-purple)/0.4)] cyber-card tactical-corner-reticles p-6 sm:p-8 md:p-10 shadow-2xl space-y-6 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Close modal"
                >
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Header */}
                <div className="space-y-3 text-left">
                    <div className="flex items-center gap-2">
                        <span
                            className="hud-tag"
                            style={{
                                color: "hsl(var(--accent-purple))",
                                borderColor: "hsl(var(--accent-purple) / 0.4)",
                                backgroundColor: "hsl(var(--accent-purple) / 0.12)",
                            }}
                        >
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                            INTERACTIVE AI TOUR GUIDE
                        </span>
                    </div>

                    <h3
                        id="tour-persona-modal-title"
                        className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-foreground"
                    >
                        Choose Your Tour Experience 🎮
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
                        Select a guided path tailored to your role. The AI Tour Guide will auto-navigate and highlight key technical proof points.
                    </p>
                </div>

                {/* Persona Cards List */}
                <div className="grid grid-cols-1 gap-4 pt-2">
                    {TOUR_PERSONAS.map((persona) => {
                        const isRecruiter = persona.id === "recruiter";
                        const accentColor = isRecruiter
                            ? "hsl(var(--accent-blue))"
                            : "hsl(var(--accent-purple))";

                        return (
                            <div
                                key={persona.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => onSelectPersona(persona)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onSelectPersona(persona);
                                    }
                                }}
                                className={cn(
                                    "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 rounded-2xl border border-border/80 cyber-card cyber-card-interactive tactical-corner-reticles cursor-pointer transition-all duration-300",
                                    "hover:border-[hsl(var(--accent-purple)/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                )}
                            >
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div
                                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-transform group-hover:scale-105 shadow-sm"
                                        style={{
                                            color: accentColor,
                                            borderColor: `color-mix(in srgb, ${accentColor} 40%, transparent)`,
                                            backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                                        }}
                                    >
                                        {isRecruiter ? (
                                            <Briefcase className="h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Cpu className="h-6 w-6" aria-hidden="true" />
                                        )}
                                    </div>

                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <h4 className="text-base sm:text-lg font-bold font-display text-foreground tracking-tight">
                                                {persona.title}
                                            </h4>
                                            <span
                                                className="hud-tag"
                                                style={{
                                                    color: accentColor,
                                                    borderColor: `color-mix(in srgb, ${accentColor} 40%, transparent)`,
                                                    backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                                                }}
                                            >
                                                {persona.badge}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                                            {persona.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="self-stretch sm:self-center flex items-center justify-end pt-2 sm:pt-0">
                                    <span
                                        className="inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all duration-300 border shadow-sm group-hover:scale-105"
                                        style={{
                                            color: accentColor,
                                            borderColor: `color-mix(in srgb, ${accentColor} 40%, transparent)`,
                                            backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                                        }}
                                    >
                                        <span>Start Tour</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Keyboard Shortcuts Footer */}
                <div className="pt-2 text-center text-xs font-mono text-muted-foreground flex flex-wrap items-center justify-center gap-2">
                    <span>Keyboard shortcuts during tour:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/60 border border-border text-[11px] font-bold text-foreground">
                        Space / →
                    </span>
                    <span>Next step ·</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/60 border border-border text-[11px] font-bold text-foreground">
                        Esc
                    </span>
                    <span>Exit</span>
                </div>
            </div>
        </div>
    );
});
