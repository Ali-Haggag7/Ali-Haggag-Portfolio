"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { Github, ExternalLink, Activity, Target, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

export const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full grid-cols-1 md:grid-cols-3 gap-6 relative",
                className
            )}
        >
            {children}
        </div>
    );
};

type Autopsy = {
    challenge: string;
    architecture: string;
    impact: string;
};

export const BentoCard = ({
    id,
    name,
    className,
    background,
    videoSrc,
    Icon,
    description,
    href,
    cta,
    demoHref,
    demoCta = "Live Demo",
    autopsy,
}: {
    id: string;
    name: string;
    className: string;
    background: ReactNode;
    videoSrc?: string;
    Icon: any;
    description: string;
    href?: string;
    cta?: string;
    demoHref?: string;
    demoCta?: string;
    autopsy?: Autopsy;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // References for Intersection Observer (Mobile video auto-play)
    const cardRef = useRef<HTMLButtonElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isInView = useInView(cardRef, { margin: "-20% 0px -20% 0px", once: false });

    // Effect to handle mobile auto-play based on scroll
    useEffect(() => {
        // Only trigger this logic on smaller screens (mobile/tablet) where hover isn't natural
        if (window.matchMedia("(max-width: 768px)").matches) {
            if (isInView && videoRef.current) {
                videoRef.current.play().catch(() => { });
                setIsHovered(true);
            } else if (!isInView && videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                setIsHovered(false);
            }
        }
    }, [isInView]);

    const handleMouseEnter = () => {
        if (window.matchMedia("(min-width: 769px)").matches) {
            setIsHovered(true);
            if (videoRef.current) {
                videoRef.current.play().catch(() => { });
            }
        }
    };

    const handleMouseLeave = () => {
        if (window.matchMedia("(min-width: 769px)").matches) {
            setIsHovered(false);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    };

    return (
        <>
            {/* The Grid Card */}
            <motion.button
                ref={cardRef}
                layoutId={`card-${id}`}
                onClick={() => setIsOpen(true)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleMouseEnter}
                onBlur={handleMouseLeave}
                aria-label={`View details for ${name}`}
                className={cn(
                    "group relative flex flex-col justify-end overflow-hidden rounded-2xl min-h-[22rem] w-full text-left transform-gpu will-change-transform",
                    "border border-border/50 dark:border-white/10 shadow-sm transition-[box-shadow,border-color] duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer",
                    className
                )}
            >
                <motion.div layoutId={`background-${id}`} className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-black transform-gpu">
                    <div className={cn(
                        "h-full w-full transition-[transform,opacity] duration-700 opacity-90 will-change-[transform,opacity]",
                        isHovered && videoSrc ? "scale-105 opacity-0" : "scale-100 group-hover:scale-110"
                    )}>
                        {background}
                    </div>

                    {/* Live Morphing Video */}
                    {videoSrc && (
                        <video
                            ref={videoRef}
                            src={videoSrc}
                            muted
                            playsInline
                            loop
                            className={cn(
                                "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 will-change-opacity",
                                isHovered ? "opacity-100" : "opacity-0"
                            )}
                        >
                            <track kind="captions" srcLang="en" label="English" default={false} />
                        </video>
                    )}
                </motion.div>

                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none transform-gpu" />

                <motion.div layoutId={`content-${id}`} className="relative z-20 flex flex-col gap-2 p-6 mt-auto transform-gpu">
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                        <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <motion.h3 layoutId={`title-${id}`} className="text-xl font-bold text-white">
                        {name}
                    </motion.h3>
                    <motion.p layoutId={`desc-${id}`} className="text-sm text-white/70 font-medium max-w-lg leading-relaxed">
                        {description}
                    </motion.p>
                    <div className="mt-2 text-xs font-bold text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Click to view Autopsy <Activity className="w-3 h-3" />
                    </div>
                </motion.div>
            </motion.button>

            {/* The Deep-Dive Autopsy Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{ willChange: "opacity" }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            aria-hidden="true"
                        />

                        <motion.article
                            layoutId={`card-${id}`}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`modal-title-${id}`}
                            style={{ willChange: "transform, opacity" }}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl border border-border/50 flex flex-col z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] transform-gpu"
                        >
                            <button
                                type="button"
                                aria-label="Close details"
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
                            >
                                <X className="w-5 h-5" aria-hidden="true" />
                            </button>

                            <motion.div layoutId={`background-${id}`} className="relative w-full h-64 md:h-80 shrink-0 bg-black overflow-hidden transform-gpu">
                                {videoSrc ? (
                                    <video autoPlay muted playsInline loop className="w-full h-full object-cover opacity-80">
                                        <source src={videoSrc} type="video/mp4" />
                                        <track kind="captions" srcLang="en" label="English" default={false} />
                                    </video>
                                ) : (
                                    <div className="w-full h-full opacity-80">{background}</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent transform-gpu" />

                                <motion.div layoutId={`content-${id}`} className="absolute bottom-0 left-0 p-6 md:p-8 w-full transform-gpu">
                                    <motion.h3 id={`modal-title-${id}`} layoutId={`title-${id}`} className="text-3xl md:text-5xl font-extrabold text-foreground mb-2">
                                        {name}
                                    </motion.h3>
                                    <motion.p layoutId={`desc-${id}`} className="text-lg text-muted-foreground max-w-2xl">
                                        {description}
                                    </motion.p>
                                </motion.div>
                            </motion.div>

                            <div className="p-6 md:p-8 flex flex-col gap-8">
                                {/* Autopsy Content */}
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

                                {/* Action Links */}
                                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/50">
                                    {demoHref && (
                                        <Link href={demoHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background">
                                            <ExternalLink className="w-4 h-4" aria-hidden="true" /> {demoCta}
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
                )}
            </AnimatePresence>
        </>
    );
};