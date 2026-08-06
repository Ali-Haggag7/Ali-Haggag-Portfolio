import { memo, useEffect, useRef } from "react";
import { TOUR_PERSONAS, type TourPersona } from "./tourData";
import { Sparkles, X, Briefcase, Cpu, ArrowRight, Gamepad2, Target, Compass } from "lucide-react";
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
            className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tour-persona-modal-title"
                tabIndex={-1}
                className="relative w-full max-h-[92vh] sm:max-h-[85vh] sm:max-w-2xl rounded-t-[32px] sm:rounded-3xl border-t sm:border border-purple-500/30 dark:border-[hsl(var(--accent-purple)/0.4)] cyber-card tactical-corner-reticles bg-background/95 dark:bg-card/95 backdrop-blur-2xl p-5 sm:p-8 md:p-10 shadow-2xl space-y-5 sm:space-y-6 focus:outline-none overflow-y-auto animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Native iOS Sheet Drag Handle (Mobile Only) */}
                <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-muted-foreground/30 mx-auto -mt-1 mb-1 shrink-0 sm:hidden" aria-hidden="true" />

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-500 hover:text-foreground dark:text-muted-foreground cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-slate-200 dark:border-border/60 bg-slate-100/80 dark:bg-muted/40 hover:bg-slate-200 dark:hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Close modal"
                >
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Header */}
                <div className="space-y-2.5 sm:space-y-3 text-left">
                    <div className="flex items-center gap-2">
                        <span
                            className="hud-tag"
                            style={{
                                color: "var(--tl-accent-purple)",
                                borderColor: "color-mix(in srgb, var(--tl-accent-purple) 40%, transparent)",
                                backgroundColor: "color-mix(in srgb, var(--tl-accent-purple) 12%, transparent)",
                            }}
                        >
                            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                            INTERACTIVE AI TOUR GUIDE
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h3
                            id="tour-persona-modal-title"
                            className="text-xl sm:text-3xl font-extrabold font-display tracking-tight text-foreground"
                        >
                            Choose Your Tour Experience
                        </h3>
                        <Gamepad2 className="h-6 w-6 text-purple-600 dark:text-[hsl(var(--accent-purple))]" aria-hidden="true" />
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground font-medium leading-relaxed max-w-xl">
                        Select a guided path tailored to your role. The AI Tour Guide will auto-navigate and highlight key technical proof points.
                    </p>
                </div>

                {/* Persona Cards List */}
                <div className="grid grid-cols-1 gap-3.5 sm:gap-4 pt-1">
                    {TOUR_PERSONAS.map((persona) => {
                        const isRecruiter = persona.id === "recruiter";
                        const accentColor = isRecruiter
                            ? "var(--tl-accent-blue)"
                            : "var(--tl-accent-purple)";

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
                                    "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-border/80 bg-slate-50/80 dark:bg-card/90 cyber-card cyber-card-interactive tactical-corner-reticles cursor-pointer transition-all duration-300",
                                    "hover:border-purple-500/60 dark:hover:border-[hsl(var(--accent-purple)/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                )}
                            >
                                <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                                    <div
                                        className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border transition-transform group-hover:scale-105 shadow-sm"
                                        style={{
                                            color: accentColor,
                                            borderColor: `color-mix(in srgb, ${accentColor} 40%, transparent)`,
                                            backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                                        }}
                                    >
                                        {isRecruiter ? (
                                            <Target className="h-6 w-6" aria-hidden="true" />
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
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground font-medium leading-relaxed">
                                            {persona.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="self-stretch sm:self-center flex items-center justify-end pt-1 sm:pt-0">
                                    <span
                                        className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all duration-300 border shadow-sm group-hover:scale-105"
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
                <div className="pt-2 text-center text-xs font-mono text-slate-600 dark:text-muted-foreground flex flex-wrap items-center justify-center gap-2">
                    <span>Keyboard shortcuts:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-200/80 dark:bg-muted/60 border border-slate-300 dark:border-border text-[11px] font-bold text-slate-800 dark:text-foreground">
                        Space / →
                    </span>
                    <span>Next ·</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-200/80 dark:bg-muted/60 border border-slate-300 dark:border-border text-[11px] font-bold text-slate-800 dark:text-foreground">
                        Esc
                    </span>
                    <span>Exit</span>
                </div>
            </div>
        </div>
    );
});
