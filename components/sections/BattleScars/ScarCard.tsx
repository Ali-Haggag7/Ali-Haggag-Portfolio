"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Activity, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scar } from "./scars.data";

interface ScarCardProps {
    scar: Scar;
    index: number;
    isExpanded: boolean;
    onToggle: (id: string) => void;
}

// memo - prevents all cards re-rendering when one is toggled
export const ScarCard = memo(function ScarCard({ scar, index, isExpanded, onToggle }: ScarCardProps) {
    const Icon = scar.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "group rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300 overflow-hidden transform-gpu",
                isExpanded
                    ? "bg-card border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]"
                    : "bg-background border-border hover:border-muted-foreground/30 hover:bg-muted/10"
            )}
        >
            <button
                type="button"
                onClick={() => onToggle(scar.id)}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
                <div className="flex items-center gap-4 md:gap-6">
                    <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300 shrink-0",
                        isExpanded ? "bg-blue-500/10 text-blue-600 dark:text-blue-500" : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}>
                        <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-sm font-mono text-muted-foreground mb-1">{scar.project}</p>
                        <h3 className="text-lg md:text-xl font-bold text-foreground">{scar.title}</h3>
                    </div>
                </div>
                <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 shrink-0 bg-muted/50 transform-gpu will-change-transform",
                    isExpanded ? "rotate-180 bg-blue-500/10 text-blue-600 dark:text-blue-500" : "text-muted-foreground"
                )}>
                    <ChevronDown className="w-5 h-5" aria-hidden="true" />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ willChange: "height, opacity" }}
                        className="transform-gpu"
                    >
                        <div className="px-6 pb-6 pt-2">
                            <div className="flex flex-wrap gap-2 mb-6 ml-0 md:ml-18">
                                {scar.badges.map((badge) => (
                                    <span key={badge} className="px-3 py-1 text-xs font-mono font-medium bg-muted text-muted-foreground rounded-full border border-border/50">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 ml-0 md:ml-18">
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-500 uppercase tracking-wider">
                                        <Activity className="w-4 h-4" aria-hidden="true" /> The Bleed
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{scar.problem}</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> The Cure
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{scar.solution}</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider">
                                        <Zap className="w-4 h-4" aria-hidden="true" /> The Impact
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{scar.impact}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});