"use client";

import { memo, useState, useMemo, useEffect } from "react";
import { ECOSYSTEM_NODES, ECOSYSTEM_EDGES, type EcosystemNode } from "./ecosystemData";
import {
    Sparkles, Server, Zap, Database, Globe,
    Code2, ShieldCheck, Smartphone, Cpu, Bot, Terminal,
    BookOpen, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Map Lucide fallback icons per tech node
function getTechFallbackIcon(id: string) {
    switch (id) {
        case "tech-nestjs":
            return Server;
        case "tech-socketio":
            return Zap;
        case "tech-redis":
            return Database;
        case "tech-webrtc":
            return Globe;
        case "tech-nextjs":
            return Code2;
        case "tech-zod":
            return ShieldCheck;
        case "tech-pwa":
            return Smartphone;
        default:
            return Cpu;
    }
}

// Map Lucide fallback icons for projects without custom icon file
function getProjectFallbackIcon(id: string) {
    switch (id) {
        case "scout":
            return Bot;
        case "blog-pro":
            return BookOpen;
        case "cs-arena":
            return Terminal;
        default:
            return Layers;
    }
}

export const EcosystemMap = memo(function EcosystemMap() {
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string>("logic-arena");
    const [debouncedActiveId, setDebouncedActiveId] = useState<string>("logic-arena");

    const width = 800;
    const height = 450;

    // Instant active ID for high-frequency SVG canvas line highlights
    const activeId = hoveredNodeId || selectedNodeId;

    // Debounced active ID for the bottom inspector card (prevents flickering on rapid mouse movement)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedActiveId(activeId);
        }, 120);
        return () => clearTimeout(timer);
    }, [activeId]);

    // Active connections logic (instant response on canvas)
    const connectedNodeIds = useMemo(() => {
        if (!activeId) return new Set<string>();

        const connected = new Set<string>([activeId]);
        for (const edge of ECOSYSTEM_EDGES) {
            if (edge.source === activeId) connected.add(edge.target);
            if (edge.target === activeId) connected.add(edge.source);
        }
        return connected;
    }, [activeId]);

    // Inspector card active node data (debounced)
    const activeNode = useMemo(() => {
        return ECOSYSTEM_NODES.find((n) => n.id === debouncedActiveId) || ECOSYSTEM_NODES[0];
    }, [debouncedActiveId]);

    // Connected node count for inspector card
    const debouncedConnectedCount = useMemo(() => {
        const connected = new Set<string>([debouncedActiveId]);
        for (const edge of ECOSYSTEM_EDGES) {
            if (edge.source === debouncedActiveId) connected.add(edge.target);
            if (edge.target === debouncedActiveId) connected.add(edge.source);
        }
        return connected.size - 1;
    }, [debouncedActiveId]);

    const getCoords = (node: EcosystemNode) => ({
        x: (node.x / 100) * width,
        y: (node.y / 100) * height,
    });

    const ActiveProjectFallbackIcon = activeNode.type === "project" ? getProjectFallbackIcon(activeNode.id) : null;
    const ActiveTechFallbackIcon = activeNode.type === "tech" ? getTechFallbackIcon(activeNode.id) : null;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* SVG Constellation Map Canvas Box */}
            <div className="relative aspect-[16/9] w-full rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl cyber-card tactical-corner-reticles p-4 shadow-2xl overflow-hidden">
                {/* Parallax background star dots (theme dynamic) */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(hsl(var(--muted-foreground)/0.3)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full relative z-10">
                    <defs>
                        {/* ClipPath for iOS Squircle App Icons */}
                        <clipPath id="project-squircle-clip">
                            <rect x="-21" y="-21" width="42" height="42" rx="11" />
                        </clipPath>

                        {/* Full-Canvas Tactical Dot Matrix Pattern */}
                        <pattern id="ecosystem-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="1.2" fill="hsl(var(--muted-foreground))" opacity="0.32" />
                        </pattern>

                        {/* High-Voltage Plasma Glow Filter for Active Wires */}
                        <filter id="wire-plasma-glow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Inline CSS Keyframes for Seamless Continuous SVG Dash Animations */}
                        <style>{`
                            @keyframes electricPulseFlow {
                                0% { stroke-dashoffset: 24; }
                                100% { stroke-dashoffset: 0; }
                            }
                            @keyframes sparkPulseFlow {
                                0% { stroke-dashoffset: 20; }
                                100% { stroke-dashoffset: 0; }
                            }
                            @keyframes ambientWirePulse {
                                0% { stroke-dashoffset: 32; opacity: 0.15; }
                                50% { opacity: 0.35; }
                                100% { stroke-dashoffset: 0; opacity: 0.15; }
                            }
                            .electric-pulse-stream {
                                animation: electricPulseFlow 0.5s linear infinite;
                                will-change: stroke-dashoffset;
                            }
                            .spark-core-stream {
                                animation: sparkPulseFlow 0.35s linear infinite;
                                will-change: stroke-dashoffset;
                            }
                            .ambient-wire-stream {
                                animation: ambientWirePulse 3s linear infinite;
                                will-change: stroke-dashoffset;
                            }
                        `}</style>
                    </defs>

                    {/* Full Canvas Dot Grid Background Fill */}
                    <rect width={width} height={height} fill="url(#ecosystem-dot-grid)" rx="16" />

                    {/* Render Edge Connections */}
                    {ECOSYSTEM_EDGES.map((edge) => {
                        const sourceNode = ECOSYSTEM_NODES.find((n) => n.id === edge.source);
                        const targetNode = ECOSYSTEM_NODES.find((n) => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;

                        const isSourceActive = edge.source === activeId;
                        const isTargetActive = edge.target === activeId;
                        const isHighlighted =
                            connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target);

                        // Determine direction: energy flows OUTWARD from whichever node is active
                        let from = getCoords(sourceNode);
                        let to = getCoords(targetNode);
                        if (isTargetActive) {
                            from = getCoords(targetNode);
                            to = getCoords(sourceNode);
                        }

                        // Wire glow color takes the signature color of the active node
                        const activeNodeObj = ECOSYSTEM_NODES.find((n) => n.id === activeId);
                        const wireColor = isHighlighted
                            ? (activeNodeObj ? activeNodeObj.color : sourceNode.color)
                            : "hsl(var(--border) / 0.5)";

                        return (
                            <g key={`${edge.source}-${edge.target}`}>
                                {/* 1. Base Connection Wire with Smooth Stroke/Color Transition */}
                                <line
                                    x1={from.x}
                                    y1={from.y}
                                    x2={to.x}
                                    y2={to.y}
                                    stroke={wireColor}
                                    strokeWidth={isHighlighted ? 3.5 : 1}
                                    strokeOpacity={isHighlighted ? 0.35 : 0.3}
                                    strokeLinecap="round"
                                    className="transition-all duration-300 ease-out"
                                />

                                {/* 2. Idle Ambient Signal Stream (Always visible with subtle pulse when unhighlighted) */}
                                <line
                                    x1={from.x}
                                    y1={from.y}
                                    x2={to.x}
                                    y2={to.y}
                                    stroke={sourceNode.color}
                                    strokeWidth={1.5}
                                    strokeDasharray="4 12"
                                    strokeLinecap="round"
                                    className="ambient-wire-stream transition-opacity duration-300"
                                    style={{
                                        opacity: isHighlighted ? 0 : 0.25,
                                    }}
                                />

                                {/* 3. Primary Colored Electric Energy Stream (Smooth fade-in on highlight) */}
                                <line
                                    x1={from.x}
                                    y1={from.y}
                                    x2={to.x}
                                    y2={to.y}
                                    stroke={wireColor}
                                    strokeWidth={3}
                                    strokeDasharray="12 12"
                                    strokeLinecap="round"
                                    filter={isHighlighted ? "url(#wire-plasma-glow)" : undefined}
                                    className="electric-pulse-stream transition-all duration-300 ease-out"
                                    style={{
                                        opacity: isHighlighted ? 1 : 0,
                                    }}
                                />

                                {/* 4. White High-Voltage Plasma Spark Core (Smooth fade-in on highlight) */}
                                <line
                                    x1={from.x}
                                    y1={from.y}
                                    x2={to.x}
                                    y2={to.y}
                                    stroke="#ffffff"
                                    strokeWidth={1.5}
                                    strokeDasharray="5 15"
                                    strokeLinecap="round"
                                    className="spark-core-stream transition-all duration-300 ease-out"
                                    style={{
                                        opacity: isHighlighted ? 0.95 : 0,
                                    }}
                                />
                            </g>
                        );
                    })}

                    {/* Render Constellation Nodes */}
                    {ECOSYSTEM_NODES.map((node) => {
                        const { x, y } = getCoords(node);
                        const isConnected = connectedNodeIds.has(node.id);
                        const isSelected = activeId === node.id;
                        const isProject = node.type === "project";
                        const FallbackProjectIcon = isProject ? getProjectFallbackIcon(node.id) : null;
                        const FallbackTechIcon = !isProject ? getTechFallbackIcon(node.id) : null;

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${x}, ${y})`}
                                onMouseEnter={() => setHoveredNodeId(node.id)}
                                onMouseLeave={() => setHoveredNodeId(null)}
                                onClick={() => {
                                    setSelectedNodeId(node.id);
                                    setDebouncedActiveId(node.id);
                                }}
                                className="cursor-pointer group"
                            >
                                {/* Selection Glow Pulse Ring */}
                                {isSelected && (
                                    <rect
                                        x={isProject ? "-29" : "-17"}
                                        y={isProject ? "-29" : "-17"}
                                        width={isProject ? "58" : "34"}
                                        height={isProject ? "58" : "34"}
                                        rx={isProject ? "16" : "10"}
                                        fill="none"
                                        stroke={node.color}
                                        strokeWidth="2"
                                        className="animate-ping opacity-60"
                                    />
                                )}

                                {isProject ? (
                                    /* ── PROJECT NODE: Large iOS Squircle App Icon (46x46 rx=13) ── */
                                    <>
                                        <rect
                                            x="-23"
                                            y="-23"
                                            width="46"
                                            height="46"
                                            rx="13"
                                            fill="hsl(var(--card))"
                                            stroke={isConnected ? node.color : "hsl(var(--border))"}
                                            strokeWidth={isConnected ? "3" : "1.5"}
                                            className="transition-all duration-300 group-hover:scale-125 shadow-xl"
                                        />
                                        {node.iconUrl ? (
                                            <image
                                                href={node.iconUrl}
                                                x="-21"
                                                y="-21"
                                                width="42"
                                                height="42"
                                                preserveAspectRatio="xMidYMid slice"
                                                clipPath="url(#project-squircle-clip)"
                                                className="pointer-events-none transition-transform group-hover:scale-110"
                                            />
                                        ) : FallbackProjectIcon ? (
                                            <foreignObject x="-13" y="-13" width="26" height="26" className="pointer-events-none">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FallbackProjectIcon
                                                        className="w-6 h-6 transition-transform group-hover:scale-110"
                                                        style={{ color: node.color }}
                                                    />
                                                </div>
                                            </foreignObject>
                                        ) : (
                                            <circle r="8" fill={node.color} className={cn("transition-transform", isConnected && "animate-pulse")} />
                                        )}
                                    </>
                                ) : (
                                    /* ── TECH NODE: Compact Tech Skill Badge (26x26 rx=7) ── */
                                    <>
                                        <rect
                                            x="-13"
                                            y="-13"
                                            width="26"
                                            height="26"
                                            rx="7"
                                            fill="hsl(var(--card))"
                                            stroke={isConnected ? node.color : "hsl(var(--border))"}
                                            strokeWidth={isConnected ? "2" : "1"}
                                            className="transition-all duration-300 group-hover:scale-125 shadow-md"
                                        />
                                        {node.iconUrl ? (
                                            node.themeable ? (
                                                <foreignObject x="-9" y="-9" width="18" height="18" className="pointer-events-none">
                                                    <div
                                                        className="w-full h-full bg-foreground opacity-80 group-hover:opacity-100 transition-opacity"
                                                        style={{
                                                            maskImage: `url(${node.iconUrl})`,
                                                            WebkitMaskImage: `url(${node.iconUrl})`,
                                                            maskSize: "contain",
                                                            maskRepeat: "no-repeat",
                                                            maskPosition: "center",
                                                        }}
                                                    />
                                                </foreignObject>
                                            ) : (
                                                <image
                                                    href={node.iconUrl}
                                                    x="-8"
                                                    y="-8"
                                                    width="16"
                                                    height="16"
                                                    preserveAspectRatio="xMidYMid meet"
                                                    className="pointer-events-none transition-transform group-hover:scale-110"
                                                />
                                            )
                                        ) : FallbackTechIcon ? (
                                            <foreignObject x="-8" y="-8" width="16" height="16" className="pointer-events-none">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FallbackTechIcon
                                                        className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
                                                        style={{ color: node.color }}
                                                    />
                                                </div>
                                            </foreignObject>
                                        ) : null}
                                    </>
                                )}

                                {/* Node Title Label */}
                                <text
                                    y={isProject ? "38" : "30"}
                                    textAnchor="middle"
                                    fill={isConnected ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                                    fontSize={isProject ? "11" : "10"}
                                    fontWeight={isProject ? "bold" : "600"}
                                    fontFamily="var(--font-display), sans-serif"
                                    className="select-none transition-colors group-hover:fill-[hsl(var(--foreground))]"
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Selected Node Inspector Details Card (Debounced, Flicker-Free) */}
            <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl cyber-card tactical-corner-reticles p-5 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200">
                <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        {activeNode.iconUrl ? (
                            activeNode.themeable ? (
                                <div
                                    className="w-6 h-6 bg-foreground shrink-0"
                                    style={{
                                        maskImage: `url(${activeNode.iconUrl})`,
                                        WebkitMaskImage: `url(${activeNode.iconUrl})`,
                                        maskSize: "contain",
                                        maskRepeat: "no-repeat",
                                        maskPosition: "center",
                                    }}
                                />
                            ) : (
                                <img
                                    src={activeNode.iconUrl}
                                    alt={activeNode.label}
                                    className="w-6 h-6 object-contain shrink-0"
                                />
                            )
                        ) : ActiveProjectFallbackIcon ? (
                            <ActiveProjectFallbackIcon className="w-6 h-6 shrink-0" style={{ color: activeNode.color }} />
                        ) : ActiveTechFallbackIcon ? (
                            <ActiveTechFallbackIcon className="w-6 h-6 shrink-0" style={{ color: activeNode.color }} />
                        ) : (
                            <span className="h-3 w-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: activeNode.color }} />
                        )}

                        <h4 className="text-base sm:text-lg font-bold font-display text-foreground tracking-tight">
                            {activeNode.label}
                        </h4>
                        <span
                            className="hud-tag"
                            style={{
                                color: activeNode.color,
                                borderColor: `color-mix(in srgb, ${activeNode.color} 40%, transparent)`,
                                backgroundColor: `color-mix(in srgb, ${activeNode.color} 12%, transparent)`,
                            }}
                        >
                            {activeNode.type === "project" ? "PROJECT HUB" : "TECH CLUSTER"}
                        </span>
                    </div>
                    {activeNode.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                            {activeNode.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
                    <Sparkles className="h-4 w-4 text-[hsl(var(--accent-purple))] shrink-0" aria-hidden="true" />
                    <span>Connected to <strong className="text-foreground">{debouncedConnectedCount}</strong> shared architecture nodes</span>
                </div>
            </div>
        </div>
    );
});
