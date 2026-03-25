"use client";

import { useState, useRef, useEffect } from "react";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ProjectFeature } from "./projects.data";

export const BentoCard = ({
    feature,
    onClick
}: {
    feature: ProjectFeature;
    onClick: () => void;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLButtonElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isInView = useInView(cardRef, { margin: "-20% 0px -20% 0px", once: false });

    useEffect(() => {
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

    const { id, name, description, className, Icon, videoSrc, imageSrc, isGradientBg, gradientClass } = feature;
    const isColSpan2 = className.includes("md:col-span-2");

    return (
        <motion.button
            ref={cardRef}
            layoutId={`card-${id}`}
            onClick={onClick}
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
                    {isGradientBg ? (
                        <div className={cn("h-full w-full bg-gradient-to-br", gradientClass)}></div>
                    ) : imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={name}
                            className="h-full w-full object-cover object-top"
                            placeholder="blur"
                            priority={true}
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
    );
};