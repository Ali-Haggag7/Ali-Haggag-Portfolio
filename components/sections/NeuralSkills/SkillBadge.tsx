"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Skill } from "./skills.data";

export const SkillBadge = memo(function SkillBadge({ skill, onClick }: { skill: Skill; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`View details for ${skill.name}`}
            className={cn(
                "group relative flex items-center gap-2 px-3 py-2 rounded-xl border border-border/50 bg-card/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transform-gpu",
                "hover:bg-card hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
            )}
        >
            <div className="flex items-center justify-center w-6 h-6 shrink-0 relative">
                {skill.themeable ? (
                    <div
                        className="w-full h-full opacity-70 group-hover:opacity-100 transition-opacity duration-200 bg-foreground"
                        style={{
                            maskImage: `url(${skill.icon})`,
                            WebkitMaskImage: `url(${skill.icon})`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                        }}
                    />
                ) : (
                    <img
                        src={skill.icon}
                        alt={`${skill.name} icon`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                )}
            </div>

            <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                {skill.name}
            </span>

            {skill.scarId && (
                <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"
                    aria-label="Has battle scar"
                />
            )}
        </button>
    );
});