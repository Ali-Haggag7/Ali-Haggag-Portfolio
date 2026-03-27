"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Link as LinkIcon, AlertTriangle, Lightbulb, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skill, getStatusConfig, handleJumpToScar } from "./skills.data";

export function SkillModal({ skill, onClose }: { skill: Skill; onClose: () => void }) {
    const { icon: StatusIcon, bg, color } = getStatusConfig(skill.status);
    
    // Smart detection for modal icon (consistency with SkillBadge)
    const isRasterImage = skill.icon.endsWith('.png') || skill.icon.endsWith('.jpg') || skill.icon.endsWith('.jpeg');

    // Performance & UX Fix: Lock body scroll to prevent nested scrolling issues
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
            {/* Extremely Fast Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.05 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
                aria-hidden="true"
            />

            <motion.div
                role="dialog"
                aria-modal="true"
                // Hyper-fast pop animation (50ms)
                initial={{ opacity: 0, scale: 0.98, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 5 }}
                transition={{ duration: 0.05, ease: "easeOut" }}
                className="relative w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 md:p-8 transform-gpu"
            >
                <button
                    aria-label="Close"
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
                        {skill.themeable ? (
                            <div
                                className="w-8 h-8 bg-slate-900 dark:bg-white"
                                style={{
                                    maskImage: `url(${skill.icon})`,
                                    WebkitMaskImage: `url(${skill.icon})`,
                                    maskSize: "contain",
                                    maskRepeat: "no-repeat",
                                    maskPosition: "center",
                                }}
                            />
                        ) : isRasterImage ? (
                            <Image 
                                src={skill.icon} 
                                alt={`${skill.name} icon`} 
                                width={32} 
                                height={32} 
                                className="w-8 h-8 object-contain" 
                            />
                        ) : (
                            <img
                                src={skill.icon}
                                alt={`${skill.name} icon`}
                                className="w-8 h-8 object-contain"
                                aria-hidden="true"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        )}
                    </div>
                    <div>
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{skill.name}</h3>
                        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-2 border border-current/10", bg, color)}>
                            <StatusIcon className="w-3.5 h-3.5" aria-hidden="true" />
                            {skill.status}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" aria-hidden="true" /> Neural Connections
                        </h4>
                        {skill.projects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skill.projects.map((project, idx) => (
                                    <span key={idx} className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg font-semibold shadow-sm">
                                        {project}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
                                    Currently researching and exploring this technology.
                                </p>
                            </div>
                        )}
                    </div>

                    {skill.scarId && (
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => handleJumpToScar(skill.scarId!, onClose)}
                                className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all duration-100 group focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform duration-100" aria-hidden="true" />
                                    <span className="font-bold text-sm tracking-wide">View Linked Battle Scar</span>
                                </div>
                                <Activity className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-100" aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}