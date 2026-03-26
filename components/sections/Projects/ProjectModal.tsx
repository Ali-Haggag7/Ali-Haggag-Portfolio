"use client";

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/95"
                aria-hidden="true"
            />

            <motion.article
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-title-${id}`}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border/50 flex flex-col z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] transform-gpu"
            >
                <button
                    type="button"
                    aria-label="Close details"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                <div className="relative w-full h-64 md:h-80 shrink-0 bg-black overflow-hidden">
                    {videoSrc ? (
                        <video autoPlay muted playsInline loop className="w-full h-full object-cover opacity-80">
                            <source src={videoSrc} type="video/mp4" />
                            <track kind="captions" srcLang="en" label="English" default={false} />
                        </video>
                    ) : isGradientBg ? (
                        <div className={`h-full w-full bg-gradient-to-br ${gradientClass} opacity-80`}></div>
                    ) : imageSrc ? (
                        <Image src={imageSrc} alt={name} className="w-full h-full object-cover opacity-80" placeholder="blur" />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        <h3 id={`modal-title-${id}`} className="text-3xl md:text-5xl font-extrabold text-foreground mb-2">
                            {name}
                        </h3>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-8">
                    {autopsy && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                                <h4 className="flex items-center gap-2 text-red-600 dark:text-red-500 font-bold mb-3 uppercase text-xs tracking-wider">
                                    <Target className="w-4 h-4" /> The Challenge
                                </h4>
                                <p className="text-sm text-foreground/80 leading-relaxed">{autopsy.challenge}</p>
                            </div>
                            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                                <h4 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-bold mb-3 uppercase text-xs tracking-wider">
                                    <Activity className="w-4 h-4" /> Architecture
                                </h4>
                                <p className="text-sm text-foreground/80 leading-relaxed">{autopsy.architecture}</p>
                            </div>
                            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                                <h4 className="flex items-center gap-2 text-blue-600 dark:text-blue-500 font-bold mb-3 uppercase text-xs tracking-wider">
                                    <Zap className="w-4 h-4" /> The Impact
                                </h4>
                                <p className="text-sm text-foreground/80 leading-relaxed">{autopsy.impact}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/50">
                        {demoHref && (
                            <Link href={demoHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background">
                                <ExternalLink className="w-4 h-4" aria-hidden="true" /> Live Demo
                            </Link>
                        )}
                        {href && (
                            <Link href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 rounded-full font-bold transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background">
                                <Github className="w-4 h-4" aria-hidden="true" /> {cta || "Source Code"}
                            </Link>
                        )}
                    </div>
                </div>
            </motion.article>
        </div>
    );
};