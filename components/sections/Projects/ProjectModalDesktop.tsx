"use client";

import { useRef, useEffect, memo } from "react";
import { Github, ExternalLink, Target, Zap, Activity, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ProjectFeature } from "./projects.data";
import { cn } from "@/lib/utils";

// Stable animation variants to prevent unnecessary re-renders
const BACKDROP_VARIANTS = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
} as const;

const MODAL_VARIANTS = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
        opacity: 0, y: 12, scale: 0.97,
        transition: { duration: 0.16, ease: "easeIn" },
    },
} as const;

const AutopsyCard = memo(function AutopsyCard({
    icon: Icon,
    label,
    text,
    accentClass,
    borderHoverClass,
}: {
    icon: React.ElementType;
    label: string;
    text: string;
    accentClass: string;
    borderHoverClass: string;
}) {
    return (
        <div className={cn(
            "bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-200",
            borderHoverClass
        )}>
            <h4 className={cn("flex items-center gap-2 font-bold mb-2 uppercase text-[10px] tracking-wider", accentClass)}>
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{text}</p>
        </div>
    );
});

export const ProjectModalDesktop = memo(function ProjectModalDesktop({
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

    // Focus management for accessibility
    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();
        return () => previousFocus?.focus();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 pointer-events-auto">
            {/* Overlay Backdrop */}
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

            {/* Modal Content */}
            <motion.article
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-title-${id}`}
                tabIndex={-1}
                variants={MODAL_VARIANTS}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ willChange: "transform, opacity" }}
                className={cn(
                    "relative w-full max-w-4xl max-h-[85vh] overflow-y-auto z-10",
                    "bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800",
                    "flex flex-col focus:outline-none",
                    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                )}
            >
                {/* Close Trigger */}
                <button
                    type="button"
                    aria-label="Close details"
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-[background-color,transform] duration-150 active:scale-95"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Hero Section */}
                <div className="relative w-full aspect-video shrink-0 bg-slate-100 dark:bg-black overflow-hidden">
                    {videoSrc ? (
                        <video
                            src={videoSrc}
                            autoPlay muted playsInline loop
                            className="w-full h-full object-cover"
                        />
                    ) : isGradientBg ? (
                        <div className={cn("h-full w-full bg-gradient-to-br", gradientClass)} />
                    ) : imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={name}
                            className="w-full h-full object-cover"
                            placeholder="blur"
                            sizes="(max-width: 896px) 100vw, 896px"
                        />
                    ) : null}

                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-slate-950 dark:via-slate-950/60 to-transparent pointer-events-none" />

                    <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col gap-3">
                        <h3 id={`modal-title-${id}`} className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {name}
                        </h3>
                        <p className="text-base text-slate-700 dark:text-slate-300 max-w-2xl font-medium line-clamp-2">
                            {description}
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                            {demoHref && (
                                <Link
                                    href={demoHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 border border-blue-200 dark:border-blue-500/20 rounded-full transition-colors active:scale-95"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                </Link>
                            )}
                            {href && (
                                <Link
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded-full transition-colors active:scale-95"
                                >
                                    <Github className="w-3.5 h-3.5" /> {cta ?? "Source"}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {autopsy && (
                    <div className="p-8 bg-white dark:bg-slate-950">
                        <div className="grid grid-cols-3 gap-6">
                            <AutopsyCard
                                icon={Target} label="The Challenge" text={autopsy.challenge}
                                accentClass="text-red-600 dark:text-red-400"
                                borderHoverClass="hover:border-red-200 dark:hover:border-red-900/50"
                            />
                            <AutopsyCard
                                icon={Activity} label="Architecture" text={autopsy.architecture}
                                accentClass="text-emerald-600 dark:text-emerald-400"
                                borderHoverClass="hover:border-emerald-200 dark:hover:border-emerald-900/50"
                            />
                            <AutopsyCard
                                icon={Zap} label="The Impact" text={autopsy.impact}
                                accentClass="text-blue-600 dark:text-blue-400"
                                borderHoverClass="hover:border-blue-200 dark:hover:border-blue-900/50"
                            />
                        </div>
                    </div>
                )}
            </motion.article>
        </div>
    );
});