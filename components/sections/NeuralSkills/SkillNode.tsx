"use client";

import { cn } from "@/lib/utils";
import { Skill } from "./skills.data";

export function SkillNode({ skill, onClick }: { skill: Skill; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`View details for ${skill.name}`}
            className={cn(
                "group/skill relative mx-2 md:mx-4 flex items-center justify-center border border-border/50 bg-card/30 backdrop-blur-md transition-[transform,background-color,box-shadow,border-color] duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-card hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] cursor-pointer transform-gpu will-change-transform",
                // Mobile: Hexagon/Circle style (smaller), Desktop: Rounded Square (larger)
                "h-16 w-16 rounded-full hover:scale-110 md:h-24 md:w-24 md:rounded-2xl"
            )}
        >
            <img
                src={skill.icon}
                alt={`${skill.name} icon`}
                className="h-8 w-8 md:h-12 md:w-12 opacity-50 transition-[opacity,filter] duration-500 group-hover/skill:opacity-100 group-focus/skill:opacity-100 grayscale group-hover/skill:grayscale-0 group-focus/skill:grayscale-0 dark:invert dark:group-hover/skill:invert-0 dark:group-focus/skill:invert-0 will-change-[opacity,filter]"
            />
            {skill.scarId && (
                <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full animate-pulse border-2 border-background transform-gpu" aria-label="Has battle scar"></span>
            )}
        </button>
    );
}