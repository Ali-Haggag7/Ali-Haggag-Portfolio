"use client";

import { useEffect } from "react";
import { Github, ExternalLink, Target, Zap, Activity, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ProjectFeature } from "./projects.data";

export const ProjectModal = ({
    feature,
    onClose
}: {
    feature: ProjectFeature;
    onClose: () => void;
}) => {
    const { id, name, description, videoSrc, imageSrc, isGradientBg, gradientClass, autopsy, demoHref, href, cta } = feature;

    // Performance & UX Fix: Lock body scroll to prevent nested scrolling issues on mobile
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        // Responsive alignment: items-end for mobile drawer, items-center for desktop modal
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-auto sm:p-6 md:p-12">

            {/* Optimized Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transform-gpu"
                aria-hidden="true"
            />

            {/* Smart Modal/Drawer Card */}
            <motion.article
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-title-${id}`}
                // Slide up from bottom instantly, handles both mobile and desktop fluidly
                initial={{ opacity: 0, y: "100%", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: "100%", scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-950 rounded-t-3xl md:rounded-3xl shadow-2xl border-t md:border border-slate-200 dark:border-slate-800 flex flex-col z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] transform-gpu"
            >
                {/* Mobile Drag Indicator (Visual UX) */}
                <div className="w-full flex justify-center py-3 md:hidden absolute top-0 z-50 pointer-events-none">
                    <div className="w-12 h-1.5 bg-white/40 backdrop-blur-md rounded-full" />
                </div>

                <button
                    type="button"
                    aria-label="Close details"
                    onClick={onClose}
                    className="absolute top-4 md:top-6 right-4 md:right-6 z-50 p-2.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 transform-gpu active:scale-95"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Media Header (Now contains the actions too) */}
                <div className="relative w-full h-80 md:h-[22rem] shrink-0 bg-slate-100 dark:bg-black overflow-hidden rounded-t-3xl md:rounded-t-none">
                    {videoSrc ? (
                        <video autoPlay muted playsInline loop className="w-full h-full object-cover">
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                    ) : isGradientBg ? (
                        <div className={`h-full w-full bg-gradient-to-br ${gradientClass}`}></div>
                    ) : imageSrc ? (
                        <Image src={imageSrc} alt={name} className="w-full h-full object-cover" placeholder="blur" />
                    ) : null}

                    {/* Seamless Gradient blending into the content background - made slightly taller to fit buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 dark:from-slate-950 dark:via-slate-950/60 to-transparent pointer-events-none" />

                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col gap-3">
                        <div>
                            <h3 id={`modal-title-${id}`} className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                                {name}
                            </h3>
                            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-2xl font-medium line-clamp-2">
                                {description}
                            </p>
                        </div>

                        {/* Actions moved here - compact, ghost/outline style */}
                        <div className="flex items-center gap-3 pt-1">
                            {demoHref && (
                                <Link href={demoHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 rounded-full transition-colors active:scale-95">
                                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Live Demo
                                </Link>
                            )}
                            {href && (
                                <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full transition-colors active:scale-95">
                                    <Github className="w-3.5 h-3.5" aria-hidden="true" /> {cta || "Source"}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Body (Autopsy Cards only now) */}
                <div className="p-6 md:p-8 bg-white dark:bg-slate-950">
                    {autopsy && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* Autopsy Cards - Light & Dark Mode Polished */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-red-200 dark:hover:border-red-900/50">
                                <h4 className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-2 uppercase text-[10px] tracking-wider">
                                    <Target className="w-3.5 h-3.5" /> The Challenge
                                </h4>
                                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{autopsy.challenge}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-emerald-200 dark:hover:border-emerald-900/50">
                                <h4 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2 uppercase text-[10px] tracking-wider">
                                    <Activity className="w-3.5 h-3.5" /> Architecture
                                </h4>
                                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{autopsy.architecture}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors hover:border-blue-200 dark:hover:border-blue-900/50">
                                <h4 className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-2 uppercase text-[10px] tracking-wider">
                                    <Zap className="w-3.5 h-3.5" /> The Impact
                                </h4>
                                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{autopsy.impact}</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.article>
        </div>
    );
};