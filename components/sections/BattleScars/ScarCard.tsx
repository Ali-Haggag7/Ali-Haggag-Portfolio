"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown, Eye, Crosshair, Wrench, Clock, Terminal, ArrowDown, Lightbulb, Share2, Check } from "lucide-react";
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
    const [copied, setCopied] = useState(false);
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
                            className="hud-tag"
                            style={{
                                color: "hsl(var(--muted-foreground))",
                                borderColor: "hsl(var(--border) / 0.8)",
                                backgroundColor: "hsl(var(--muted) / 0.5)",
                            }}
                        >
                            {badge}
                        </span>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border border-border/70 bg-muted/10 p-4 space-y-1">
                        <h4 className="text-[11px] font-bold font-display uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-blue))]" />
                            Incident Report
                        </h4>
                        <p className="text-sm font-medium text-foreground/90 leading-relaxed">{scar.problem}</p>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-muted/10 p-4 space-y-1">
                        <h4 className="text-[11px] font-bold font-display uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-emerald))]" />
                            Resolution Impact
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{scar.impact}</p>

                        {scar.metrics && Object.values(scar.metrics).some(Boolean) && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {scar.metrics.cpuReduction && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold bg-muted/40 text-foreground rounded border border-border/60">
                                        <ArrowDown className="w-3 h-3 text-[var(--scar-medium)] shrink-0" aria-hidden="true" />
                                        <span>CPU: {scar.metrics.cpuReduction}</span>
                                    </span>
                                )}
                                {scar.metrics.memorySaved && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold bg-muted/40 text-foreground rounded border border-border/60">
                                        <ArrowDown className="w-3 h-3 text-[var(--scar-medium)] shrink-0" aria-hidden="true" />
                                        <span>RAM: {scar.metrics.memorySaved}</span>
                                    </span>
                                )}
                                {scar.metrics.latencyImprovement && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold bg-muted/40 text-foreground rounded border border-border/60">
                                        <ArrowDown className="w-3 h-3 text-[var(--scar-medium)] shrink-0" aria-hidden="true" />
                                        <span>Latency: {scar.metrics.latencyImprovement}</span>
                                    </span>
                                )}
                                {scar.metrics.incidentsPrevented && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold bg-muted/40 text-foreground rounded border border-border/60">
                                        <ArrowDown className="w-3 h-3 text-[var(--scar-medium)] shrink-0" aria-hidden="true" />
                                        <span>Incidents Blocked: {scar.metrics.incidentsPrevented}</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {scar.codeSnippet && (
                    <div className="mt-4 rounded-xl overflow-hidden border" style={{ borderColor: "var(--scar-code-border)" }}>
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

                {scar.investigationFlow && scar.investigationFlow.length > 0 && (
                    <div className="mt-4 rounded-xl border border-border/70 bg-muted/10 p-4">
                        <h4 className="text-[11px] font-bold font-display uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--scar-medium)]" />
                            Investigation Flow
                        </h4>
                        <div className="relative border-l border-[var(--scar-medium)]/40 ml-2 pl-4 space-y-3.5">
                            {scar.investigationFlow.map((step, idx) => (
                                <div key={idx} className="relative">
                                    <span 
                                        className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[var(--scar-medium)] bg-background"
                                        aria-hidden="true"
                                    />
                                    <div className="text-xs font-mono">
                                        <span className="text-[var(--scar-medium)] font-bold mr-1.5 uppercase tracking-wider text-[10px]">{step.label}</span>
                                        <span className="text-foreground/90 leading-relaxed font-medium">{step.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {scar.lessonLearned && (
                    <div className="mt-4 rounded-xl border border-l-4 border-border border-l-[var(--scar-medium)] bg-muted/20 p-4 shadow-sm space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="hud-tag" style={{ color: "var(--scar-medium)", backgroundColor: "color-mix(in srgb, var(--scar-medium) 15%, transparent)", borderColor: "color-mix(in srgb, var(--scar-medium) 30%, transparent)" }}>
                                <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                                POST-MORTEM LESSON
                            </span>
                        </div>
                        <p className="text-xs md:text-sm font-medium italic text-foreground/90 leading-relaxed pl-0.5">
                            &quot;{scar.lessonLearned}&quot;
                        </p>
                    </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="uppercase tracking-wider">Time to solve:</span>
                    <span className="font-bold text-foreground">{scar.timeToSolve}</span>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            id={`scar-card-${scar.id}`}
            data-index={index}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "group relative rounded-2xl border overflow-hidden cyber-card tactical-corner-reticles",
                isExpanded ? "cyber-card-interactive shadow-2xl" : "hover:border-[hsl(var(--accent-purple)/0.4)]"
            )}
            style={
                isExpanded
                    ? { borderColor: severityColor, boxShadow: `0 12px 36px -10px ${severityColor}45` }
                    : undefined
            }
        >
            {/* Severity accent rail on the left edge */}
            <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-1"
                style={{ backgroundColor: severityColor }}
            />

            <div
                role="button"
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggle();
                    }
                }}
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
                        <h3 className="text-lg md:text-xl font-bold font-display tracking-tight text-foreground leading-snug">{scar.title}</h3>
                    </div>

                    {/* Severity & Share buttons */}
                    <div className="shrink-0 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                const url = `${window.location.origin}${window.location.pathname}?scar=${scar.id}`;
                                navigator.clipboard.writeText(url);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            title="Copy link to this scar"
                            aria-label="Copy link to this scar"
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
                        >
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-[hsl(var(--accent-emerald))]" aria-hidden="true" />
                            ) : (
                                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                            )}
                        </button>

                        <span
                            className="hud-tag"
                            style={{
                                color: severityColor,
                                borderColor: `${severityColor}66`,
                                backgroundColor: `${severityColor}14`,
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: severityColor }} />
                            {SEVERITY_LABEL[scar.severity]}
                        </span>
                    </div>
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
            </div>

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
        </motion.div>
    );
});
