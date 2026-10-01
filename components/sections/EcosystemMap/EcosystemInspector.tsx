"use client";

import { memo } from "react";
import {
    ProjectStation,
    TechBridge,
    getConnectedSiblingProjects,
    getProjectsUsingTech,
    PROJECT_STATIONS,
    TECH_BRIDGES,
} from "./ecosystem.data";
import {
    ExternalLink,
    Github,
    Cpu,
    Workflow,
    Layers,
    Share2,
    Activity,
    Compass,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosystemInspectorProps {
    selectedEntity:
        | { type: "project"; data: ProjectStation }
        | { type: "tech"; data: TechBridge };
    onSelectProject: (projectId: string) => void;
    onSelectTech: (techId: string) => void;
    className?: string;
}

export const EcosystemInspector = memo(function EcosystemInspector({
    selectedEntity,
    onSelectProject,
    onSelectTech,
    className,
}: EcosystemInspectorProps) {
    const isProject = selectedEntity.type === "project";
    const project = isProject ? (selectedEntity.data as ProjectStation) : null;
    const tech = !isProject ? (selectedEntity.data as TechBridge) : null;

    // Sibling connections for project
    const siblingProjects = project ? getConnectedSiblingProjects(project.id) : [];

    // Consumer projects for technology
    const consumingProjects = tech ? getProjectsUsingTech(tech.id) : [];

    // Project technologies
    const projectTechs = project
        ? TECH_BRIDGES.filter((t) => project.techIds.includes(t.id))
        : [];

    // Paired technologies for tech node
    const pairedTechs = tech
        ? TECH_BRIDGES.filter((t) => tech.pairedTechIds.includes(t.id))
        : [];

    return (
        <aside
            className={cn(
                "flex flex-col h-full rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-300",
                className
            )}
            aria-label="Ecosystem Inspector Telemetry"
        >
            {/* Top Inspector Status Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/70 bg-muted/20 text-xs font-mono">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span
                        className="inline-block w-2 h-2 rounded-full animate-pulse"
                        style={{
                            backgroundColor: isProject
                                ? project?.accentColor
                                : tech?.accentColor,
                        }}
                    />
                    <span className="font-semibold tracking-wider uppercase text-[11px] text-foreground">
                        {isProject ? "SYSTEM TELEMETRY" : "BRIDGE SPEC"}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                    <Compass className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <span>INSPECTION COCKPIT</span>
                </div>
            </div>

            {/* Scrollable Body with High Information Density */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-sm">
                {/* ═══════════════════════════════════════════════════════════
                   PROJECT SPECIFICATION VIEW
                   ═══════════════════════════════════════════════════════════ */}
                {isProject && project && (
                    <div className="space-y-5 animate-fade-in">
                        {/* Header: Project Identity */}
                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center p-1.5 border border-border/80 bg-muted/40 shadow-sm shrink-0"
                                        style={{
                                            borderColor: `color-mix(in srgb, ${project.accentColor} 30%, hsl(var(--border)))`,
                                        }}
                                    >
                                        {project.iconUrl ? (
                                            <img
                                                src={project.iconUrl}
                                                alt={project.name}
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        ) : (
                                            <project.FallbackIcon
                                                className="w-6 h-6"
                                                style={{ color: project.accentColor }}
                                                aria-hidden="true"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase border"
                                                style={{
                                                    color: project.accentColor,
                                                    backgroundColor: `color-mix(in srgb, ${project.accentColor} 10%, transparent)`,
                                                    borderColor: `color-mix(in srgb, ${project.accentColor} 30%, transparent)`,
                                                }}
                                            >
                                                {project.categoryBadge}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold font-display text-foreground tracking-tight mt-0.5">
                                            {project.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-xs leading-relaxed pt-1">
                                {project.description}
                            </p>
                        </div>

                        {/* Architecture Summary Callout */}
                        <div className="rounded-xl border border-border/60 bg-muted/15 p-3 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground uppercase font-semibold">
                                <Layers className="w-3.5 h-3.5 text-foreground/70" />
                                <span>Architecture Topology</span>
                            </div>
                            <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                                {project.architectureSummary}
                            </p>
                        </div>

                        {/* Engineering Metrics Strip */}
                        {project.metrics.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {project.metrics.map((m, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border border-border/60 bg-muted/10 p-2.5 flex flex-col justify-center text-center"
                                    >
                                        <span className="text-base font-bold font-mono text-foreground tracking-tight">
                                            {m.value}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-sans line-clamp-1 mt-0.5">
                                            {m.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Technical Foundation: Clickable Tech Stack Chips */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5 text-[hsl(var(--accent-blue))]" />
                                    <span>Technical Foundation</span>
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                    Click chip to inspect hub
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {projectTechs.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => onSelectTech(t.id)}
                                        className="cursor-pointer group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/70 bg-card hover:bg-muted/40 hover:border-border transition-all text-xs font-sans text-foreground/90 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                        title={`Switch focus to ${t.name}`}
                                    >
                                        <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                                            {t.themeable ? (
                                                <div
                                                    className="w-3.5 h-3.5 bg-foreground/80 group-hover:bg-foreground"
                                                    style={{
                                                        maskImage: `url(${t.iconUrl})`,
                                                        WebkitMaskImage: `url(${t.iconUrl})`,
                                                        maskSize: "contain",
                                                        maskRepeat: "no-repeat",
                                                        maskPosition: "center",
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={t.iconUrl}
                                                    alt={t.name}
                                                    className="w-3.5 h-3.5 object-contain"
                                                />
                                            )}
                                        </span>
                                        <span className="font-medium">{t.name}</span>
                                        <span className="text-[10px] text-muted-foreground/60 group-hover:text-foreground/80">
                                            →
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Core Subsystems */}
                        <div className="space-y-2.5">
                            <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                <Workflow className="w-3.5 h-3.5 text-[hsl(var(--accent-purple))]" />
                                <span>Engineered Subsystems</span>
                            </span>
                            <div className="space-y-2">
                                {project.subsystems.map((sub, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border border-border/50 bg-muted/10 p-2.5 space-y-1"
                                    >
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                            <CheckCircle2
                                                className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                                                aria-hidden="true"
                                            />
                                            <span>{sub.name}</span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed pl-5 font-sans">
                                            {sub.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shared Ecosystem Bridges (Connected Sibling Projects) */}
                        {siblingProjects.length > 0 && (
                            <div className="space-y-2.5 pt-1 border-t border-border/60">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                        <Share2 className="w-3.5 h-3.5 text-[hsl(var(--accent-emerald))]" />
                                        <span>Shared Ecosystem Links</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                        {siblingProjects.length} connected systems
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {siblingProjects.map(({ project: sib, sharedTech }) => (
                                        <button
                                            key={sib.id}
                                            type="button"
                                            onClick={() => onSelectProject(sib.id)}
                                            className="cursor-pointer w-full text-left p-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted/30 hover:border-border transition-all flex items-center justify-between gap-3 group focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center p-1 border border-border/60 bg-muted/40 shrink-0"
                                                    style={{
                                                        borderColor: `color-mix(in srgb, ${sib.accentColor} 40%, transparent)`,
                                                    }}
                                                >
                                                    {sib.iconUrl ? (
                                                        <img
                                                            src={sib.iconUrl}
                                                            alt={sib.shortName}
                                                            className="w-full h-full object-contain rounded"
                                                        />
                                                    ) : (
                                                        <sib.FallbackIcon
                                                            className="w-4 h-4"
                                                            style={{ color: sib.accentColor }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-semibold text-foreground group-hover:text-[hsl(var(--accent-blue))] transition-colors truncate">
                                                        {sib.name}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground truncate">
                                                        Shares {sharedTech.map((t) => t.name).join(", ")}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/50 border border-border/60 text-muted-foreground group-hover:text-foreground">
                                                Jump →
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Repository & Demo Actions */}
                        <div className="pt-2 flex items-center gap-2">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 hover:border-border text-foreground text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                >
                                    <Github className="w-4 h-4" aria-hidden="true" />
                                    <span>View Source</span>
                                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                </a>
                            )}
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-[hsl(var(--accent-blue))/0.4] bg-[hsl(var(--accent-blue))/0.08] hover:bg-[hsl(var(--accent-blue))/0.15] text-[hsl(var(--accent-blue))] text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                >
                                    <Activity className="w-4 h-4" aria-hidden="true" />
                                    <span>Live Launch</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                   TECHNOLOGY BRIDGE VIEW
                   ═══════════════════════════════════════════════════════════ */}
                {!isProject && tech && (
                    <div className="space-y-5 animate-fade-in">
                        {/* Header: Tech Hub Identity */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 border border-border/80 bg-muted/40 shadow-sm shrink-0"
                                    style={{
                                        borderColor: `color-mix(in srgb, ${tech.accentColor} 40%, hsl(var(--border)))`,
                                    }}
                                >
                                    {tech.themeable ? (
                                        <div
                                            className="w-full h-full bg-foreground"
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
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>
                                <div>
                                    <span
                                        className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase border"
                                        style={{
                                            color: tech.accentColor,
                                            backgroundColor: `color-mix(in srgb, ${tech.accentColor} 10%, transparent)`,
                                            borderColor: `color-mix(in srgb, ${tech.accentColor} 30%, transparent)`,
                                        }}
                                    >
                                        {tech.category} BRIDGE
                                    </span>
                                    <h3 className="text-xl font-bold font-display text-foreground tracking-tight mt-0.5">
                                        {tech.name}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-xs leading-relaxed pt-1">
                                {tech.description}
                            </p>
                        </div>

                        {/* Architectural Role Callout */}
                        <div className="rounded-xl border border-border/60 bg-muted/15 p-3 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground uppercase font-semibold">
                                <Workflow className="w-3.5 h-3.5 text-foreground/70" />
                                <span>Architectural Role in Ecosystem</span>
                            </div>
                            <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                                {tech.architecturalRole}
                            </p>
                        </div>

                        {/* Active Consuming Projects */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-[hsl(var(--accent-blue))]" />
                                    <span>Consuming Architecture Nodes</span>
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                    {consumingProjects.length} systems powered
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                {consumingProjects.map(({ project: p, role }) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => onSelectProject(p.id)}
                                        className="cursor-pointer w-full text-left p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/30 hover:border-border transition-all space-y-1.5 group focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-5 h-5 rounded flex items-center justify-center p-0.5 border border-border/60 bg-muted/40 shrink-0"
                                                    style={{
                                                        borderColor: `color-mix(in srgb, ${p.accentColor} 40%, transparent)`,
                                                    }}
                                                >
                                                    {p.iconUrl ? (
                                                        <img
                                                            src={p.iconUrl}
                                                            alt={p.shortName}
                                                            className="w-full h-full object-contain rounded-xs"
                                                        />
                                                    ) : (
                                                        <p.FallbackIcon
                                                            className="w-3.5 h-3.5"
                                                            style={{ color: p.accentColor }}
                                                        />
                                                    )}
                                                </div>
                                                <span className="text-xs font-bold text-foreground group-hover:text-[hsl(var(--accent-blue))] transition-colors">
                                                    {p.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground">
                                                Inspect System →
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed pl-7">
                                            {role}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Co-occurring Technologies / Paired Bridges */}
                        {pairedTechs.length > 0 && (
                            <div className="space-y-2.5 pt-1 border-t border-border/60">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--accent-purple))]" />
                                        <span>Architectural Co-Dependencies</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                        Paired in stack
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {pairedTechs.map((pt) => (
                                        <button
                                            key={pt.id}
                                            type="button"
                                            onClick={() => onSelectTech(pt.id)}
                                            className="cursor-pointer group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/70 bg-card hover:bg-muted/40 hover:border-border transition-all text-xs font-sans text-foreground/90 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                            title={`Switch focus to ${pt.name}`}
                                        >
                                            <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                                                {pt.themeable ? (
                                                    <div
                                                        className="w-3.5 h-3.5 bg-foreground/80 group-hover:bg-foreground"
                                                        style={{
                                                            maskImage: `url(${pt.iconUrl})`,
                                                            WebkitMaskImage: `url(${pt.iconUrl})`,
                                                            maskSize: "contain",
                                                            maskRepeat: "no-repeat",
                                                            maskPosition: "center",
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={pt.iconUrl}
                                                        alt={pt.name}
                                                        className="w-3.5 h-3.5 object-contain"
                                                    />
                                                )}
                                            </span>
                                            <span className="font-medium">{pt.name}</span>
                                            <span className="text-[10px] text-muted-foreground/60 group-hover:text-foreground/80">
                                                →
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
});
