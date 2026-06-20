"use client";

import { useRef, useEffect, useCallback, memo } from "react";
import { Github, ExternalLink, Target, Zap, Activity, X, AlertTriangle } from "lucide-react";
import { motion, type PanInfo } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProjectFeature, PILL_CATEGORY_VAR } from "./projects.data";
import { scarsData } from "../BattleScars/scars.data";
import { handleJumpToScar } from "../NeuralSkills/skills.data";
import { cn } from "@/lib/utils";

/** Max pills shown in modal */
const MODAL_PILL_LIMIT = 8;

/** Severity badge label map */
const SEVERITY_LABEL: Record<string, string> = {
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
};

/** Severity CSS variable map */
const SEVERITY_VAR: Record<string, string> = {
    critical: "var(--scar-critical)",
    high: "var(--scar-high)",
    medium: "var(--scar-medium)",
};

/** CSS transition delay step (ms) for staggered mobile appearance */
const STAGGER_DELAY_MS = 60;

// Stable animation constants
const BACKDROP_VARIANTS = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
} as const;

const SHEET_VARIANTS = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
        y: 0, opacity: 1,
        transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
        y: "100%", opacity: 0,
        transition: { duration: 0.22, ease: [0.55, 0, 1, 0.45] },
    },
} as const;

const DRAG_CONSTRAINTS = { top: 0, bottom: 0 } as const;
const DRAG_ELASTIC = { top: 0, bottom: 0.4 } as const;

const AutopsyCard = memo(function AutopsyCard({
    icon: Icon,
    label,
    text,
    accentClass,
    staggerIndex,
}: {
    icon: React.ElementType;
    label: string;
    text: string;
    accentClass: string;
    staggerIndex: number;
}) {
    return (
        <div
            className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 ease-out"
            style={{
                animationName: "fadeIn",
                animationDuration: "0.4s",
                animationFillMode: "both",
                animationDelay: `${staggerIndex * STAGGER_DELAY_MS}ms`,
            }}
        >
            <h4 className={cn("flex items-center gap-2 font-bold mb-2 uppercase text-[10px] tracking-wider", accentClass)}>
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{text}</p>
        </div>
    );
});

export const ProjectModalMobile = memo(function ProjectModalMobile({
    feature,
    onClose,
}: {
    feature: ProjectFeature;
    onClose: () => void;
}) {
    const {
        id, name, description, videoSrc, imageSrc,
        isGradientBg, gradientClass, autopsy, demoHref, href, cta,
        techStack, metrics, scarIds,
    } = feature;

    const router = useRouter();
    const dialogRef = useRef<HTMLElement>(null);

    const visiblePills = techStack.slice(0, MODAL_PILL_LIMIT);
    const relatedScars = scarIds
        .map((sid) => scarsData.find((s) => s.id === sid))
        .filter((s): s is (typeof scarsData)[number] => Boolean(s));

    // Initial focus management
    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        return () => previousFocus?.focus();
    }, []);

    // Dismiss logic based on drag distance or velocity
    const handleDragEnd = useCallback(
        (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
            }
        },
        [onClose]
    );

    const handleScarClick = useCallback(
        (scarId: string) => {
            handleJumpToScar(scarId, onClose, router);
        },
        [onClose, router]
    );

    /** Stagger index offset — autopsy panels start after pills */
    const panelStaggerStart = 1;
    const metricsStaggerStart = panelStaggerStart + 3;
    const scarsStaggerStart = metricsStaggerStart + 1;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-auto">
            {/* Backdrop Overlay */}
            <motion.div
                variants={BACKDROP_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
                aria-hidden="true"
                style={{ willChange: "opacity" }}
            />

            {/* Draggable Bottom Sheet */}
            <motion.article
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-title-${id}`}
                tabIndex={-1}
                variants={SHEET_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                drag="y"
                dragConstraints={DRAG_CONSTRAINTS}
                dragElastic={DRAG_ELASTIC}
                onDragEnd={handleDragEnd}
                style={{ willChange: "transform, opacity" }}
                className={cn(
                    "relative w-full h-[100dvh] bg-white dark:bg-slate-950 rounded-t-3xl shadow-2xl",
                    "flex flex-col z-10 overflow-hidden focus:outline-none"
                )}
            >
                {/* Visual Drag Handle */}
                <div aria-hidden="true" className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-12 h-1.5 bg-white/40 backdrop-blur-md rounded-full pointer-events-none" />

                <button
                    type="button"
                    aria-label="Close details"
                    onClick={onClose}
                    className="cursor-pointer absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/20 hover:bg-black/40 hover:scale-105 backdrop-blur-md text-white transition-all duration-200 active:scale-95"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Hero Content Area */}
                <div className="relative w-full flex-shrink-0 flex flex-col justify-end bg-slate-100 dark:bg-black overflow-hidden rounded-t-3xl min-h-[30vh]">
                    <div className="absolute inset-0 w-full h-full">
                        {videoSrc ? (
                            <video src={videoSrc} autoPlay muted playsInline loop className="w-full h-full object-cover" />
                        ) : isGradientBg ? (
                            <div className={cn("h-full w-full bg-gradient-to-br", gradientClass)} />
                        ) : imageSrc ? (
                            <Image src={imageSrc} alt={name} className="w-full h-full object-cover" placeholder="blur" sizes="100vw" />
                        ) : null}

                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-slate-950 dark:via-slate-950/60 to-transparent pointer-events-none" />
                    </div>

                    <div className="relative z-10 p-6 w-full flex flex-col gap-3">
                        <h3 id={`modal-title-${id}`} className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {name}
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-3">
                            {description}
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                            {demoHref && (
                                <Link
                                    href={demoHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold 
                                        text-blue-600 dark:text-blue-400 
                                        bg-blue-50 dark:bg-blue-500/10 
                                        hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white
                                        border border-blue-200 dark:border-blue-500/20 
                                        rounded-full transition-all duration-300 active:scale-95 shadow-sm hover:shadow-blue-500/20 min-h-[44px]"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                </Link>
                            )}
                            {href && (
                                <Link
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold 
                                        text-slate-700 dark:text-slate-300 
                                        bg-slate-100 dark:bg-slate-800/50 
                                        hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900
                                        border border-slate-200 dark:border-slate-700 
                                        rounded-full transition-all duration-300 active:scale-95 shadow-sm min-h-[44px]"
                                >
                                    <Github className="w-3.5 h-3.5" /> {cta ?? "Source"}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    {/* Tech Stack Pills */}
                    <div
                        className="px-6 pt-5 pb-2"
                        style={{
                            animationName: "fadeIn",
                            animationDuration: "0.4s",
                            animationFillMode: "both",
                            animationDelay: "0ms",
                        }}
                    >
                        <div className="flex flex-wrap gap-2">
                            {visiblePills.map((pill) => (
                                <span
                                    key={pill.name}
                                    className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide rounded-full border transition-all duration-200 ease-out hover:scale-105 cursor-default"
                                    style={{
                                        color: PILL_CATEGORY_VAR[pill.category],
                                        borderColor: PILL_CATEGORY_VAR[pill.category],
                                    }}
                                >
                                    {pill.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Project Details */}
                    {autopsy && (
                        <div className="p-6 pb-4 bg-white dark:bg-slate-950 shrink-0 relative z-20">
                            <div className="flex flex-col gap-4">
                                <AutopsyCard icon={Target} label="The Challenge" text={autopsy.challenge} accentClass="text-red-600 dark:text-red-400" staggerIndex={panelStaggerStart} />
                                <AutopsyCard icon={Activity} label="Architecture" text={autopsy.architecture} accentClass="text-emerald-600 dark:text-emerald-400" staggerIndex={panelStaggerStart + 1} />
                                <AutopsyCard icon={Zap} label="The Impact" text={autopsy.impact} accentClass="text-blue-600 dark:text-blue-400" staggerIndex={panelStaggerStart + 2} />
                            </div>
                        </div>
                    )}

                    {/* Key Metrics */}
                    {metrics.length > 0 && (
                        <div
                            className="px-6 pb-5"
                            style={{
                                animationName: "fadeIn",
                                animationDuration: "0.4s",
                                animationFillMode: "both",
                                animationDelay: `${metricsStaggerStart * STAGGER_DELAY_MS}ms`,
                            }}
                        >
                            <h4 className="flex items-center gap-2 font-bold mb-3 uppercase text-[10px] tracking-wider text-slate-500 dark:text-slate-400">
                                <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                                Key Metrics
                            </h4>
                            <div className="grid grid-cols-2 gap-2.5">
                                {metrics.map((metric) => (
                                    <div
                                        key={metric.label}
                                        className="flex flex-col items-center justify-center px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
                                    >
                                        <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                                            {metric.value}
                                        </span>
                                        <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5 text-center leading-tight">
                                            {metric.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Battle Scars Involved */}
                    {relatedScars.length > 0 && (
                        <div
                            className="px-6 pb-8"
                            style={{
                                animationName: "fadeIn",
                                animationDuration: "0.4s",
                                animationFillMode: "both",
                                animationDelay: `${scarsStaggerStart * STAGGER_DELAY_MS}ms`,
                            }}
                        >
                            <h4 className="flex items-center gap-2 font-bold mb-3 uppercase text-[10px] tracking-wider text-slate-500 dark:text-slate-400">
                                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                                Battle Scars Involved
                            </h4>
                            <div className="flex flex-col gap-2">
                                {relatedScars.map((scar) => (
                                    <button
                                        key={scar.id}
                                        type="button"
                                        onClick={() => handleScarClick(scar.id)}
                                        className="cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-medium rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 min-h-[44px]"
                                    >
                                        <span className="truncate">{scar.title}</span>
                                        <span
                                            className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded"
                                            style={{
                                                color: SEVERITY_VAR[scar.severity],
                                                border: `1px solid ${SEVERITY_VAR[scar.severity]}`,
                                            }}
                                        >
                                            {SEVERITY_LABEL[scar.severity]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.article>
        </div>
    );
});