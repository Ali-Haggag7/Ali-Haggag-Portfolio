"use client";

import {
    memo,
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import type { ArchitectureMap, SystemNode } from "./architectureData";
import {
    CATEGORY_SPECS,
    getUpstreamNodes,
    getDownstreamNodes,
} from "./architectureData";
import {
    Monitor,
    Server,
    Database,
    Zap,
    Network,
    ShieldAlert,
    Cpu,
    ArrowRight,
    Workflow,
    Compass,
    Sparkles,
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

const CATEGORY_ICONS: Record<SystemNode["category"], typeof Server> = {
    client: Monitor,
    api: Server,
    worker: Cpu,
    cache: Zap,
    database: Database,
    infra: Network,
};

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
        updateAnchors();
        const handleResize = () => updateAnchors();
        window.addEventListener("resize", handleResize);

        const observer = new ResizeObserver(() => updateAnchors());
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
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

                // Wire connects from right socket of source to left socket of target (or bottom to top)
                const fromPoint =
                    sourceAnchor.right.x < targetAnchor.left.x
                        ? sourceAnchor.right
                        : sourceAnchor.bottom;
                const toPoint =
                    sourceAnchor.right.x < targetAnchor.left.x
                        ? targetAnchor.left
                        : targetAnchor.top;

                const sourceCategory = CATEGORY_SPECS[sourceNode.category];

                lines.push({
                    from: fromPoint,
                    to: toPoint,
                    id: `${sourceNode.id}->${targetId}`,
                    isDirect: isConnectedToSelected,
                    isDownstream,
                    color: isConnectedToSelected ? sourceCategory.color : "hsl(var(--border) / 0.5)",
                });
            });
        });

        return lines;
    }, [map.nodes, anchorMap, selectedNodeId]);

    const buildPath = (p1: Point, p2: Point) => {
        const dx = Math.abs(p2.x - p1.x);
        const curveOffset = Math.max(25, dx * 0.4);
        const cp1x = p1.x < p2.x ? p1.x + curveOffset : p1.x - curveOffset;
        const cp2x = p2.x > p1.x ? p2.x - curveOffset : p2.x + curveOffset;
        return `M ${p1.x} ${p1.y} C ${cp1x} ${p1.y}, ${cp2x} ${p2.y}, ${p2.x} ${p2.y}`;
    };

    return (
        <div className="flex flex-col h-full rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 sm:p-5 relative shadow-xl overflow-hidden">
            {/* Top Canvas Header Bar */}
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
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>SYSTEM ANATOMY ACTIVE</span>
                </div>
            </div>

            {/* Architecture Spine Overview Banner */}
            <div className="py-2.5 px-3 my-2 rounded-xl border border-border/50 bg-muted/20 text-xs text-muted-foreground flex items-center justify-between gap-3">
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
                    CLICK TO FOCUS COMPONENT
                </span>
            </div>

            {/* Central Layered Anatomical Board */}
            <div
                ref={containerRef}
                className="relative flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 min-h-[460px] select-none"
            >
                {/* SVG Architectural Highways Overlay */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block"
                    aria-hidden="true"
                >
                    {connectionLines.map((line) => {
                        const pathData = buildPath(line.from, line.to);
                        return (
                            <g key={line.id}>
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke={line.color}
                                    strokeWidth={line.isDirect ? 2.5 : 1}
                                    strokeOpacity={line.isDirect ? 0.9 : 0.3}
                                    strokeDasharray={line.isDirect ? undefined : "3 3"}
                                    strokeLinecap="round"
                                    className="transition-all duration-300"
                                />
                                {line.isDirect && (
                                    <circle
                                        r="3"
                                        fill="#ffffff"
                                        opacity="0.8"
                                        className="motion-safe:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
                                    >
                                        <animateMotion path={pathData} dur="2s" repeatCount="indefinite" />
                                    </circle>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* 3 Structured Architectural Columns */}
                {tierLayers.map((layer) => (
                    <div
                        key={layer.id}
                        className="flex flex-col justify-between gap-3 relative z-20"
                    >
                        <div className="text-[10px] font-mono tracking-wider text-muted-foreground/80 uppercase font-semibold pb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                            <span>{layer.label}</span>
                        </div>

                        <div className="flex flex-col gap-3 flex-1 justify-around">
                            {layer.nodes.map((node) => {
                                const isSelected = node.id === selectedNodeId;
                                const isDownstream = downstreamSet.has(node.id);
                                const isUpstream = upstreamSet.has(node.id);
                                const isConnected = isDownstream || isUpstream;
                                const isMuted = !isSelected && !isConnected && Boolean(selectedNodeId);

                                const catSpec = CATEGORY_SPECS[node.category];
                                const Icon = CATEGORY_ICONS[node.category];

                                return (
                                    <div
                                        key={node.id}
                                        ref={(el) => registerRef(node.id, el)}
                                        onClick={() => onSelectNode(node.id)}
                                        className={cn(
                                            "cursor-pointer group relative p-3 rounded-xl border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                            isSelected
                                                ? "bg-card shadow-xl ring-2 scale-[1.02]"
                                                : isConnected
                                                ? "bg-muted/40 hover:bg-muted/60 shadow-xs"
                                                : "bg-card/70 hover:bg-muted/30",
                                            isMuted && "opacity-35 hover:opacity-80"
                                        )}
                                        style={{
                                            borderColor: isSelected
                                                ? catSpec.color
                                                : isConnected
                                                ? `color-mix(in srgb, ${catSpec.color} 50%, hsl(var(--border)))`
                                                : "hsl(var(--border))",
                                        }}
                                    >
                                        {/* Header Row: Category Badge + Status */}
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span
                                                className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.2 rounded uppercase border"
                                                style={{
                                                    color: catSpec.color,
                                                    backgroundColor: `color-mix(in srgb, ${catSpec.color} 10%, transparent)`,
                                                    borderColor: `color-mix(in srgb, ${catSpec.color} 30%, transparent)`,
                                                }}
                                            >
                                                {catSpec.badge}
                                            </span>

                                            {isDownstream && (
                                                <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
                                                    <span>RECEIVES</span>
                                                    <ArrowRight className="w-2.5 h-2.5" />
                                                </span>
                                            )}

                                            {isUpstream && (
                                                <span className="text-[9px] font-mono text-blue-400 flex items-center gap-0.5">
                                                    <span>INVOKES</span>
                                                </span>
                                            )}

                                            {node.scarId && !isDownstream && !isUpstream && (
                                                <span
                                                    className="flex items-center gap-0.5 text-[9px] font-mono text-red-400"
                                                    title={`Incident: ${node.scarId}`}
                                                >
                                                    <ShieldAlert className="w-2.5 h-2.5" />
                                                    <span>SCAR</span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Node Body */}
                                        <div className="flex items-start gap-2.5">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center p-1 border border-border/80 bg-muted/40 shadow-xs shrink-0 group-hover:scale-105 transition-transform mt-0.5"
                                                style={{
                                                    borderColor: isSelected ? catSpec.color : "hsl(var(--border))",
                                                }}
                                            >
                                                <Icon
                                                    className="w-4 h-4"
                                                    style={{ color: catSpec.color }}
                                                    aria-hidden="true"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-bold font-display text-foreground group-hover:text-[hsl(var(--accent-blue))] transition-colors truncate">
                                                    {node.label}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground truncate">
                                                    {node.role}
                                                </div>
                                                <div className="text-[9px] font-mono text-muted-foreground/75 truncate mt-1">
                                                    {node.tech}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Left and right socket connection points */}
                                        <div
                                            className="hidden md:block absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-card shadow-xs transition-colors"
                                            style={{
                                                backgroundColor:
                                                    isSelected || isConnected ? catSpec.color : "hsl(var(--border))",
                                            }}
                                        />
                                        <div
                                            className="hidden md:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-card shadow-xs transition-colors"
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
    );
});
