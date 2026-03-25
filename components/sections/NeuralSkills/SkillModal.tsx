"use client";

import { motion } from "framer-motion";
import { X, Link as LinkIcon, AlertTriangle, Lightbulb, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skill, getStatusConfig, handleJumpToScar } from "./skills.data";

export function SkillModal({ skill, onClose }: { skill: Skill; onClose: () => void }) {
    const { icon: StatusIcon, bg, color } = getStatusConfig(skill.status);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{ willChange: "opacity" }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                aria-hidden="true"
            />
            <motion.div
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                style={{ willChange: "transform, opacity" }}
                className="relative w-full max-w-lg bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 md:p-8 transform-gpu"
            >
                <button
                    aria-label="Close"
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted border border-border">
                        <img
                            src={skill.icon}
                            alt=""
                            className="w-8 h-8 dark:invert transform-gpu"
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-foreground">{skill.name}</h3>
                        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mt-2", bg, color)}>
                            <StatusIcon className="w-3.5 h-3.5" aria-hidden="true" />
                            {skill.status}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" aria-hidden="true" /> Neural Connections
                        </h4>
                        {skill.projects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skill.projects.map((project, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-lg font-medium">
                                        {project}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-muted/50 rounded-xl border border-border border-dashed">
                                <p className="text-sm text-muted-foreground flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
                                    Currently researching and exploring this technology.
                                </p>
                            </div>
                        )}
                    </div>
                    {skill.scarId && (
                        <div className="pt-4 border-t border-border/50">
                            <button
                                type="button"
                                onClick={() => handleJumpToScar(skill.scarId!, onClose)}
                                className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-500 rounded-xl transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform transform-gpu" aria-hidden="true" />
                                    <span className="font-bold text-sm">View Linked Battle Scar</span>
                                </div>
                                <Activity className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}