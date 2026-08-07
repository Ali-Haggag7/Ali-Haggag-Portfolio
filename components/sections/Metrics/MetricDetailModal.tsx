"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { X, Cpu, CheckCircle2 } from "lucide-react";
import type { MetricItem } from "./metrics.data";

interface MetricDetailModalProps {
    metric: MetricItem;
    onClose: () => void;
}

export function MetricDetailModal({ metric, onClose }: MetricDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // ── Drag-to-dismiss gesture on mobile ──
    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.y > 80 || info.velocity.y > 300) {
            onClose();
        }
    };

    // ── Keyboard Accessibility: Escape listener & Focus Trap ──
    useEffect(() => {
        closeBtnRef.current?.focus();

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

                const firstEl = focusables[0];
                const lastEl = focusables[focusables.length - 1];

                if (e.shiftKey && document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                } else if (!e.shiftKey && document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const Icon = metric.icon;
    const { detail } = metric;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className={
                isMobile
                    ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-md overflow-hidden"
                    : "fixed inset-0 z-50 bg-background/80 backdrop-blur-md overflow-hidden flex items-center justify-center p-6"
            }
        >
            <motion.div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="metric-modal-title"
                drag={isMobile ? "y" : false}
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.8 }}
                onDragEnd={isMobile ? handleDragEnd : undefined}
                initial={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
                animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={isMobile ? { y: "100%", opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
                transition={
                    isMobile
                        ? { type: "spring", stiffness: 350, damping: 32 }
                        : { type: "spring", stiffness: 350, damping: 28 }
                }
                onClick={(e) => e.stopPropagation()}
                className={
                    isMobile
                        ? "max-h-[90vh] w-full overflow-y-auto overflow-x-hidden custom-scrollbar rounded-t-[28px] rounded-b-none bg-card p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                        : "w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar rounded-2xl border border-border/80 bg-card p-8 shadow-2xl backdrop-blur-2xl cyber-card tactical-corner-reticles"
                }
                style={
                    isMobile
                        ? {
                              position: "fixed",
                              left: 0,
                              right: 0,
                              bottom: 0,
                              margin: 0,
                              borderTop: `3px solid ${metric.accentVar}`,
                              borderLeft: "none",
                              borderRight: "none",
                              borderBottom: "none",
                          }
                        : { borderTopWidth: "3px", borderTopColor: metric.accentVar }
                }
            >
                {/* iOS Native Bottom Sheet Drag Handle — Mobile & Tablet only */}
                {isMobile && (
                    <div
                        aria-hidden="true"
                        className="flex flex-col items-center justify-center pt-1 pb-4 -mt-1 cursor-grab active:cursor-grabbing touch-none"
                    >
                        <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
                    </div>
                )}

                {/* Background ambient accent glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: metric.accentVar }}
                />

                {/* Close Button — 44x44px touch target */}
                <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close details modal"
                    className="absolute top-4 right-4 lg:top-5 lg:right-5 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer z-10"
                >
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>

                {/* Modal Header Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-3 pr-10">
                    <span
                        className="hud-tag"
                        style={{
                            color: metric.accentVar,
                            borderColor: `color-mix(in srgb, ${metric.accentVar} 40%, transparent)`,
                            backgroundColor: `color-mix(in srgb, ${metric.accentVar} 12%, transparent)`,
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metric.accentVar }} />
                        {metric.category.toUpperCase()} DOSSIER
                    </span>
                    <span className="text-xs font-mono text-muted-foreground border border-border/50 bg-background/50 px-2.5 py-0.5 rounded-full max-w-[200px] truncate">
                        {detail.project}
                    </span>
                </div>

                {/* Metric Hero Number & Icon */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                    <div className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight flex items-baseline gap-1">
                        {metric.prefix && (
                            <span style={{ color: metric.accentVar }}>{metric.prefix}</span>
                        )}
                        <span className="text-foreground">{metric.value}</span>
                        {metric.suffix && (
                            <span style={{ color: metric.accentVar }}>{metric.suffix}</span>
                        )}
                    </div>
                    <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-background/60"
                        style={{ color: metric.accentVar }}
                    >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                </div>

                {/* Title & Description */}
                <h3 id="metric-modal-title" className="text-lg sm:text-xl font-bold font-display text-foreground mb-2 leading-snug">
                    {detail.headline}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                    {detail.description}
                </p>

                {/* Key Technical Highlights */}
                <div className="mb-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground uppercase tracking-wider mb-2">
                        <Cpu className="h-3.5 w-3.5" style={{ color: metric.accentVar }} aria-hidden="true" />
                        <span>System Architecture Evidence</span>
                    </div>
                    <ul className="space-y-2">
                        {detail.highlights.map((point) => (
                            <li key={point} className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
                                <CheckCircle2
                                    className="h-4 w-4 shrink-0 mt-0.5 opacity-80"
                                    style={{ color: metric.accentVar }}
                                    aria-hidden="true"
                                />
                                <span className="break-words">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tech Stack Pills */}
                <div>
                    <span className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Technologies & Infrastructure
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-w-full overflow-hidden">
                        {detail.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="rounded-xl border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-mono font-medium text-foreground break-all max-w-full"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
