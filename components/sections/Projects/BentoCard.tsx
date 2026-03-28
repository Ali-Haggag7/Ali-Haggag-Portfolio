"use client";

import {
    useState,
    useCallback,
    useEffect,
    useRef,
    memo,
    type RefObject,
} from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ProjectFeature } from "./projects.data";

// Custom hook to detect mobile view using ResizeObserver for better performance and responsiveness
function useIsMobile(): RefObject<boolean> {
    const isMobileRef = useRef<boolean>(false);

    useEffect(() => {
        const updateMode = () => {
            isMobileRef.current = window.innerWidth <= 768;
        };

        updateMode();
        const observer = new ResizeObserver(updateMode);
        observer.observe(document.body);

        return () => observer.disconnect();
    }, []);

    return isMobileRef;
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
    const isMobileRef = useIsMobile();

    // Control the video based on the isActive state and whether we're on mobile or not
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            video.currentTime = 0;
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    }, [isActive]);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (isMobileRef.current) {
                    setIsActive(entry.isIntersecting);
                }
            },
            { threshold: 0.6 }
        );

        observer.observe(card);
        return () => observer.disconnect();
    }, [isMobileRef]);

    const handleMouseEnter = useCallback(() => {
        if (!isMobileRef.current) setIsActive(true);
    }, [isMobileRef]);

    const handleMouseLeave = useCallback(() => {
        if (!isMobileRef.current) setIsActive(false);
    }, [isMobileRef]);

    const {
        name,
        description,
        className,
        Icon,
        videoSrc,
        imageSrc,
        isGradientBg,
        gradientClass,
    } = feature;

    const isColSpan2 = className.includes("md:col-span-2") || className.includes("col-span-2");

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
                "group relative flex flex-col justify-end overflow-hidden rounded-2xl min-h-[22rem] w-full text-left",
                "will-change-transform bg-white dark:bg-black border border-slate-200 dark:border-white/10 shadow-sm",
                "transition-[transform,box-shadow,border-color] duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer",
                "hover:shadow-xl hover:border-blue-500/50 hover:-translate-y-1",
                className
            )}
        >
            {/* Media Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-black">
                <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
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

                {videoSrc && (
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
            <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

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
                    Click to view Autopsy <Activity className="w-3 h-3" aria-hidden="true" />
                </div>
            </div>
        </button>
    );
});