"use client";

import { useEffect, useRef, useCallback, memo } from "react";
import { motion, useDragControls } from "framer-motion";
import { X, Link as LinkIcon, Lightbulb, Activity, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skill, getStatusConfig, handleJumpToScar } from "./skills.data";
import { useRouter } from "next/navigation";

const isRaster = (src: string) => /\.(png|jpe?g)$/i.test(src);

// Focusable elements the Tab key should cycle through inside the modal
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// ── Animation variants ─────────────────────────────────────────────────

const BACKDROP_VARIANTS = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.12, ease: "easeIn" } },
} as const;

const DESKTOP_MODAL_VARIANTS = {
    hidden: { opacity: 0, scale: 0.97, y: 6 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
        opacity: 0,
        scale: 0.97,
        y: 6,
        transition: { duration: 0.13, ease: "easeIn" },
    },
} as const;

const MOBILE_MODAL_VARIANTS = {
    hidden: { y: "100%" },
    visible: {
        y: 0,
        transition: { type: "spring", damping: 30, stiffness: 300 },
    },
    exit: {
        y: "100%",
        transition: { duration: 0.2, ease: "easeIn" },
    },
} as const;

// ── Constants ──────────────────────────────────────────────────────────

const SWIPE_CLOSE_THRESHOLD = 30;
const SWIPE_VELOCITY_THRESHOLD = 100;

// ── Component ──────────────────────────────────────────────────────────

export const SkillModal = memo(function SkillModal({
    skill,
    onClose,
    isMobile,
}: {
    skill: Skill;
    onClose: () => void;
    isMobile: boolean;
}) {
    const { icon: StatusIcon, bg, color } = getStatusConfig(skill.status);
    const raster = isRaster(skill.icon);
    const dialogRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const dragControls = useDragControls();

    // Restore focus to the trigger element when the modal closes
    useEffect(() => {
        const prev = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        return () => prev?.focus();
    }, []);

    // Class-based scroll lock — avoids the scrollbar-removal layout shift
    useEffect(() => {
        const html = document.documentElement;
        const scrollbarWidth = window.innerWidth - html.clientWidth;
        if (scrollbarWidth > 0) {
            html.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
        }
        html.classList.add("modal-open");
        return () => {
            html.classList.remove("modal-open");
            html.style.removeProperty("--scrollbar-width");
        };
    }, []);

    // Full focus trap: Tab/Shift+Tab cycle only within the modal
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key !== "Tab") return;

            const focusable = Array.from(
                dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
            );
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        },
        [onClose],
    );

    const modalVariants = isMobile
        ? MOBILE_MODAL_VARIANTS
        : DESKTOP_MODAL_VARIANTS;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex justify-center pointer-events-auto",
                isMobile ? "items-end" : "items-center p-4",
            )}
        >
            {/* Backdrop */}
            <motion.div
                variants={BACKDROP_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/25 dark:bg-black/80 backdrop-blur-sm"
                aria-hidden="true"
                style={{ willChange: "opacity" }}
            />

            {/* Modal / Bottom Sheet */}
            <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="skill-modal-title"
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                drag={isMobile ? "y" : false}
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 1000 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                    if (
                        isMobile &&
                        (info.offset.y > SWIPE_CLOSE_THRESHOLD ||
                            info.velocity.y > SWIPE_VELOCITY_THRESHOLD)
                    ) {
                        onClose();
                    }
                }}
                style={{ willChange: "transform, opacity" }}
                className={cn(
                    "relative bg-white dark:bg-card/95 border border-slate-200 dark:border-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden z-10 focus:outline-none tactical-corner-reticles",
                    isMobile
                        ? "w-full rounded-t-[32px] max-h-[85vh] overflow-y-auto"
                        : "w-full max-w-lg rounded-3xl",
                )}
            >
                {/* ── Drag Handle + Close (mobile) ──────────────── */}
                {isMobile && (
                    <div
                        className="sticky top-0 z-20 flex items-center justify-between px-5 pt-3 pb-2 bg-card/90 backdrop-blur-md border-b border-border/40 cursor-grab active:cursor-grabbing"
                        onPointerDown={(e) => dragControls.start(e)}
                    >
                        <div className="flex-1" />
                        <div
                            className="w-10 h-1 rounded-full bg-muted-foreground/30 absolute left-1/2 -translate-x-1/2 top-3"
                            aria-hidden="true"
                        />
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all cursor-pointer active:scale-95 shadow-sm"
                        >
                            <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>
                )}

                {/* ── Content ───────────────────────────────────── */}
                <div className={cn(isMobile ? "px-6 pb-8 pt-2" : "p-6 md:p-8")}>
                    {/* Desktop close button */}
                    {!isMobile && (
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 cursor-pointer shadow-sm"
                        >
                            <X className="w-5 h-5" aria-hidden="true" />
                        </button>
                    )}

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-50/80 via-purple-50/40 to-slate-50 dark:from-blue-500/15 dark:via-purple-500/5 dark:to-transparent border border-blue-200 dark:border-blue-500/30 shadow-md dark:shadow-[0_0_20px_rgba(59,130,246,0.15)] shrink-0">
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
                                <Image
                                    src={skill.icon}
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 object-contain"
                                />
                            ) : (
                                <img
                                    src={skill.icon}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display =
                                            "none";
                                    }}
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
                            <div
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-2 border border-current/10",
                                    bg,
                                    color,
                                )}
                            >
                                <StatusIcon
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                />
                                {skill.status}
                            </div>
                        </div>
                    </div>

                    {/* ── Body ──────────────────────────────────── */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold font-display text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                                <LinkIcon
                                    className="w-4 h-4 text-[hsl(var(--accent-blue))]"
                                    aria-hidden="true"
                                />{" "}
                                Neural Connections (Core Projects)
                            </h4>
                            {skill.projects.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skill.projects.map((project) => (
                                        <span
                                            key={project}
                                            className="hud-tag"
                                            style={{
                                                color: "hsl(var(--accent-blue))",
                                                borderColor: "hsl(var(--accent-blue) / 0.4)",
                                                backgroundColor: "hsl(var(--accent-blue) / 0.12)",
                                            }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-blue))] animate-pulse" aria-hidden="true" />
                                            {project}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl border border-l-4 border-border border-l-[var(--scar-medium)] bg-muted/20 shadow-sm">
                                    <p className="text-xs md:text-sm font-medium text-foreground/90 flex items-center gap-2">
                                        <Lightbulb
                                            className="w-4 h-4 text-[var(--scar-medium)] shrink-0"
                                            aria-hidden="true"
                                        />
                                        Currently researching and exploring this technology.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Battle Scar deep link */}
                        {skill.scarId && (
                            <div className="pt-6 border-t border-border/60">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleJumpToScar(
                                            skill.scarId!,
                                            onClose,
                                            router,
                                        )
                                    }
                                    className="w-full flex items-center justify-between p-4 rounded-2xl border shadow-md transition-all duration-300 
                                        bg-[hsl(var(--accent-purple)/0.08)] hover:bg-[hsl(var(--accent-purple)/0.15)] 
                                        border-[hsl(var(--accent-purple)/0.3)] hover:border-[hsl(var(--accent-purple)/0.6)] 
                                        text-foreground cyber-card cyber-card-interactive
                                        group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-purple)/0.5)] cursor-pointer"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-[hsl(var(--accent-purple)/0.15)] border border-[hsl(var(--accent-purple)/0.3)] text-[hsl(var(--accent-purple))] group-hover:scale-105 transition-all duration-300 shadow-sm">
                                            <Activity
                                                className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start leading-tight">
                                            <span className="font-bold font-display text-sm tracking-wide text-foreground">
                                                View Linked Battle Scar
                                            </span>
                                            <span className="hud-tag mt-1" style={{ color: "hsl(var(--accent-purple))", borderColor: "hsl(var(--accent-purple) / 0.3)", backgroundColor: "hsl(var(--accent-purple) / 0.1)" }}>
                                                ENGINEERING POST-MORTEM
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-[hsl(var(--accent-purple))] group-hover:translate-x-1 transition-all">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline">
                                            Explore Case
                                        </span>
                                        <ChevronRight
                                            className="w-4 h-4"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
});