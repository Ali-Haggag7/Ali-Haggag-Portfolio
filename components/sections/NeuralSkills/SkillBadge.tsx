"use client";

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skill } from "./skills.data";

// Computed once per skill instance, not on every render.
const isRaster = (src: string) => /\.(png|jpe?g)$/i.test(src);

export const SkillBadge = memo(function SkillBadge({
    skill,
    onClick,
}: {
    skill: Skill;
    onClick: () => void;
}) {
    const raster = useMemo(() => isRaster(skill.icon), [skill.icon]);

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`View details for ${skill.name}`}
            className={cn(
                "group relative flex items-center gap-2 px-3 py-2 rounded-xl",
                "border border-border/50 bg-card/50",
                "transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out",
                "hover:bg-card hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                "active:scale-95 will-change-transform cursor-pointer"
            )}
        >
            <div className="flex items-center justify-center w-6 h-6 shrink-0 relative">
                {skill.themeable ? (
                    // CSS mask approach for theme-aware SVGs — color inherits from foreground.
                    <div
                        className="w-full h-full bg-foreground opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                            maskImage: `url(${skill.icon})`,
                            WebkitMaskImage: `url(${skill.icon})`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                        }}
                    />
                ) : raster ? (
                    // Next.js Image for raster files: auto-compression, WebP conversion, lazy loading.
                    <Image
                        src={skill.icon}
                        alt=""
                        width={24}
                        height={24}
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                    />
                ) : (
                    // Native <img> for SVGs: avoids Next.js Image overhead for vector files.
                    <img
                        src={skill.icon}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                )}
            </div>

            <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                {skill.name}
            </span>

            {skill.scarId && (
                <span
                    aria-label="Has battle scar"
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse"
                />
            )}
        </button>
    );
});