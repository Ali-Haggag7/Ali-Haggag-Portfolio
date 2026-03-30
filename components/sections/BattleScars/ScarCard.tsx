"use client";

import { memo, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown, Activity, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scar } from "./scars.data";

const CARD_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (delay: number) => ({
        opacity: 1, y: 0,
        transition: { delay, duration: 0.3, ease: "easeOut" },
    }),
    exit: { opacity: 0, y: 10 },
};

// clip-path animates on the Composite layer only — zero Layout or Paint cost.
// height:0→auto forces layout recalculation on every frame, this doesn't.
const EXPAND_VARIANTS: Variants = {
    hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
    visible: {
        clipPath: "inset(0 0 0% 0)", opacity: 1,
        transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
        clipPath: "inset(0 0 100% 0)", opacity: 0,
        transition: { duration: 0.14, ease: [0.4, 0, 1, 0.6] },
    },
};

// Static config — not render logic. Defined here to avoid re-allocation.
const COLUMNS = [
    { icon: Activity, label: "The Bleed", key: "problem", color: "text-red-600 dark:text-red-500" },
    { icon: CheckCircle2, label: "The Cure", key: "solution", color: "text-emerald-600 dark:text-emerald-500" },
    { icon: Zap, label: "The Impact", key: "impact", color: "text-blue-600 dark:text-blue-500" },
] as const;

interface Props {
    scar: Scar;
    index: number;
    isExpanded: boolean;
    onToggle: () => void; // Pre-bound by parent — no id needed here
}

export const ScarCard = memo(function ScarCard({ scar, index, isExpanded, onToggle }: Props) {
    const Icon = scar.icon;

    return (
        <motion.div
            id={`scar-card-${scar.id}`}
            variants={CARD_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={index * 0.05}
            className={cn(
                "group rounded-2xl border overflow-hidden",
                "transition-[border-color,background-color,box-shadow] duration-200",
                isExpanded
                    ? "bg-card border-blue-500/50 shadow-lg shadow-blue-500/10"
                    : "bg-background border-border hover:border-blue-500/30 hover:bg-muted/10"
            )}
        >
            {/* CSS Grid eliminates the md:ml-18 magic-number alignment hack */}
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${scar.title}`}
                className="w-full grid grid-cols-[48px_1fr_auto] items-center gap-4 md:gap-6 p-6
                           text-left focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-blue-500 focus-visible:ring-inset cursor-pointer"
            >
                <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200",
                    isExpanded
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-muted/60 text-muted-foreground group-hover:text-foreground"
                )}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                </div>

                <div>
                    <p className="text-sm font-mono text-muted-foreground mb-1">{scar.project}</p>
                    <h3 className="text-lg md:text-xl font-bold text-foreground">{scar.title}</h3>
                </div>

                <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full bg-muted/50",
                    "transition-[transform,background-color,color] duration-200 will-change-transform",
                    isExpanded ? "rotate-180 bg-blue-500/10 text-blue-500" : "text-muted-foreground"
                )}>
                    <ChevronDown className="w-5 h-5" aria-hidden="true" />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        variants={EXPAND_VARIANTS}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Spacer col mirrors the icon column for natural text alignment */}
                        <div className="px-6 pb-6 pt-2 grid grid-cols-[48px_1fr] gap-x-4 md:gap-x-6">
                            <div aria-hidden="true" />
                            <div>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {scar.badges.map((badge) => (
                                        <span
                                            key={badge}
                                            className="px-3 py-1 text-xs font-mono font-medium
                                                        bg-muted text-muted-foreground rounded-full border border-border"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                    {COLUMNS.map(({ icon: ColIcon, label, key, color }) => (
                                        <div key={label} className="space-y-3">
                                            <h4 className={cn("flex items-center gap-2 text-sm font-bold uppercase tracking-wider", color)}>
                                                <ColIcon className="w-4 h-4" aria-hidden="true" />
                                                {label}
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {scar[key]}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});