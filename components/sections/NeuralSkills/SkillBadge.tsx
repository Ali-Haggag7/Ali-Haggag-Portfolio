"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { Skill } from "./skills.data";

// Pure string check — costs ~0.001ms, useMemo overhead exceeds the savings
const isRaster = (src: string) => /\.(png|jpe?g)$/i.test(src);

export const SkillBadge = memo(function SkillBadge({
    skill,
    onClick,
}: {
    skill: Skill;
    onClick: () => void;
}) {
    const raster = isRaster(skill.icon);

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`View details for ${skill.name}`}
            className={cn(
                "group relative flex items-center gap-2 px-3 py-2.5 rounded-xl",
                "min-h-[44px] border border-border/50 bg-card/50",
                "transition-all duration-200 ease-in-out",
                "hover:bg-card hover:border-blue-500/50 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10",
                "will-change-transform",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                "active:scale-95 cursor-pointer"
            )}
        >
            <div className="flex items-center justify-center w-6 h-6 shrink-0 relative">
                {skill.themeable ? (
                    // CSS mask: SVG colour inherits from --foreground, adapts to light/dark
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
                    // next/image for rasters: auto WebP conversion, compression, lazy loading
                    <Image
                        src={skill.icon}
                        alt=""
                        width={24}
                        height={24}
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                    />
                ) : (
                    // Native img for SVGs — next/image adds unnecessary overhead for vectors
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
                // motion-safe: respects prefers-reduced-motion — one class, no media query needed
                <span
                    aria-label="Has battle scar"
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background motion-safe:animate-pulse"
                />
            )}
        </button>
    );
});