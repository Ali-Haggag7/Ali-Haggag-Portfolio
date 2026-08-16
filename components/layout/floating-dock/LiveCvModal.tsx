"use client";

import { useEffect, useRef, memo } from "react";
import { Download, ExternalLink, X, FileText, ShieldCheck, Flame, Cpu, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Official Resume SVG from public/skills/resume.svg
function ResumeSkillIcon({ className }: { className?: string }) {
    return (
        <div
            className={cn("w-6 h-6 bg-emerald-500 dark:bg-emerald-400 transition-colors duration-300", className)}
            style={{
                maskImage: "url(/skills/resume.svg)",
                WebkitMaskImage: "url(/skills/resume.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
            }}
            aria-hidden="true"
        />
    );
}

interface LiveCvModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LiveCvModal = memo(function LiveCvModal({ isOpen, onClose }: LiveCvModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Escape key + Focus Trap
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (e.key === "Tab" && modalRef.current) {
                const focusables = modalRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Auto focus modal wrapper
        const timer = setTimeout(() => {
            modalRef.current?.focus();
        }, 50);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearTimeout(timer);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            {/* Ambient Multi-Hue Holographic Glow */}
            <div
                aria-hidden="true"
                className="absolute inset-0 max-w-lg mx-auto my-auto h-[480px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-purple-500/20 blur-3xl pointer-events-none -z-10"
            />

            <div
                ref={modalRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="live-cv-title"
                className={cn(
                    "relative w-full max-w-xl rounded-3xl border border-emerald-500/30 dark:border-white/15",
                    "bg-card/95 dark:bg-card/90 backdrop-blur-2xl p-6 sm:p-8",
                    "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_35px_rgba(16,185,129,0.12)]",
                    "outline-none tactical-corner-reticles animate-in zoom-in-95 duration-300 overflow-hidden"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top Subtle Animated Accent Line */}
                <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500 animate-pulse"
                />

                {/* Close button with tactile hover */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close Live CV Modal"
                    className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-background/80 text-muted-foreground transition-all duration-300 hover:text-foreground hover:rotate-90 hover:scale-105 hover:border-foreground/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer shadow-sm"
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>

                {/* Header Row */}
                <div className="flex items-start gap-4 mb-5 pr-10">
                    <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.2),inset_0_0_12px_rgba(16,185,129,0.15)]">
                        <ResumeSkillIcon className="w-6 h-6" />
                        {/* Live Radar Pulse Dot */}
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                LIVING TECHNICAL PROFILE // PROD-SYNCED
                            </span>
                        </div>
                        <h3 id="live-cv-title" className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight mt-1">
                            Ali Haggag — Live CV &amp; War Journal
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Continuously verified against real production commits &amp; architecture metrics.
                        </p>
                    </div>
                </div>

                {/* Telemetry Feature Bento (3 High-Tech Mini Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
                    {/* Bento 1 */}
                    <div className="group/bento flex flex-col p-3 rounded-xl border border-border/80 bg-muted/20 dark:bg-card/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-200">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                SPEC // 9 PAGES
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 group-hover/bento:scale-110 transition-transform" />
                        </div>
                        <span className="text-xs font-bold text-foreground mb-0.5">War Journal PDF</span>
                        <span className="text-[11px] text-muted-foreground leading-snug">
                            Deep system designs, 20 TPS physics &amp; compilers.
                        </span>
                    </div>

                    {/* Bento 2 */}
                    <div className="group/bento flex flex-col p-3 rounded-xl border border-border/80 bg-muted/20 dark:bg-card/40 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-200">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                SCARS // 30+ POST-MORTEMS
                            </span>
                            <Flame className="w-3.5 h-3.5 text-blue-500 group-hover/bento:scale-110 transition-transform" />
                        </div>
                        <span className="text-xs font-bold text-foreground mb-0.5">Battle Autopsies</span>
                        <span className="text-[11px] text-muted-foreground leading-snug">
                            Symptom &rarr; Root Cause &rarr; Permanent Fixes documented.
                        </span>
                    </div>

                    {/* Bento 3 */}
                    <div className="group/bento flex flex-col p-3 rounded-xl border border-border/80 bg-muted/20 dark:bg-card/40 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-200">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                                MIRROR // AI &amp; ATS
                            </span>
                            <Cpu className="w-3.5 h-3.5 text-purple-500 group-hover/bento:scale-110 transition-transform" />
                        </div>
                        <span className="text-xs font-bold text-foreground mb-0.5">Interactive HTML</span>
                        <span className="text-[11px] text-muted-foreground leading-snug">
                            Machine-readable format for recruiters &amp; AI scrapers.
                        </span>
                    </div>
                </div>

                {/* Live Build Ticker Bar */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/30 dark:bg-muted/15 border border-border/60 mb-6 text-[11px] font-mono text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>SHA: 8f4e2b09 · Updated August 2026</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Check className="w-3 h-3" />
                        <span>0 Type Errors</span>
                    </div>
                </div>

                {/* Actions Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Primary Download Button */}
                    <a
                        href="/Ali_Haggag_CV.pdf"
                        download="Ali_Haggag_FullStack_Live_CV.pdf"
                        className={cn(
                            "group flex min-h-[48px] items-center justify-between px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-white select-none cursor-pointer",
                            "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600",
                            "shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.5)]",
                            "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        )}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <Download className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
                            <span className="truncate whitespace-nowrap">Download CV</span>
                        </div>
                        <span className="font-mono text-[10px] bg-black/25 px-2 py-0.5 rounded-full border border-white/20 shrink-0 whitespace-nowrap">
                            PDF · 1.4 MB
                        </span>
                    </a>

                    {/* Secondary HTML Mirror Button */}
                    <a
                        href="/live_CV_pro.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "group flex min-h-[48px] items-center justify-between px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm text-foreground select-none cursor-pointer",
                            "border border-border/80 bg-background/80 dark:bg-card/80 backdrop-blur-md",
                            "hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm",
                            "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        )}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <ExternalLink className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                            <span className="truncate whitespace-nowrap">View HTML</span>
                        </div>
                        <span className="font-mono text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/60 shrink-0 whitespace-nowrap">
                            Live Mirror
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
});
