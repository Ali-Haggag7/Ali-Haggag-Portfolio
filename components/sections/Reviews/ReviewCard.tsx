"use client";

import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";
import { Review } from "./reviews.data";

interface ReviewCardProps extends Review {
    onClick: () => void;
}

export function ReviewCard({ img, name, username, body, onClick }: ReviewCardProps) {
    return (
        <figure
            onClick={onClick}
            className={cn(
                "group relative w-64 sm:w-72 md:w-80 cursor-pointer overflow-hidden rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-500 transform-gpu will-change-transform",
                "bg-card/40 backdrop-blur-md border-border/50",
                "hover:bg-card/80 hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] hover:-translate-y-2 dark:hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)]"
            )}
        >
            <Quote className="absolute top-4 right-4 h-12 w-12 text-foreground/[0.03] dark:text-white/[0.02] rotate-180 transition-transform duration-500 group-hover:scale-125 group-hover:text-blue-500/10 transform-gpu will-change-transform" />

            <div className="flex flex-row items-center gap-4 relative z-10">
                <img
                    className="rounded-full border-2 border-background shadow-md transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform"
                    width="44"
                    height="44"
                    alt={`${name}'s avatar`}
                    src={img}
                />
                <div className="flex flex-col">
                    <figcaption className="text-base font-bold text-foreground tracking-tight">
                        {name}
                    </figcaption>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{username}</p>
                </div>
            </div>

            <blockquote className="relative z-10 text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground/90 transition-colors duration-300">
                "{body}"
            </blockquote>
        </figure>
    );
}