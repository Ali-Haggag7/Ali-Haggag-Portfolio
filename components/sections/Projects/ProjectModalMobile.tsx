"use client";

import { useRef, useEffect, useCallback, memo } from "react";
import { Github, ExternalLink, Target, Zap, Activity, X } from "lucide-react";
import { motion, type PanInfo } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ProjectFeature } from "./projects.data";
import { cn } from "@/lib/utils";

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
}: {
    icon: React.ElementType;
    label: string;
    text: string;
    accentClass: string;
}) {
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
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
    } = feature;

    const dialogRef = useRef<HTMLElement>(null);

    // Initial focus management
    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        return () => previousFocus?.focus();
    }, []);

    // Dismiss logic based on drag distance or velocity
    const handleDragEnd = useCallback(
        (_e: any, info: PanInfo) => {
            if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
            }
        },
        [onClose]
    );

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
                    className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-[background-color,transform] duration-150 active:scale-95"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Hero Content Area */}
                <div className="relative w-full flex-1 flex flex-col justify-end bg-slate-100 dark:bg-black overflow-hidden rounded-t-3xl min-h-[30vh]">
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
                                <Link href={demoHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full active:scale-95 transition-colors">
                                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                </Link>
                            )}
                            {href && (
                                <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 rounded-full active:scale-95 transition-colors">
                                    <Github className="w-3.5 h-3.5" /> {cta ?? "Source"}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Project Details */}
                {autopsy && (
                    <div className="p-6 pb-8 bg-white dark:bg-slate-950 shrink-0 relative z-20">
                        <div className="flex flex-col gap-4">
                            <AutopsyCard icon={Target} label="The Challenge" text={autopsy.challenge} accentClass="text-red-600 dark:text-red-400" />
                            <AutopsyCard icon={Activity} label="Architecture" text={autopsy.architecture} accentClass="text-emerald-600 dark:text-emerald-400" />
                            <AutopsyCard icon={Zap} label="The Impact" text={autopsy.impact} accentClass="text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                )}
            </motion.article>
        </div>
    );
});