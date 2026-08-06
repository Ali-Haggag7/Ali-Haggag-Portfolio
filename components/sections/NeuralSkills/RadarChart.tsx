"use client";

import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Target, Zap } from "lucide-react";

export interface RadarAxis {
    label: string;
    score: number; // 0..100
    category: string;
}

export const RADAR_AXES: readonly RadarAxis[] = Object.freeze([
    { label: "Frontend & UI", score: 95, category: "frontend" },
    { label: "Backend & Microservices", score: 92, category: "backend" },
    { label: "AI Agents & Automation", score: 94, category: "ai" },
    { label: "Real-Time & WebSockets", score: 96, category: "realtime" },
    { label: "AST & Compiler Design", score: 90, category: "cs" },
    { label: "Auth & Security", score: 92, category: "security" },
    { label: "Database & ORM", score: 88, category: "database" },
    { label: "DevOps & Infra", score: 85, category: "devops" },
    { label: "System Performance", score: 95, category: "performance" },
    { label: "System Architecture", score: 94, category: "architecture" },
]);

export const RadarChart = memo(function RadarChart() {
    const [hoveredAxis, setHoveredAxis] = useState<RadarAxis | null>(null);

    const size = 360;
    const center = size / 2;
    const radius = 130;
    const numAxes = RADAR_AXES.length;

    // Helper: calculate point coordinates for an axis at a given score
    const getPoint = (index: number, score: number) => {
        const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
        const r = (score / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    // Calculate radar polygon path string
    const polygonPoints = RADAR_AXES.map((axis, i) => {
        const pt = getPoint(i, axis.score);
        return `${pt.x},${pt.y}`;
    }).join(" ");

    return (
        <div className="w-full max-w-lg mx-auto rounded-2xl border border-border bg-card p-4 md:p-6 shadow-xl flex flex-col items-center">
            <div className="flex items-center justify-between w-full pb-3 border-b border-border/60 mb-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
                    <Target className="h-4 w-4 text-purple-400" aria-hidden="true" />
                    <span>Technical Proficiency Radar</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                    10 Domain Axes
                </span>
            </div>

            <div className="relative aspect-square w-full max-w-[340px] flex items-center justify-center">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                    <defs>
                        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                        </radialGradient>
                    </defs>

                    {/* Concentric grid circles (20%, 40%, 60%, 80%, 100%) */}
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
                        <polygon
                            key={level}
                            points={RADAR_AXES.map((_, i) => {
                                const pt = getPoint(i, level * 100);
                                return `${pt.x},${pt.y}`;
                            }).join(" ")}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeDasharray={level === 1.0 ? "none" : "2, 2"}
                            className="text-foreground/15"
                        />
                    ))}

                    {/* Axis Spoke Lines */}
                    {RADAR_AXES.map((_, i) => {
                        const pt = getPoint(i, 100);
                        return (
                            <line
                                key={i}
                                x1={center}
                                y1={center}
                                x2={pt.x}
                                y2={pt.y}
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-foreground/20"
                            />
                        );
                    })}

                    {/* Filled Radar Polygon */}
                    <polygon
                        points={polygonPoints}
                        fill="url(#radarGlow)"
                        stroke="#a855f7"
                        strokeWidth="2"
                        className="transition-all duration-300"
                    />

                    {/* Interactive Vertex Dots & Labels */}
                    {RADAR_AXES.map((axis, i) => {
                        const pt = getPoint(i, axis.score);
                        const labelPt = getPoint(i, 118);
                        const isHovered = hoveredAxis?.label === axis.label;

                        return (
                            <g
                                key={axis.label}
                                onMouseEnter={() => setHoveredAxis(axis)}
                                onMouseLeave={() => setHoveredAxis(null)}
                                className="cursor-pointer group"
                            >
                                {/* Glow Ring */}
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isHovered ? "7" : "4"}
                                    fill="#a855f7"
                                    className="transition-all duration-200"
                                />

                                {/* Label Text */}
                                <text
                                    x={labelPt.x}
                                    y={labelPt.y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize="9"
                                    fontFamily="monospace"
                                    className={cn(
                                        "select-none transition-colors fill-muted-foreground",
                                        isHovered && "fill-foreground font-bold"
                                    )}
                                >
                                    {axis.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Hover details badge */}
            <div className="min-h-[32px] flex items-center justify-center text-xs font-mono">
                {hoveredAxis ? (
                    <span className="text-purple-600 dark:text-purple-300 font-semibold flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" aria-hidden="true" />
                        {hoveredAxis.label}: <strong className="text-foreground">{hoveredAxis.score}%</strong> (Battle-Tested)
                    </span>
                ) : (
                    <span className="text-muted-foreground">Hover over any axis to inspect score</span>
                )}
            </div>
        </div>
    );
});
