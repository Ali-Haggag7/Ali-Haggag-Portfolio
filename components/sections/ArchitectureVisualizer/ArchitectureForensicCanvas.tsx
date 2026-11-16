"use client";

import {
    memo,
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import type { ArchitectureMap } from "./architectureData";
import {
    CATEGORY_SPECS,
    getUpstreamNodes,
    getDownstreamNodes,
} from "./architectureData";
import {
    Workflow,
    Compass,
    ArrowRight,
    ArrowLeft,
    ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchitectureForensicCanvasProps {
    map: ArchitectureMap;
    selectedNodeId: string;
    onSelectNode: (nodeId: string) => void;
}

interface Point {
    x: number;
    y: number;
}

export const ArchitectureForensicCanvas = memo(function ArchitectureForensicCanvas({
    map,
    selectedNodeId,
    onSelectNode,
}: ArchitectureForensicCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());

    // Coordinate map for DOM socket anchors
    const [anchorMap, setAnchorMap] = useState<
        Map<string, { left: Point; right: Point; top: Point; bottom: Point; center: Point }>
    >(new Map());

    const registerRef = useCallback((id: string, el: HTMLElement | null) => {
        if (el) {
            nodeRefs.current.set(id, el);
        } else {
            nodeRefs.current.delete(id);
        }
    }, []);

    const updateAnchors = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const newMap = new Map<
            string,
            { left: Point; right: Point; top: Point; bottom: Point; center: Point }
        >();

        nodeRefs.current.forEach((el, id) => {
            const rect = el.getBoundingClientRect();
            newMap.set(id, {
                left: {
                    x: rect.left - containerRect.left,
                    y: rect.top + rect.height / 2 - containerRect.top,
                },
                right: {
                    x: rect.right - containerRect.left,
                    y: rect.top + rect.height / 2 - containerRect.top,
                },
                top: {
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top - containerRect.top,
                },
                bottom: {
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.bottom - containerRect.top,
                },
                center: {
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top + rect.height / 2 - containerRect.top,
                },
            });
        });

        setAnchorMap(newMap);
    }, []);

    useEffect(() => {
        const rafId = requestAnimationFrame(() => updateAnchors());
        const handleResize = () => updateAnchors();
        window.addEventListener("resize", handleResize);

        const observer = new ResizeObserver(() => updateAnchors());
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
        };
    }, [updateAnchors, map.id]);

    // Active dependencies
    const upstreamNodes = useMemo(() => getUpstreamNodes(map, selectedNodeId), [map, selectedNodeId]);
    const downstreamNodes = useMemo(() => getDownstreamNodes(map, selectedNodeId), [map, selectedNodeId]);
    const upstreamSet = useMemo(() => new Set(upstreamNodes.map((n) => n.id)), [upstreamNodes]);
    const downstreamSet = useMemo(() => new Set(downstreamNodes.map((n) => n.id)), [downstreamNodes]);

    // Group nodes by architectural tier layers
    const tierLayers = useMemo(() => {
        const clients = map.nodes.filter((n) => n.category === "client");
        const execution = map.nodes.filter((n) => n.category === "api" || n.category === "worker");
        const stateAndData = map.nodes.filter(
            (n) => n.category === "cache" || n.category === "database" || n.category === "infra"
        );

        return [
            { id: "layer-clients", label: "01 // Ingress & Client Viewports", nodes: clients },
            { id: "layer-execution", label: "02 // Authority & Execution Spine", nodes: execution },
            { id: "layer-state", label: "03 // State, Persistence & Gateways", nodes: stateAndData },
        ].filter((l) => l.nodes.length > 0);
    }, [map.nodes]);

    // Generate dynamic architectural bus lines
    const connectionLines = useMemo(() => {
        const lines: {
            from: Point;
            to: Point;
            id: string;
            isDirect: boolean;
            isDownstream: boolean;
            orientation: "horizontal" | "vertical";
            color: string;
        }[] = [];

        map.nodes.forEach((sourceNode) => {
            const sourceAnchor = anchorMap.get(sourceNode.id);
            if (!sourceAnchor) return;

            sourceNode.connections.forEach((targetId) => {
                const targetAnchor = anchorMap.get(targetId);
                if (!targetAnchor) return;

                const isConnectedToSelected =
                    sourceNode.id === selectedNodeId || targetId === selectedNodeId;
                const isDownstream = sourceNode.id === selectedNodeId;

                const isHorizontalCross = sourceAnchor.right.x <= targetAnchor.left.x + 4;
                const isTargetBelow = sourceAnchor.center.y <= targetAnchor.center.y;

                // Wire connects horizontally across chambers, or vertically within the same chamber
                const fromPoint = isHorizontalCross
                    ? sourceAnchor.right
                    : isTargetBelow
                    ? sourceAnchor.bottom
                    : sourceAnchor.top;
                const toPoint = isHorizontalCross
                    ? targetAnchor.left
                    : isTargetBelow
                    ? targetAnchor.top
                    : targetAnchor.bottom;

                const sourceCategory = CATEGORY_SPECS[sourceNode.category];

                lines.push({
                    from: fromPoint,
                    to: toPoint,
                    id: `${sourceNode.id}->${targetId}`,
                    isDirect: isConnectedToSelected,
                    isDownstream,
                    orientation: isHorizontalCross ? "horizontal" : "vertical",
                    color: isConnectedToSelected ? sourceCategory.color : "hsl(var(--border) / 0.5)",
                });
            });
        });

        return lines;
    }, [map.nodes, anchorMap, selectedNodeId]);

    const buildPath = (
        p1: Point,
        p2: Point,
        orientation: "horizontal" | "vertical"
    ) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // Adjacent touching segments with near-zero gap: draw a short bus bridge across the seam
        if (absDx < 16 && absDy < 16) {
            return orientation === "horizontal"
                ? `M ${p1.x - 10} ${p1.y} L ${p2.x + 10} ${p2.y}`
                : `M ${p1.x} ${p1.y - 10} L ${p2.x} ${p2.y + 10}`;
        }

        // Adjacent chambers or vertical jumps along the same column/seam: curve cleanly along Y
        if (absDx < 16) {
            return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy * 0.45}, ${p2.x} ${p2.y - dy * 0.45}, ${p2.x} ${p2.y}`;
        }

        const curveOffset = Math.max(25, absDx * 0.4);
        const cp1x = p1.x < p2.x ? p1.x + curveOffset : p1.x - curveOffset;
        const cp2x = p2.x > p1.x ? p2.x - curveOffset : p2.x + curveOffset;
        return `M ${p1.x} ${p1.y} C ${cp1x} ${p1.y}, ${cp2x} ${p2.y}, ${p2.x} ${p2.y}`;
    };

    return (
        <div className="flex flex-col h-full rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 sm:p-5 relative shadow-xl overflow-hidden">
            {/* Top Blueprint Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70 text-xs font-mono">
                <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[hsl(var(--accent-blue))]" />
                    <span className="font-bold text-foreground font-sans">
                        {map.title}
                    </span>
                    <span className="text-muted-foreground hidden sm:inline">
                        — {map.subtitle}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--accent-emerald))] animate-pulse" />
                    <span>SCHEMATIC REGISTER ACTIVE</span>
                </div>
            </div>

            {/* Architecture Spine Overview Banner */}
            <div className="py-2 px-3 my-2 rounded-xl border border-border/50 bg-muted/20 text-xs text-muted-foreground flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <Workflow className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
                    <span className="text-[11px] font-sans text-foreground/90 truncate">
                        <strong className="font-mono text-muted-foreground uppercase text-[10px] mr-1.5">
                            Spine:
                        </strong>
                        {map.spineDescription}
                    </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/70 shrink-0 hidden md:inline">
                    TAP COMPONENT TO INSPECT
                </span>
            </div>

            {/* Central Layered Anatomical Board */}
            <div
                ref={containerRef}
                className="relative flex-1 flex flex-col pt-2 min-h-[460px] select-none"
            >
                {/* SVG Architectural Highways Overlay */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-20 hidden md:block"
                    aria-hidden="true"
                >
                    {connectionLines.map((line) => {
                        const pathData = buildPath(line.from, line.to, line.orientation);
                        return (
                            <g key={line.id}>
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke={line.color}
                                    strokeWidth={line.isDirect ? 2.5 : 1}
                                    strokeOpacity={line.isDirect ? 0.85 : 0.3}
                                    strokeDasharray={line.isDirect ? undefined : "3 3"}
                                    strokeLinecap="round"
                                    className="transition-all duration-300"
                                />
                                {line.isDirect && (
                                    <circle
                                        r="2.5"
                                        fill={line.color}
                                        opacity="0.9"
                                        style={{ filter: `drop-shadow(0 0 4px ${line.color})` }}
                                    >
                                        <animateMotion path={pathData} dur="2.5s" repeatCount="indefinite" />
                                    </circle>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Unified Monolithic Schematic Die — 3 Partitioned Chambers */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 border border-border/70 rounded-xl bg-card/40 backdrop-blur-md overflow-hidden relative z-10">
                    {tierLayers.map((layer, layerIdx) => (
                        <div
                            key={layer.id}
                            className={cn(
                                "flex flex-col justify-between",
                                layerIdx < tierLayers.length - 1 && "border-b md:border-b-0 md:border-r border-border/60"
                            )}
                        >
                            {/* Chamber Blueprint Header */}
                            <div className="px-3.5 py-2 bg-muted/20 border-b border-border/60 flex items-center justify-between text-[10px] font-mono">
                                <span className="font-semibold text-foreground/80 tracking-wider uppercase">
                                    {layer.label}
                                </span>
                                <span className="text-[9px] text-muted-foreground/60">
                                    CHAMBER.0{layerIdx + 1}
                                </span>
                            </div>

                            {/* Integrated Architectural Die Segments (Zero Floating Cards) */}
                            <div className="flex flex-col divide-y divide-border/50 flex-1">
                                {layer.nodes.map((node) => {
                                    const isSelected = node.id === selectedNodeId;
                                    const isDownstream = downstreamSet.has(node.id);
                                    const isUpstream = upstreamSet.has(node.id);
                                    const isConnected = isDownstream || isUpstream;

                                    const catSpec = CATEGORY_SPECS[node.category];

                                    return (
                                        <div
                                            key={node.id}
                                            ref={(el) => registerRef(node.id, el)}
                                            role="button"
                                            tabIndex={0}
                                            aria-pressed={isSelected}
                                            onClick={() => onSelectNode(node.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    onSelectNode(node.id);
                                                }
                                            }}
                                            className={cn(
                                                "cursor-pointer group relative p-3.5 transition-all duration-200 flex-1 flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring outline-none",
                                                isSelected
                                                    ? "bg-muted/40 shadow-inner"
                                                    : isConnected
                                                    ? "bg-muted/20 hover:bg-muted/30"
                                                    : "bg-transparent hover:bg-muted/15"
                                            )}
                                            style={{
                                                borderLeft: isSelected
                                                    ? `3px solid ${catSpec.color}`
                                                    : isConnected
                                                    ? `3px solid color-mix(in srgb, ${catSpec.color} 50%, transparent)`
                                                    : "3px solid transparent",
                                            }}
                                        >
                                            {/* Micro-etched Header Register */}
                                            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                                        style={{ backgroundColor: catSpec.color }}
                                                    />
                                                    <span className="font-semibold tracking-wider uppercase text-foreground/90 truncate">
                                                        {node.category.toUpperCase()}::{node.id.split("-").pop()?.toUpperCase()}
                                                    </span>
                                                </div>

                                                <div className="shrink-0 pl-1">
                                                    {node.scarId ? (
                                                        <span className="flex items-center gap-1 text-[9px] font-mono font-semibold text-[var(--scar-critical)]">
                                                            <ShieldAlert className="w-2.5 h-2.5" />
                                                            <span>SCAR #{node.scarId}</span>
                                                        </span>
                                                    ) : isDownstream ? (
                                                        <span className="text-[9px] font-mono text-[hsl(var(--accent-emerald))] font-semibold tracking-wider flex items-center gap-0.5">
                                                            <span>RECV_BUS</span>
                                                            <ArrowRight className="w-2.5 h-2.5" />
                                                        </span>
                                                    ) : isUpstream ? (
                                                        <span className="text-[9px] font-mono text-[hsl(var(--accent-blue))] font-semibold tracking-wider flex items-center gap-0.5">
                                                            <ArrowLeft className="w-2.5 h-2.5" />
                                                            <span>CALL_BUS</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-mono text-muted-foreground/60">
                                                            ONLINE
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Segment Body: Bold Editorial Typography */}
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-bold font-display tracking-tight text-foreground group-hover:text-[hsl(var(--accent-blue))] transition-colors">
                                                    {node.label}
                                                </h4>
                                                <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                                                    {node.role}
                                                </p>
                                            </div>

                                            {/* Terminal Footer Strip */}
                                            <div className="pt-2 mt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                                                <span className="truncate max-w-[75%] text-foreground/80 font-medium">
                                                    {node.tech}
                                                </span>
                                                <span className="shrink-0 text-[9px] text-muted-foreground/60 tracking-wider">
                                                    {node.connections.length > 0
                                                        ? `${node.connections.length} BUS`
                                                        : "TERM"}
                                                </span>
                                            </div>

                                            {/* Terminal Pin Contact Pads */}
                                            <div
                                                className="hidden md:block absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-xs border border-card shadow-xs transition-colors"
                                                style={{
                                                    backgroundColor:
                                                        isSelected || isConnected ? catSpec.color : "hsl(var(--border))",
                                                }}
                                            />
                                            <div
                                                className="hidden md:block absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-xs border border-card shadow-xs transition-colors"
                                                style={{
                                                    backgroundColor:
                                                        isSelected || isConnected ? catSpec.color : "hsl(var(--border))",
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});
