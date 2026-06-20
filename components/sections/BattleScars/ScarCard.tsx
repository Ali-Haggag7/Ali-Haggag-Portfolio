"use client";

import { memo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown, Eye, Crosshair, Wrench, Clock, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scar, Severity } from "./scars.data";

// Expand animation: opacity + translateY only — never height (height:0→auto
// forces a layout recalculation every frame; translateY is composite-only).
const EXPAND_VARIANTS: Variants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.14, ease: "easeIn" } },
};

// Severity → CSS variable. No hardcoded hex anywhere in the component.
const SEVERITY_VAR: Record<Severity, string> = {
    critical: "var(--scar-critical)",
    high: "var(--scar-high)",
    medium: "var(--scar-medium)",
};

const SEVERITY_LABEL: Record<Severity, string> = {
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
};

// The three-line incident summary — each line labelled, always visible.
const SUMMARY_LINES = [
    { icon: Eye, label: "SYMPTOM", key: "symptom" },
    { icon: Crosshair, label: "CAUSE", key: "rootCause" },
    { icon: Wrench, label: "FIX", key: "solution" },
] as const;

interface Props {
    scar: Scar;
    index: number;
    isExpanded: boolean;
    onToggle: () => void; // Pre-bound by parent — no id needed here
    isMobile: boolean;
}

export const ScarCard = memo(function ScarCard({ scar, index, isExpanded, onToggle, isMobile }: Props) {
    const Icon = scar.icon;
    const severityColor = SEVERITY_VAR[scar.severity];

    // Shared expanded body — reused by the Framer (desktop) and CSS (mobile) paths.
    const detailBody = (
        <div className="px-6 pb-6 pt-2">
            <div className="border-t border-border/60 pt-5">
                <div className="flex flex-wrap gap-2 mb-5">
                    {scar.badges.map((badge) => (
                        <span
                            key={badge}
                            className="px-3 py-1 text-xs font-mono font-medium bg-muted text-muted-foreground rounded-full border border-border"
                        >
                            {badge}
                        </span>
                    ))}
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Incident Report
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed mb-4">{scar.problem}</p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Resolution Impact
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{scar.impact}</p>

                {scar.codeSnippet && (
                    <div className="mt-5 rounded-xl overflow-hidden border" style={{ borderColor: "var(--scar-code-border)" }}>
                        <div
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-wider"
                            style={{
                                backgroundColor: "var(--scar-code-bg)",
                                color: "var(--scar-code-fg)",
                                borderBottom: "1px solid var(--scar-code-border)",
                            }}
                        >
                            <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                            key fix
                        </div>
                        <pre
                            className="px-4 py-4 text-xs leading-relaxed overflow-x-auto font-mono"
                            style={{ backgroundColor: "var(--scar-code-bg)", color: "var(--scar-code-fg)" }}
                        >
                            <code>{scar.codeSnippet}</code>
                        </pre>
                    </div>
                )}

                <div className="mt-5 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="uppercase tracking-wider">Time to solve:</span>
                    <span className="font-bold text-foreground">{scar.timeToSolve}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div
            id={`scar-card-${scar.id}`}
            className={cn(
                "group relative rounded-2xl border overflow-hidden",
                "transition-[border-color,background-color,box-shadow] duration-200",
                isExpanded ? "bg-card shadow-lg" : "bg-background border-border hover:bg-muted/10"
            )}
            style={
                isExpanded
                    ? { borderColor: severityColor, boxShadow: `0 10px 30px -12px ${severityColor}55` }
                    : undefined
            }
        >
            {/* Severity accent rail on the left edge */}
            <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-1"
                style={{ backgroundColor: severityColor }}
            />

            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${scar.title}`}
                className="w-full text-left p-6 pl-7 cursor-pointer
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-inset"
                style={{ minHeight: "44px" }}
            >
                {/* Header row: icon + project + title  /  severity badge */}
                <div className="flex items-start gap-4">
                    <div
                        className="flex items-center justify-center w-12 h-12 shrink-0 rounded-xl transition-colors duration-200"
                        style={{
                            backgroundColor: isExpanded ? `${severityColor}1a` : undefined,
                            color: isExpanded ? severityColor : undefined,
                        }}
                    >
                        <Icon
                            className={cn("w-6 h-6", !isExpanded && "text-muted-foreground group-hover:text-foreground")}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-mono text-muted-foreground mb-1">{scar.project}</p>
                        <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug">{scar.title}</h3>
                    </div>

                    {/* Severity pill (top-right), color-coded via CSS variable */}
                    <span
                        className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border"
                        style={{
                            color: severityColor,
                            borderColor: `${severityColor}66`,
                            backgroundColor: `${severityColor}14`,
                        }}
                    >
                        {SEVERITY_LABEL[scar.severity]}
                    </span>
                </div>

                {/* Three-line summary: SYMPTOM → CAUSE → FIX */}
                <div className="mt-5 space-y-2.5">
                    {SUMMARY_LINES.map(({ icon: LineIcon, label, key }) => (
                        <div key={label} className="grid grid-cols-[88px_1fr] gap-3 items-start">
                            <span
                                className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider pt-0.5"
                                style={{ color: label === "FIX" ? "var(--scar-medium)" : severityColor }}
                            >
                                <LineIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                {label}
                            </span>
                            <span className="text-sm text-muted-foreground leading-relaxed">{scar[key]}</span>
                        </div>
                    ))}
                </div>

                {/* Expand affordance */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-foreground/70" style={{ minHeight: "44px" }}>
                    {isExpanded ? "Hide technical detail" : "Read the post-mortem"}
                    <ChevronDown
                        className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")}
                        aria-hidden="true"
                    />
                </div>
            </button>

            {/* Expanded detail: Framer Motion on desktop, pure CSS transition on mobile */}
            {isMobile ? (
                <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                >
                    <div className="overflow-hidden">{isExpanded && detailBody}</div>
                </div>
            ) : (
                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            variants={EXPAND_VARIANTS}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{ willChange: "transform, opacity" }}
                        >
                            {detailBody}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
});
