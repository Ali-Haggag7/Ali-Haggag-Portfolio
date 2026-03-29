"use client";

import { useEffect, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { X, Link as LinkIcon, AlertTriangle, Lightbulb, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skill, getStatusConfig, handleJumpToScar } from "./skills.data";

const isRaster = (src: string) => /\.(png|jpe?g)$/i.test(src);

// Focusable elements the Tab key should cycle through inside the modal
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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
    const raster = isRaster(skill.icon);
    const dialogRef = useRef<HTMLDivElement>(null);

    // Restore focus to the trigger element when the modal closes
    useEffect(() => {
        const prev = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        return () => prev?.focus();
    }, []);

    // Class-based scroll lock — avoids the scrollbar-removal layout shift
    useEffect(() => {
        document.documentElement.classList.add("modal-open");
        return () => document.documentElement.classList.remove("modal-open");
    }, []);

    // Full focus trap: Tab/Shift+Tab cycle only within the modal
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") { onClose(); return; }
        if (e.key !== "Tab") return;

        const focusable = Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
            <motion.div
                variants={BACKDROP_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 dark:bg-black/80"
                aria-hidden="true"
                style={{ willChange: "opacity" }}
            />

            <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="skill-modal-title"
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                variants={MODAL_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ willChange: "transform, opacity" }}
                // Uses theme tokens — updates automatically when globals.css changes
                className="relative w-full max-w-lg bg-background border border-border rounded-3xl shadow-2xl overflow-hidden z-10 p-6 md:p-8 focus:outline-none"
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2.5 rounded-full text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted border border-border shrink-0">
                        {skill.themeable ? (
                            <div
                                className="w-8 h-8 bg-foreground"
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
                            className="text-2xl font-extrabold text-foreground tracking-tight"
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
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" aria-hidden="true" /> Neural Connections
                        </h4>
                        {skill.projects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skill.projects.map((project) => (
                                    <span
                                        key={project}
                                        className="px-3.5 py-1.5 bg-muted border border-border text-foreground text-sm rounded-lg font-semibold"
                                    >
                                        {project}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-muted/50 rounded-xl border border-dashed border-border">
                                <p className="text-sm font-medium text-muted-foreground flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
                                    Currently researching and exploring this technology.
                                </p>
                            </div>
                        )}
                    </div>

                    {skill.scarId && (
                        <div className="pt-6 border-t border-border">
                            <button
                                type="button"
                                onClick={() => handleJumpToScar(skill.scarId!, onClose)}
                                className="w-full flex items-center justify-between p-4 rounded-xl border shadow-sm transition-colors duration-150 bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-500 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
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