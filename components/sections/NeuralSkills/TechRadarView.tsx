"use client";

import { memo, useState, useMemo } from "react";
import { Skill, SKILL_QUADRANTS, getStatusConfig } from "./skills.data";
import { cn } from "@/lib/utils";
import { Target, Swords } from "lucide-react";

type QuadrantId = "frontend" | "backend" | "data" | "infra";

export const TechRadarView = memo(function TechRadarView({
    skills,
    onSelectSkill,
}: {
    skills: Skill[];
    onSelectSkill: (skill: Skill) => void;
}) {
    const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
    const [activeQuadrant, setActiveQuadrant] = useState<QuadrantId | "all">("all");

    const size = 520;
    const center = size / 2;
    const rings = [
        { label: "BATTLE-TESTED", radius: 75, color: "var(--accent-purple)" },
        { label: "PRODUCTION READY", radius: 155, color: "var(--accent-emerald)" },
        { label: "R&D / EVALUATING", radius: 230, color: "var(--accent-blue)" },
    ];

    // Compute deterministic radar coordinates for each skill
    const blips = useMemo(() => {
        return skills.map((skill, index) => {
            // Determine quadrant angle bounds
            let minAngle = 0;
            let maxAngle = Math.PI / 2;

            if (skill.quadrant === "frontend") {
                // Top-Left (π to 3π/2)
                minAngle = Math.PI;
                maxAngle = (3 * Math.PI) / 2;
            } else if (skill.quadrant === "backend") {
                // Top-Right (3π/2 to 2π)
                minAngle = (3 * Math.PI) / 2;
                maxAngle = 2 * Math.PI;
            } else if (skill.quadrant === "data") {
                // Bottom-Left (π/2 to π)
                minAngle = Math.PI / 2;
                maxAngle = Math.PI;
            } else {
                // Bottom-Right (0 to π/2)
                minAngle = 0;
                maxAngle = Math.PI / 2;
            }

            // Radius based on status
            let baseRadius = 155;
            if (skill.status === "Battle-Tested") baseRadius = 55 + (index % 4) * 8;
            else if (skill.status === "Production Ready") baseRadius = 105 + (index % 6) * 9;
            else baseRadius = 185 + (index % 5) * 8;

            // Pseudo-random angle within quadrant based on character codes
            const hash = skill.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
            const angleOffset = 0.15 + ((hash % 100) / 100) * 0.7; // avoid exact edges
            const angle = minAngle + angleOffset * (maxAngle - minAngle);

            const x = center + baseRadius * Math.cos(angle);
            const y = center + baseRadius * Math.sin(angle);

            return {
                skill,
                x,
                y,
                baseRadius,
            };
        });
    }, [skills, center]);

    return (
        <div className="w-full flex flex-col items-center">
            {/* Quadrant Legend Selector */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveQuadrant("all")}
                    className={cn(
                        "text-xs font-mono font-semibold px-3 py-1.5 rounded-full border transition-colors min-h-[44px] cursor-pointer",
                        activeQuadrant === "all"
                            ? "bg-card border-foreground/40 text-foreground shadow-sm"
                            : "bg-muted/20 border-border/40 text-muted-foreground hover:text-foreground"
                    )}
                >
                    ALL QUADRANTS
                </button>
                {SKILL_QUADRANTS.map((q) => (
                    <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveQuadrant(q.id)}
                        className={cn(
                            "text-xs font-mono font-semibold px-3 py-1.5 rounded-full border transition-colors min-h-[44px] cursor-pointer",
                            activeQuadrant === q.id
                                ? "bg-card border-foreground/40 text-foreground shadow-sm"
                                : "bg-muted/20 border-border/40 text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {q.title.split("&")[0].trim()}
                    </button>
                ))}
            </div>

            {/* Radar View Container */}
            <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center bg-card/20 rounded-3xl border border-border/50 p-4 backdrop-blur-xl shadow-xl overflow-hidden">
                {/* SVG Radar */}
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full select-none">
                    <defs>
                        {/* Radar sweep gradient */}
                        <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--accent-blue))" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Quadrant dividing crosshairs */}
                    <line
                        x1={center}
                        y1={20}
                        x2={center}
                        y2={size - 20}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="4, 4"
                        className="text-border/60"
                    />
                    <line
                        x1={20}
                        y1={center}
                        x2={size - 20}
                        y2={center}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="4, 4"
                        className="text-border/60"
                    />

                    {/* Concentric rings */}
                    {rings.map((ring) => (
                        <circle
                            key={ring.label}
                            cx={center}
                            cy={center}
                            r={ring.radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeDasharray="6, 6"
                            className="text-border/50"
                        />
                    ))}

                    {/* Center point */}
                    <circle
                        cx={center}
                        cy={center}
                        r={3}
                        className="fill-[hsl(var(--accent-blue))]"
                    />

                    {/* Quadrant sector labels */}
                    <text x={35} y={35} className="text-[10px] font-mono fill-muted-foreground/60 font-bold uppercase">
                        Q1 · Frontend
                    </text>
                    <text x={size - 130} y={35} className="text-[10px] font-mono fill-muted-foreground/60 font-bold uppercase">
                        Q2 · Backend
                    </text>
                    <text x={35} y={size - 25} className="text-[10px] font-mono fill-muted-foreground/60 font-bold uppercase">
                        Q3 · Data / API
                    </text>
                    <text x={size - 145} y={size - 25} className="text-[10px] font-mono fill-muted-foreground/60 font-bold uppercase">
                        Q4 · Infra & Sec
                    </text>

                    {/* Interactive Blips */}
                    {blips.map(({ skill, x, y }) => {
                        const isFiltered = activeQuadrant !== "all" && skill.quadrant !== activeQuadrant;
                        const isHovered = hoveredSkill?.name === skill.name;
                        const isBattleTested = skill.status === "Battle-Tested";

                        if (isFiltered) return null;

                        return (
                            <g
                                key={skill.name}
                                className="cursor-pointer transition-transform duration-200"
                                onMouseEnter={() => setHoveredSkill(skill)}
                                onMouseLeave={() => setHoveredSkill(null)}
                                onClick={() => onSelectSkill(skill)}
                            >
                                {/* Touch target expansion circle */}
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={16}
                                    fill="transparent"
                                />

                                {/* Outer radar pulse for Battle-Tested or Hovered */}
                                {isHovered && (
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={12}
                                        fill="none"
                                        stroke="hsl(var(--accent-blue))"
                                        strokeWidth="1.5"
                                        className="animate-ping opacity-60"
                                    />
                                )}

                                {/* Main Blip Dot */}
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isHovered ? 6 : isBattleTested ? 4.5 : 3.5}
                                    className={cn(
                                        "transition-all",
                                        isBattleTested
                                            ? "fill-[hsl(var(--accent-purple))]"
                                            : skill.status === "Production Ready"
                                            ? "fill-[hsl(var(--accent-emerald))]"
                                            : "fill-[hsl(var(--accent-blue))]"
                                    )}
                                />

                                {/* Battle scar mini dot */}
                                {skill.scarId && (
                                    <circle
                                        cx={x + 3.5}
                                        cy={y - 3.5}
                                        r={2}
                                        className="fill-[hsl(var(--destructive))] animate-pulse"
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Live Hover HUD Tooltip */}
                {hoveredSkill && (
                    <div className="absolute bottom-4 inset-x-4 bg-card/95 border border-border/80 rounded-xl p-3 shadow-lg backdrop-blur-md flex items-center justify-between pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-display font-bold text-foreground">
                                    {hoveredSkill.name}
                                </span>
                                <span className="text-[10px] font-mono text-[hsl(var(--accent-blue))] font-semibold">
                                    {hoveredSkill.status}
                                </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground truncate block max-w-[280px]">
                                Shipped in: {hoveredSkill.projects.join(", ")}
                            </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground/60 border border-border/40 px-2 py-1 rounded">
                            CLICK TO INSPECT
                        </span>
                    </div>
                )}
            </div>

            {/* Radar Instructions */}
            <p className="text-xs font-mono text-muted-foreground/60 mt-4 text-center">
                Concentric rings denote verified mastery: Center = Battle-Tested · Outer = R&D
            </p>
        </div>
    );
});
