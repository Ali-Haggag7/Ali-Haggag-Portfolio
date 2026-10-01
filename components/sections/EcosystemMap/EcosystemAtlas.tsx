"use client";

import {
    memo,
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import {
    PROJECT_STATIONS,
    TECH_BRIDGES,
    type ProjectStation,
    type TechBridge,
    type FilterLens,
    matchesFilterLens,
    getConnectedSiblingProjects,
    getProjectsUsingTech,
} from "./ecosystem.data";
import {
    Activity,
    Cpu,
    RotateCcw,
    Layers,
    SlidersHorizontal,
    Share2,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosystemAtlasProps {
    selectedEntity:
        | { type: "project"; data: ProjectStation }
        | { type: "tech"; data: TechBridge };
    onSelectProject: (projectId: string) => void;
    onSelectTech: (techId: string) => void;
    onResetToOverview: () => void;
    activeLens: FilterLens;
    onLensChange: (lens: FilterLens) => void;
}

interface Point {
    x: number;
    y: number;
}

export const EcosystemAtlas = memo(function EcosystemAtlas({
    selectedEntity,
    onSelectProject,
    onSelectTech,
    onResetToOverview,
    activeLens,
    onLensChange,
}: EcosystemAtlasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());

    // Coordinates of socket anchors in container space
    const [anchorMap, setAnchorMap] = useState<
        Map<string, { left: Point; right: Point; center: Point }>
    >(new Map());

    // Register node DOM element
    const registerRef = useCallback((id: string, el: HTMLElement | null) => {
        if (el) {
            nodeRefs.current.set(id, el);
        } else {
            nodeRefs.current.delete(id);
        }
    }, []);

    // Recalculate anchor points on mount, resize, and DOM changes
    const updateAnchors = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const newMap = new Map<string, { left: Point; right: Point; center: Point }>();

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

        // ResizeObserver on container to handle fonts and flex wrap
        const observer = new ResizeObserver(() => updateAnchors());
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
        };
    }, [updateAnchors]);

    // Split projects into Left Sector (Engines & Agents) and Right Sector (Platforms & Services)
    const leftProjects = useMemo(
        () => PROJECT_STATIONS.slice(0, 3), // Logic Arena, Scout AI, Flurry
        []
    );
    const rightProjects = useMemo(
        () => PROJECT_STATIONS.slice(3, 6), // Cybership, CS Arena, Blog Pro
        []
    );

    // Active Selection details
    const isProjectSelected = selectedEntity.type === "project";
    const selectedProject = isProjectSelected
        ? (selectedEntity.data as ProjectStation)
        : null;
    const selectedTech = !isProjectSelected
        ? (selectedEntity.data as TechBridge)
        : null;

    // Direct active tech IDs
    const activeTechIds = useMemo(() => {
        if (selectedProject) return new Set(selectedProject.techIds);
        if (selectedTech) return new Set([selectedTech.id]);
        return new Set<string>();
    }, [selectedProject, selectedTech]);

    // Sibling project IDs connected via active entity
    const siblingProjectMap = useMemo(() => {
        const map = new Map<string, number>();
        if (selectedProject) {
            const siblings = getConnectedSiblingProjects(selectedProject.id);
            siblings.forEach((s) => map.set(s.project.id, s.sharedTech.length));
        } else if (selectedTech) {
            const using = getProjectsUsingTech(selectedTech.id);
            using.forEach((u) => map.set(u.project.id, 1));
        }
        return map;
    }, [selectedProject, selectedTech]);

    // Active connection lines to render
    const activeConnections = useMemo(() => {
        const lines: {
            from: Point;
            to: Point;
            id: string;
            accentColor: string;
            isPrimary: boolean;
        }[] = [];

        if (isProjectSelected && selectedProject) {
            const projAnchor = anchorMap.get(selectedProject.id);
            if (!projAnchor) return lines;

            const isLeft = leftProjects.some((p) => p.id === selectedProject.id);
            const sourcePoint = isLeft ? projAnchor.right : projAnchor.left;

            // Lines to active tech bridges
            selectedProject.techIds.forEach((techId) => {
                const techAnchor = anchorMap.get(techId);
                if (!techAnchor) return;
                const targetPoint = isLeft ? techAnchor.left : techAnchor.right;

                lines.push({
                    from: sourcePoint,
                    to: targetPoint,
                    id: `${selectedProject.id}-${techId}`,
                    accentColor: selectedProject.accentColor,
                    isPrimary: true,
                });

                // Secondary lines from tech bridge to sibling projects
                leftProjects.concat(rightProjects).forEach((otherProj) => {
                    if (otherProj.id === selectedProject.id) return;
                    if (otherProj.techIds.includes(techId)) {
                        const otherAnchor = anchorMap.get(otherProj.id);
                        if (!otherAnchor) return;
                        const otherIsLeft = leftProjects.some((p) => p.id === otherProj.id);
                        const techOutPoint = otherIsLeft ? techAnchor.left : techAnchor.right;
                        const otherInPoint = otherIsLeft ? otherAnchor.right : otherAnchor.left;

                        lines.push({
                            from: techOutPoint,
                            to: otherInPoint,
                            id: `sec-${techId}-${otherProj.id}`,
                            accentColor: "hsl(var(--muted-foreground) / 0.4)",
                            isPrimary: false,
                        });
                    }
                });
            });
        } else if (!isProjectSelected && selectedTech) {
            const techAnchor = anchorMap.get(selectedTech.id);
            if (!techAnchor) return lines;

            selectedTech.implementations.forEach((impl) => {
                const projAnchor = anchorMap.get(impl.projectId);
                if (!projAnchor) return;
                const isLeft = leftProjects.some((p) => p.id === impl.projectId);
                const projPoint = isLeft ? projAnchor.right : projAnchor.left;
                const techPoint = isLeft ? techAnchor.left : techAnchor.right;

                lines.push({
                    from: techPoint,
                    to: projPoint,
                    id: `${selectedTech.id}-${impl.projectId}`,
                    accentColor: selectedTech.accentColor,
                    isPrimary: true,
                });
            });
        }

        return lines;
    }, [
        isProjectSelected,
        selectedProject,
        selectedTech,
        anchorMap,
        leftProjects,
        rightProjects,
    ]);

    // Build smooth cubic bezier highway curve
    const buildCurve = (p1: Point, p2: Point) => {
        const dx = Math.abs(p2.x - p1.x);
        const curveOffset = Math.max(30, dx * 0.45);
        const cp1x = p1.x < p2.x ? p1.x + curveOffset : p1.x - curveOffset;
        const cp2x = p2.x > p1.x ? p2.x - curveOffset : p2.x + curveOffset;
        return `M ${p1.x} ${p1.y} C ${cp1x} ${p1.y}, ${cp2x} ${p2.y}, ${p2.x} ${p2.y}`;
    };

    return (
        <div className="flex flex-col h-full rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 sm:p-5 relative shadow-xl overflow-hidden">
            {/* Top Atlas Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/70 text-xs font-mono">
                {/* Architectural Lenses Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
                    <span className="text-muted-foreground mr-1 text-[11px] flex items-center gap-1">
                        <SlidersHorizontal className="w-3 h-3" />
                        <span>LENS:</span>
                    </span>
                    {(
                        [
                            { id: "all", label: "Full Atlas" },
                            { id: "realtime", label: "Real-Time Mesh" },
                            { id: "engines-ai", label: "Core Engines & AI" },
                            { id: "distributed-web", label: "Distributed Web" },
                        ] as const
                    ).map((filter) => {
                        const isActive = activeLens === filter.id;
                        return (
                            <button
                                key={filter.id}
                                type="button"
                                onClick={() => onLensChange(filter.id)}
                                className={cn(
                                    "cursor-pointer px-2.5 py-1 rounded-md text-[11px] font-sans font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                    isActive
                                        ? "bg-foreground text-background font-semibold shadow-sm"
                                        : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>

                {/* Telemetry Status Readout & Reset Button */}
                <div className="flex items-center gap-3 ml-auto">
                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>
                            {selectedProject
                                ? `FOCUSED: ${selectedProject.shortName.toUpperCase()}`
                                : selectedTech
                                ? `BRIDGE: ${selectedTech.name.toUpperCase()}`
                                : "CROSS-STACK TOPOLOGY"}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onResetToOverview}
                        className="cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-md border border-border/60 bg-muted/20 hover:bg-muted/40 text-[11px] text-muted-foreground hover:text-foreground transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none"
                        title="Reset selection to overview"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span>Overview</span>
                    </button>
                </div>
            </div>

            {/* Central Interactive Spatial Board */}
            <div
                ref={containerRef}
                className="relative flex-1 grid grid-cols-12 gap-3 sm:gap-4 pt-4 min-h-[500px] select-none"
            >
                {/* ═══════════════════════════════════════════════════════════
                   SVG DYNAMIC SIGNAL HIGHWAYS OVERLAY
                   ═══════════════════════════════════════════════════════════ */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    aria-hidden="true"
                >
                    <defs>
                        <filter id="atlas-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Ambient / Passive Connecting Wires */}
                    {activeConnections.map((line) => {
                        const pathData = buildCurve(line.from, line.to);
                        return (
                            <g key={line.id}>
                                {/* Base Wire */}
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke={line.accentColor}
                                    strokeWidth={line.isPrimary ? 2 : 1}
                                    strokeOpacity={line.isPrimary ? 0.75 : 0.25}
                                    strokeDasharray={line.isPrimary ? "none" : "3 3"}
                                    strokeLinecap="round"
                                    className="transition-all duration-300"
                                />
                                {/* Pulsing Data Flow Particle */}
                                {line.isPrimary && (
                                    <path
                                        d={pathData}
                                        fill="none"
                                        stroke="#ffffff"
                                        strokeWidth="2.5"
                                        strokeDasharray="6 24"
                                        strokeLinecap="round"
                                        className="motion-safe:animate-[marquee_2s_linear_infinite]"
                                        opacity="0.9"
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* ═══════════════════════════════════════════════════════════
                   LEFT WING: ENGINES & AUTONOMOUS AGENTS (3 Stations)
                   ═══════════════════════════════════════════════════════════ */}
                <div className="col-span-4 flex flex-col justify-between gap-3 relative z-20">
                    <div className="text-[10px] font-mono tracking-wider text-muted-foreground/80 uppercase font-semibold flex items-center gap-1.5 pb-1">
                        <Activity className="w-3 h-3 text-[hsl(var(--accent-emerald))]" />
                        <span>Core Engines &amp; Real-Time</span>
                    </div>

                    {leftProjects.map((proj) => {
                        const isSelected = selectedProject?.id === proj.id;
                        const isFiltered = !matchesFilterLens(proj, activeLens);
                        const sharedCount = siblingProjectMap.get(proj.id) || 0;
                        const isSibling = sharedCount > 0 && !isSelected;

                        return (
                            <div
                                key={proj.id}
                                ref={(el) => registerRef(proj.id, el)}
                                onClick={() => onSelectProject(proj.id)}
                                className={cn(
                                    "cursor-pointer group relative p-3 rounded-xl border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                    isSelected
                                        ? "bg-card shadow-lg ring-1"
                                        : isSibling
                                        ? "bg-muted/30 hover:bg-muted/50"
                                        : "bg-card/70 hover:bg-muted/30",
                                    isFiltered && "opacity-25 pointer-events-none"
                                )}
                                style={{
                                    borderColor: isSelected
                                        ? proj.accentColor
                                        : isSibling
                                        ? `color-mix(in srgb, ${proj.accentColor} 50%, hsl(var(--border)))`
                                        : "hsl(var(--border))",
                                }}
                            >
                                {/* Sibling / Focus Badge */}
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <span
                                        className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.2 rounded uppercase border"
                                        style={{
                                            color: proj.accentColor,
                                            backgroundColor: `color-mix(in srgb, ${proj.accentColor} 12%, transparent)`,
                                            borderColor: `color-mix(in srgb, ${proj.accentColor} 30%, transparent)`,
                                        }}
                                    >
                                        {proj.categoryBadge}
                                    </span>
                                    {isSibling && (
                                        <span className="text-[9px] font-mono text-[hsl(var(--accent-blue))] flex items-center gap-0.5">
                                            <Share2 className="w-2.5 h-2.5" />
                                            <span>
                                                {selectedTech ? "POWERS" : `${sharedCount} SHARED`}
                                            </span>
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center p-1 border border-border/80 bg-muted/40 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                                        style={{
                                            borderColor: isSelected
                                                ? proj.accentColor
                                                : "hsl(var(--border))",
                                        }}
                                    >
                                        {proj.iconUrl ? (
                                            <img
                                                src={proj.iconUrl}
                                                alt={proj.name}
                                                className="w-full h-full object-contain rounded"
                                            />
                                        ) : (
                                            <proj.FallbackIcon
                                                className="w-5 h-5"
                                                style={{ color: proj.accentColor }}
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-bold font-display text-foreground truncate group-hover:text-[hsl(var(--accent-blue))] transition-colors">
                                            {proj.name}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground truncate">
                                            {proj.metrics[0].value} • {proj.metrics[0].label}
                                        </div>
                                    </div>
                                </div>

                                {/* Connection socket dot right */}
                                <div
                                    className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm transition-all"
                                    style={{
                                        backgroundColor: isSelected
                                            ? proj.accentColor
                                            : isSibling
                                            ? proj.accentColor
                                            : "hsl(var(--border))",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* ═══════════════════════════════════════════════════════════
                   CENTER NEXUS: SHARED INFRASTRUCTURE BRIDGES (8 Chips)
                   ═══════════════════════════════════════════════════════════ */}
                <div className="col-span-4 flex flex-col justify-between relative z-20 px-1">
                    <div className="text-[10px] font-mono tracking-wider text-muted-foreground/80 uppercase font-semibold text-center pb-1 flex items-center justify-center gap-1.5">
                        <Cpu className="w-3 h-3 text-[hsl(var(--accent-purple))]" />
                        <span>Shared Tech Bridges</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 flex-1 justify-center py-1">
                        {TECH_BRIDGES.map((tech) => {
                            const isSelected = selectedTech?.id === tech.id;
                            const isActiveInProject = activeTechIds.has(tech.id);
                            const isFiltered = !matchesFilterLens(tech, activeLens);

                            return (
                                <button
                                    key={tech.id}
                                    ref={(el) => registerRef(tech.id, el)}
                                    type="button"
                                    onClick={() => onSelectTech(tech.id)}
                                    className={cn(
                                        "cursor-pointer group relative px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                        isSelected
                                            ? "bg-card shadow-md ring-1"
                                            : isActiveInProject
                                            ? "bg-muted/40 shadow-xs"
                                            : "bg-card/50 hover:bg-muted/30",
                                        isFiltered && "opacity-25 pointer-events-none"
                                    )}
                                    style={{
                                        borderColor: isSelected
                                            ? tech.accentColor
                                            : isActiveInProject
                                            ? `color-mix(in srgb, ${tech.accentColor} 50%, hsl(var(--border)))`
                                            : "hsl(var(--border) / 0.7)",
                                    }}
                                >
                                    {/* Left connection socket dot */}
                                    <div
                                        className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-card shadow-xs transition-colors"
                                        style={{
                                            backgroundColor:
                                                isSelected || isActiveInProject
                                                    ? tech.accentColor
                                                    : "hsl(var(--border))",
                                        }}
                                    />

                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                                            {tech.themeable ? (
                                                <div
                                                    className="w-4 h-4 bg-foreground/80 group-hover:bg-foreground"
                                                    style={{
                                                        maskImage: `url(${tech.iconUrl})`,
                                                        WebkitMaskImage: `url(${tech.iconUrl})`,
                                                        maskSize: "contain",
                                                        maskRepeat: "no-repeat",
                                                        maskPosition: "center",
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={tech.iconUrl}
                                                    alt={tech.name}
                                                    className="w-4 h-4 object-contain"
                                                />
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold font-sans text-foreground truncate">
                                            {tech.name}
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 pl-1">
                                        {tech.implementations.length} hubs
                                    </span>

                                    {/* Right connection socket dot */}
                                    <div
                                        className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-card shadow-xs transition-colors"
                                        style={{
                                            backgroundColor:
                                                isSelected || isActiveInProject
                                                    ? tech.accentColor
                                                    : "hsl(var(--border))",
                                        }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                   RIGHT WING: PLATFORMS & DISTRIBUTED SERVICES (3 Stations)
                   ═══════════════════════════════════════════════════════════ */}
                <div className="col-span-4 flex flex-col justify-between gap-3 relative z-20">
                    <div className="text-[10px] font-mono tracking-wider text-muted-foreground/80 uppercase font-semibold flex items-center justify-end gap-1.5 pb-1">
                        <span>Platforms &amp; Portals</span>
                        <Layers className="w-3 h-3 text-[hsl(var(--accent-blue))]" />
                    </div>

                    {rightProjects.map((proj) => {
                        const isSelected = selectedProject?.id === proj.id;
                        const isFiltered = !matchesFilterLens(proj, activeLens);
                        const sharedCount = siblingProjectMap.get(proj.id) || 0;
                        const isSibling = sharedCount > 0 && !isSelected;

                        return (
                            <div
                                key={proj.id}
                                ref={(el) => registerRef(proj.id, el)}
                                onClick={() => onSelectProject(proj.id)}
                                className={cn(
                                    "cursor-pointer group relative p-3 rounded-xl border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                    isSelected
                                        ? "bg-card shadow-lg ring-1"
                                        : isSibling
                                        ? "bg-muted/30 hover:bg-muted/50"
                                        : "bg-card/70 hover:bg-muted/30",
                                    isFiltered && "opacity-25 pointer-events-none"
                                )}
                                style={{
                                    borderColor: isSelected
                                        ? proj.accentColor
                                        : isSibling
                                        ? `color-mix(in srgb, ${proj.accentColor} 50%, hsl(var(--border)))`
                                        : "hsl(var(--border))",
                                }}
                            >
                                {/* Sibling / Focus Badge */}
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <span
                                        className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.2 rounded uppercase border"
                                        style={{
                                            color: proj.accentColor,
                                            backgroundColor: `color-mix(in srgb, ${proj.accentColor} 12%, transparent)`,
                                            borderColor: `color-mix(in srgb, ${proj.accentColor} 30%, transparent)`,
                                        }}
                                    >
                                        {proj.categoryBadge}
                                    </span>
                                    {isSibling && (
                                        <span className="text-[9px] font-mono text-[hsl(var(--accent-blue))] flex items-center gap-0.5">
                                            <Share2 className="w-2.5 h-2.5" />
                                            <span>
                                                {selectedTech ? "POWERS" : `${sharedCount} SHARED`}
                                            </span>
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center p-1 border border-border/80 bg-muted/40 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                                        style={{
                                            borderColor: isSelected
                                                ? proj.accentColor
                                                : "hsl(var(--border))",
                                        }}
                                    >
                                        {proj.iconUrl ? (
                                            <img
                                                src={proj.iconUrl}
                                                alt={proj.name}
                                                className="w-full h-full object-contain rounded"
                                            />
                                        ) : (
                                            <proj.FallbackIcon
                                                className="w-5 h-5"
                                                style={{ color: proj.accentColor }}
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-bold font-display text-foreground truncate group-hover:text-[hsl(var(--accent-blue))] transition-colors">
                                            {proj.name}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground truncate">
                                            {proj.metrics[0].value} • {proj.metrics[0].label}
                                        </div>
                                    </div>
                                </div>

                                {/* Connection socket dot left */}
                                <div
                                    className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm transition-all"
                                    style={{
                                        backgroundColor: isSelected
                                            ? proj.accentColor
                                            : isSibling
                                            ? proj.accentColor
                                            : "hsl(var(--border))",
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
