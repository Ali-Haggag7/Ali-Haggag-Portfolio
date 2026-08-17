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
import { BorderBeam } from "@/components/ui/BorderBeam";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { useIsMobile } from "@/hooks/useIsMobile";

/** Max pills shown on a card to keep it compact */
const CARD_PILL_LIMIT = 4;

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
            {/* React Bits Border Beam Glow */}
            <BorderBeam
                duration={10}
                borderWidth={1.5}
                colorFrom="hsl(var(--accent-blue))"
                colorTo="hsl(var(--accent-purple))"
            />

            {/* Top HUD Spec Node Header */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
                <span className="hud-tag bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-200 font-mono text-[10px]">
                    <DecryptedText text={`NODE // ${feature.id.toUpperCase()}`} speed={30} sequential={true} animateOn="view" />
                </span>
                {demoHref && (
                    <span className="hud-tag bg-slate-900/85 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono text-[10px]">
                        <span
                            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
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
            <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl bg-slate-950">
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

            {/* Overlays & Content — Lightened gradient so project screenshot shines through clearly */}
            <div
                aria-hidden="true"
                className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/85 via-slate-950/35 via-45% to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
            />

            <div className="relative z-20 flex flex-col gap-2 p-6 mt-auto">
                {/* Icon row */}
                <div className="mb-1 flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-inner transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-5.5 w-5.5 text-slate-100" aria-hidden="true" />
                    </div>
                </div>

                <h3 className="text-xl font-bold font-display tracking-tight text-white drop-shadow-md transition-transform duration-300 group-hover:translate-x-1">
                    {name}
                </h3>

                <p className="text-xs md:text-sm text-slate-200 font-medium max-w-lg leading-relaxed drop-shadow transition-transform duration-300 delay-75 group-hover:translate-x-1">
                    {description}
                </p>

                {/* Tech stack pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {visiblePills.map((pill) => (
                        <span
                            key={pill.name}
                            className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md border border-slate-700/60 bg-slate-900/80 backdrop-blur-md transition-transform duration-200 group-hover:translate-x-0.5"
                            style={{
                                color: PILL_CATEGORY_VAR[pill.category],
                            }}
                        >
                            {pill.name}
                        </span>
                    ))}
                </div>

                <div className="mt-2 text-xs font-display font-semibold tracking-wider uppercase text-purple-400 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:text-purple-300 transition-all duration-300">
                    <span>EXPLORE AUTOPSY</span>
                    <Activity className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-300 animate-pulse" aria-hidden="true" />
                </div>
            </div>
        </motion.button>
    );
});