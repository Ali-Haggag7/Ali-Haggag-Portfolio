"use client";

import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";
import { Review } from "./reviews.data";
import Image from "next/image";

interface ReviewCardProps extends Review {
    onClick: () => void;
}

export function ReviewCard({ img, name, username, body, onClick }: ReviewCardProps) {
    return (
        <figure
            onClick={onClick}
            className={cn(
                "group relative w-64 sm:w-72 md:w-80 cursor-pointer overflow-hidden rounded-2xl p-6 flex flex-col gap-4 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-transform",
                "cyber-card cyber-card-interactive tactical-corner-reticles",
                "hover:border-[hsl(var(--accent-blue)/0.5)] hover:-translate-y-1"
            )}
        >
            <Quote className="absolute top-4 right-4 h-12 w-12 text-foreground/[0.04] rotate-180 transition-transform duration-500 group-hover:scale-125 group-hover:text-[hsl(var(--accent-blue)/0.15)] transform-gpu will-change-transform" />

            <div className="flex flex-row items-center gap-4 relative z-10">
                <Image
                    className="rounded-full border-2 border-[hsl(var(--accent-blue)/0.3)] shadow-md transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform"
                    width={44}
                    height={44}
                    alt={`${name}'s avatar`}
                    src={img}
                />
                <div className="flex flex-col">
                    <figcaption className="text-base font-bold font-display text-foreground tracking-tight">
                        {name}
                    </figcaption>
                    <p className="text-xs font-mono font-semibold text-[hsl(var(--accent-blue))]">{username}</p>
                </div>
            </div>

            <blockquote className="relative z-10 text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground/90 transition-colors duration-300">
                &quot;{body}&quot;
            </blockquote>
        </figure>
    );
}