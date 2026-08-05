"use client";

import { useEffect, useRef, memo } from "react";
import { Download, ExternalLink, X, FileText, CheckCircle2, ShieldCheck } from "lucide-react";

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="live-cv-title"
                className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 md:p-8 shadow-2xl outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                        <FileText className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2" aria-hidden="true">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                                Living Technical Profile
                            </span>
                        </div>
                        <h3 id="live-cv-title" className="text-xl font-bold text-foreground tracking-tight mt-0.5">
                            Ali Haggag — Live CV
                        </h3>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    This portfolio is continuously synced with Ali&apos;s living technical profile. Every project detail, metric, and production incident in this site reflects the latest state of his production systems.
                </p>

                {/* Highlights */}
                <div className="space-y-2.5 mb-6 text-sm text-foreground/90">
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
                        <span>Last updated: <strong className="text-foreground">August 2026</strong></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" aria-hidden="true" />
                        <span>Format: 9-page battle-tested technical war journal</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
                        <span>Covers: System design, AliScript DSL, Scout AI agent, 30+ scars</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <a
                        href="/live CV.pdf"
                        download="Ali_Haggag_Live_CV.pdf"
                        className="flex-1 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                    >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Download Live CV (PDF)
                    </a>
                    <a
                        href="/live_CV_pro.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 font-semibold text-sm text-foreground hover:bg-muted/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                    >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        View HTML Version
                    </a>
                </div>
            </div>
        </div>
    );
});
