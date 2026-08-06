"use client";

import {
    useState,
    useCallback,
    useEffect,
    useRef,
    memo,
} from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ProjectFeature, PILL_CATEGORY_VAR } from "./projects.data";

/** Max pills shown on a card to keep it compact */
const CARD_PILL_LIMIT = 4;

// Custom hook to detect mobile view using ResizeObserver for better performance and responsiveness
function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const updateMode = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        updateMode();
        const observer = new ResizeObserver(updateMode);
        observer.observe(document.body);

        return () => observer.disconnect();
    }, []);

    return isMobile;
}

export const BentoCard = memo(function BentoCard({
    feature,
    onClick,
    priority = false,
}: {
    feature: ProjectFeature;
    onClick: () => void;
    priority?: boolean;
}) {
    const [isActive, setIsActive] = useState(false);
    const cardRef = useRef<HTMLButtonElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isMobile = useIsMobile();

    // Control the video based on the isActive state and whether we're on mobile or not
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive && !isMobile) {
            video.currentTime = 0;
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    }, [isActive, isMobile]);

    const handleMouseEnter = useCallback(() => {
        if (!isMobile) setIsActive(true);
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        if (!isMobile) setIsActive(false);
    }, [isMobile]);

    const {
        name,
        description,
        className,
        Icon,
        videoSrc,
        imageSrc,
        isGradientBg,
        gradientClass,
        techStack,
        demoHref,
    } = feature;

    const isColSpan2 = className.includes("md:col-span-2") || className.includes("col-span-2");
    const visiblePills = techStack.slice(0, CARD_PILL_LIMIT);

    return (
        <motion.button
            type="button"
            id={`project-${feature.id}`}
            ref={cardRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            aria-label={`View details for ${name}`}
            className={cn(
                "group relative flex flex-col justify-end overflow-hidden rounded-2xl min-h-[22rem] w-full text-left",
                "cyber-card cyber-card-interactive tactical-corner-reticles",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-blue)/0.5)] cursor-pointer",
                "hover:shadow-2xl hover:border-[hsl(var(--accent-blue)/0.6)]",
                className
            )}
        >
            {/* Top HUD Spec Node Header */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
                <span
                    className="hud-tag"
                    style={{
                        backgroundColor: "hsl(var(--card) / 0.85)",
                        backdropFilter: "blur(8px)",
                        borderColor: "hsl(var(--border) / 0.8)",
                        color: "hsl(var(--foreground))",
                    }}
                >
                    NODE // {feature.id.toUpperCase()}
                </span>
                {demoHref && (
                    <span
                        className="hud-tag"
                        style={{
                            backgroundColor: "hsl(var(--card) / 0.85)",
                            backdropFilter: "blur(8px)",
                            borderColor: "hsl(var(--accent-emerald) / 0.4)",
                            color: "hsl(var(--accent-emerald))",
                        }}
                    >
                        <span
                            className="inline-block h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-emerald))]"
                            style={{
                                animation: "live-pulse 2s ease-in-out infinite",
                            }}
                            aria-hidden="true"
                        />
                        SYS.ONLINE
                    </span>
                )}
            </div>

            {/* Media Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl bg-muted/20">
                <div
                    className="h-full w-full transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-[1.08]"
                    style={{ willChange: "transform, filter" }}
                >
                    {isGradientBg ? (
                        <div className={cn("h-full w-full bg-gradient-to-br", gradientClass)} />
                    ) : imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={name}
                            className="h-full w-full object-cover object-top"
                            placeholder="blur"
                            priority={priority}
                            sizes={isColSpan2 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                        />
                    ) : null}
                </div>

                {!isMobile && videoSrc && (
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        muted
                        playsInline
                        loop
                        preload="none"
                        className={cn(
                            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                            isActive ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <track kind="captions" />
                    </video>
                )}
            </div>

            {/* Overlays & Content */}
            <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-[hsl(var(--card)/0.96)] via-[hsl(var(--card)/0.55)] to-transparent pointer-events-none" />

            <div className="relative z-20 flex flex-col gap-2 p-6 mt-auto">
                {/* Icon row */}
                <div className="mb-1 flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-black/80 backdrop-blur-md border border-white/20 shadow-inner transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-5.5 w-5.5 text-white/80" aria-hidden="true" />
                    </div>
                </div>

                <h3 className="text-xl font-bold font-display tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1">
                    {name}
                </h3>

                <p className="text-xs md:text-sm text-muted-foreground font-medium max-w-lg leading-relaxed transition-transform duration-300 delay-75 group-hover:translate-x-1">
                    {description}
                </p>

                {/* Tech stack pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {visiblePills.map((pill) => (
                        <span
                            key={pill.name}
                            className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md border border-border/60 backdrop-blur-md transition-transform duration-200 group-hover:translate-x-0.5"
                            style={{
                                color: PILL_CATEGORY_VAR[pill.category],
                                backgroundColor: "hsl(var(--card) / 0.8)",
                            }}
                        >
                            {pill.name}
                        </span>
                    ))}
                </div>

                <div className="mt-2 text-xs font-display font-semibold tracking-wider uppercase text-[hsl(var(--accent-purple))] flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-all duration-300">
                    <span>EXPLORE AUTOPSY</span>
                    <Activity className="w-3.5 h-3.5 text-[hsl(var(--accent-purple))] animate-pulse" aria-hidden="true" />
                </div>
            </div>
        </motion.button>
    );
});