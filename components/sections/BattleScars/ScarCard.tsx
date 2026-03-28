"use client";

import { memo, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown, Activity, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scar } from "./scars.data";

// Stable variant objects — no new references on re-render.

const CARD_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay,
            duration: 0.3,
            ease: "easeOut"
        }
    }),
    exit: { opacity: 0, y: 10 }
};

const EXPAND_VARIANTS = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.12, ease: "easeIn" } },
} as const;

interface ScarCardProps {
    scar: Scar;
    index: number;
    isExpanded: boolean;
    onToggle: (id: string) => void;
}

export const ScarCard = memo(function ScarCard({
    scar,
    index,
    isExpanded,
    onToggle,
}: ScarCardProps) {
    const Icon = scar.icon;

    // Stable handler scoped to this card's id — never recreated unless scar.id changes.
    const handleToggle = useCallback(() => onToggle(scar.id), [onToggle, scar.id]);

    return (
        <motion.div
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
            <button
                type="button"
                onClick={handleToggle}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset cursor-pointer"
            >
                <div className="flex items-center gap-4 md:gap-6">
                    <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200 shrink-0",
                        isExpanded ? "bg-blue-500/10 text-blue-500" : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}>
                        <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-sm font-mono text-muted-foreground mb-1">{scar.project}</p>
                        <h3 className="text-lg md:text-xl font-bold text-foreground">{scar.title}</h3>
                    </div>
                </div>

                <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full shrink-0 bg-muted/50",
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
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-2">
                            <div className="flex flex-wrap gap-2 mb-6 md:ml-18">
                                {scar.badges.map((badge) => (
                                    <span
                                        key={badge}
                                        className="px-3 py-1 text-xs font-mono font-medium bg-muted text-muted-foreground rounded-full border border-border/50"
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:ml-18">
                                {[
                                    { icon: Activity, label: "The Bleed", text: scar.problem, color: "text-red-600 dark:text-red-500" },
                                    { icon: CheckCircle2, label: "The Cure", text: scar.solution, color: "text-emerald-600 dark:text-emerald-500" },
                                    { icon: Zap, label: "The Impact", text: scar.impact, color: "text-blue-600 dark:text-blue-500" },
                                ].map(({ icon: ColIcon, label, text, color }) => (
                                    <div key={label} className="space-y-3">
                                        <h4 className={cn("flex items-center gap-2 text-sm font-bold uppercase tracking-wider", color)}>
                                            <ColIcon className="w-4 h-4" aria-hidden="true" /> {label}
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});