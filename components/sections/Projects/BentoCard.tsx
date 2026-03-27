"use client";

import { useState, useCallback, memo, useEffect, useRef } from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ProjectFeature } from "./projects.data";

export const BentoCard = memo(function BentoCard({
    feature,
    onClick,
    priority = false,
}: {
    feature: ProjectFeature;
    onClick: () => void;
    priority?: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const cardRef = useRef<HTMLButtonElement>(null);

    // Smart Video Playback for Mobile: Plays only when 60% of the card is visible
    useEffect(() => {
        if (!cardRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                setIsInView(entry.isIntersecting);
            }
        }, { threshold: 0.6 });

        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (typeof window !== "undefined" && window.innerWidth <= 768) return;
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (typeof window !== "undefined" && window.innerWidth <= 768) return;
        setIsHovered(false);
    }, []);

    const { name, description, className, Icon, videoSrc, imageSrc, isGradientBg, gradientClass } = feature;
    const isColSpan2 = className.includes("md:col-span-2") || className.includes("col-span-2");

    // Show video if hovered (Desktop) OR if in view (Mobile)
    const showVideo = isHovered || isInView;

    return (
        <button
            type="button"
            ref={cardRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
            aria-label={`View details for ${name}`}
            className={cn(
                "group relative flex flex-col justify-end overflow-hidden rounded-2xl min-h-[22rem] w-full text-left transform-gpu",
                "bg-white dark:bg-black border border-slate-200 dark:border-white/10 shadow-sm transition-all duration-300 ease-out",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer",
                "hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] hover:border-blue-500/50 hover:-translate-y-1",
                className
            )}
        >
            <div className="absolute inset-0 z-0 h-full w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-black">
                <div className={cn(
                    "h-full w-full transition-transform duration-700 ease-out opacity-100 dark:opacity-90 group-hover:scale-105",
                )}>
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

                {/* Performance Hack: autoPlay is added so it plays instantly when mounted on Hover */}
                {videoSrc && showVideo && (
                    <video
                        src={videoSrc}
                        autoPlay
                        muted
                        playsInline
                        loop
                        className="absolute inset-0 h-full w-full object-cover opacity-100 animate-in fade-in duration-500"
                    >
                        <track kind="captions" srcLang="en" label="English" default={false} />
                    </video>
                )}
            </div>

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            <div className="relative z-20 flex flex-col gap-2 p-6 mt-auto">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md border border-white/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white transition-transform duration-300 group-hover:translate-x-1">
                    {name}
                </h3>
                <p className="text-sm text-slate-200 font-medium max-w-lg leading-relaxed transition-transform duration-300 delay-75 group-hover:translate-x-1">
                    {description}
                </p>
                <div className="mt-2 text-xs font-bold text-blue-400 flex items-center gap-1 opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    Click to view Autopsy <Activity className="w-3 h-3" />
                </div>
            </div>
        </button>
    );
});