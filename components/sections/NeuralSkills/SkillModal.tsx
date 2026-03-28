"use client";

import { useEffect, useRef, useMemo, memo } from "react";
import { motion } from "framer-motion";
import { X, Link as LinkIcon, AlertTriangle, Lightbulb, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skill, getStatusConfig, handleJumpToScar } from "./skills.data";

const isRaster = (src: string) => /\.(png|jpe?g)$/i.test(src);

const BACKDROP_VARIANTS = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.12, ease: "easeIn" } },
} as const;

const MODAL_VARIANTS = {
    hidden: { opacity: 0, scale: 0.97, y: 6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, scale: 0.97, y: 6, transition: { duration: 0.13, ease: "easeIn" } },
} as const;

export const SkillModal = memo(function SkillModal({
    skill,
    onClose,
}: {
    skill: Skill;
    onClose: () => void;
}) {
    const { icon: StatusIcon, bg, color } = getStatusConfig(skill.status);
    const raster = useMemo(() => isRaster(skill.icon), [skill.icon]);

    // Focus trap
    const dialogRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const prev = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        return () => prev?.focus();
    }, []);

    // Body scroll lock via class — survives hydration, no style reconciler cost.
    useEffect(() => {
        document.documentElement.classList.add("modal-open");
        return () => document.documentElement.classList.remove("modal-open");
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
            <motion.div
                variants={BACKDROP_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
                aria-hidden="true"
                style={{ willChange: "opacity" }}
            />

            <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="skill-modal-title"
                tabIndex={-1}
                variants={MODAL_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ willChange: "transform, opacity" }}
                className="relative w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 md:p-8 focus:outline-none"
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Header */}
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
                        ) : raster ? (
                            <Image src={skill.icon} alt="" width={32} height={32} className="w-8 h-8 object-contain" />
                        ) : (
                            <img
                                src={skill.icon}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="w-8 h-8 object-contain"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            />
                        )}
                    </div>

                    <div>
                        <h3
                            id="skill-modal-title"
                            className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                        >
                            {skill.name}
                        </h3>
                        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-2 border border-current/10", bg, color)}>
                            <StatusIcon className="w-3.5 h-3.5" aria-hidden="true" />
                            {skill.status}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-6">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" aria-hidden="true" /> Neural Connections
                        </h4>
                        {skill.projects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skill.projects.map((project) => (
                                    <span
                                        key={project}
                                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg font-semibold shadow-sm"
                                    >
                                        {project}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
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
                                className="w-full flex items-center justify-between p-4 rounded-xl border shadow-sm transition-colors duration-150 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
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
});