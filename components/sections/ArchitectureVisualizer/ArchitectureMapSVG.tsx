"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import type { ArchitectureMap, SystemNode } from "./architectureData";
import { Server, Monitor, Database, Cpu, HardDrive, ShieldCheck } from "lucide-react";

interface ArchitectureMapSVGProps {
    map: ArchitectureMap;
    selectedNodeId: string;
    onSelectNode: (id: string) => void;
}

const CATEGORY_ICONS = {
    client: Monitor,
    api: Server,
    database: Database,
    cache: Cpu,
    infra: HardDrive,
    worker: ShieldCheck,
};

const CATEGORY_COLORS = {
    client: "#3b82f6",
    api: "#a855f7",
    database: "#eab308",
    cache: "#10b981",
    infra: "#06b6d4",
    worker: "#f43f5e",
};

export const ArchitectureMapSVG = memo(function ArchitectureMapSVG({
    map,
    selectedNodeId,
    onSelectNode,
}: ArchitectureMapSVGProps) {
    const width = 800;
    const height = 400;

    // Helper: convert percentage coords to SVG pixel coords
    const getCoords = (node: SystemNode) => ({
        x: (node.x / 100) * width,
        y: (node.y / 100) * height,
    });

    return (
        <div className="w-full overflow-x-auto py-2">
            <div className="min-w-[700px] relative aspect-[2/1] rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm p-4 shadow-inner overflow-hidden">
                {/* Dotted Canvas Background Grid */}
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(hsl(var(--muted-foreground)/0.3)_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full relative z-10">
                    <defs>
                        {/* Glow filters per color */}
                        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                            <filter key={cat} id={`glow-${cat}`} x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="6" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        ))}

                        {/* Dot Matrix Pattern */}
                        <pattern id="arch-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="1.2" fill="hsl(var(--muted-foreground))" opacity="0.35" />
                        </pattern>
                    </defs>

                    {/* Dotted Grid Fill */}
                    <rect width={width} height={height} fill="url(#arch-dot-grid)" rx="12" />

                    {/* Render Connection Lines */}
                    {map.nodes.map((node) => {
                        const from = getCoords(node);

                        return node.connections.map((targetId) => {
                            const targetNode = map.nodes.find((n) => n.id === targetId);
                            if (!targetNode) return null;
                            const to = getCoords(targetNode);
                            const isConnectedToSelected =
                                node.id === selectedNodeId || targetId === selectedNodeId;

                            return (
                                <g key={`${node.id}-${targetId}`}>
                                    {/* Static background connection line */}
                                    <line
                                        x1={from.x}
                                        y1={from.y}
                                        x2={to.x}
                                        y2={to.y}
                                        stroke={isConnectedToSelected ? CATEGORY_COLORS[node.category] : "hsl(var(--border))"}
                                        strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                                        strokeOpacity={isConnectedToSelected ? 0.9 : 0.5}
                                        strokeDasharray={isConnectedToSelected ? "6, 6" : "none"}
                                        className={isConnectedToSelected ? "animate-pulse" : ""}
                                    />
                                </g>
                            );
                        });
                    })}

                    {/* Render Nodes */}
                    {map.nodes.map((node) => {
                        const { x, y } = getCoords(node);
                        const isSelected = selectedNodeId === node.id;
                        const Icon = CATEGORY_ICONS[node.category];
                        const color = CATEGORY_COLORS[node.category];

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${x}, ${y})`}
                                onClick={() => onSelectNode(node.id)}
                                className="cursor-pointer group"
                            >
                                {/* Outer Selection Glow Ring */}
                                {isSelected && (
                                    <circle
                                        r="36"
                                        fill="none"
                                        stroke={color}
                                        strokeWidth="2"
                                        className="animate-ping opacity-50"
                                    />
                                )}

                                {/* Outer Node Circle */}
                                <circle
                                    r="26"
                                    fill="hsl(var(--card))"
                                    stroke={isSelected ? color : "hsl(var(--border))"}
                                    strokeWidth={isSelected ? "3" : "1.5"}
                                    filter={isSelected ? `url(#glow-${node.category})` : "none"}
                                    className="transition-all duration-300 group-hover:stroke-foreground/60 shadow-md"
                                />

                                {/* Icon placeholder in center */}
                                <g transform="translate(-10, -10)">
                                    <Icon size={20} color={color} />
                                </g>

                                {/* Node Label Text */}
                                <text
                                    y="45"
                                    textAnchor="middle"
                                    fontSize="11"
                                    fontFamily="monospace"
                                    className={cn(
                                        "select-none transition-colors font-mono",
                                        isSelected ? "fill-foreground font-extrabold" : "fill-muted-foreground font-semibold group-hover:fill-foreground"
                                    )}
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
});
