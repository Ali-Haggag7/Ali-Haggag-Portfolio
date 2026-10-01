"use client";

import { memo, useState } from "react";
import {
    PROJECT_STATIONS,
    TECH_BRIDGES,
    type ProjectStation,
    type TechBridge,
    getConnectedSiblingProjects,
    getProjectsUsingTech,
} from "./ecosystem.data";
import {
    Activity,
    Cpu,
    ExternalLink,
    Github,
    Layers,
    Share2,
    CheckCircle2,
    Compass,
    Workflow,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileEcosystemExplorerProps {
    selectedEntity:
        | { type: "project"; data: ProjectStation }
        | { type: "tech"; data: TechBridge };
    onSelectProject: (projectId: string) => void;
    onSelectTech: (techId: string) => void;
}

export const MobileEcosystemExplorer = memo(function MobileEcosystemExplorer({
    selectedEntity,
    onSelectProject,
    onSelectTech,
}: MobileEcosystemExplorerProps) {
    const [explorerMode, setExplorerMode] = useState<"projects" | "tech">(
        selectedEntity.type === "project" ? "projects" : "tech"
    );

    const isProject = selectedEntity.type === "project";
    const project = isProject ? (selectedEntity.data as ProjectStation) : null;
    const tech = !isProject ? (selectedEntity.data as TechBridge) : null;

    // Sibling projects
    const siblingProjects = project ? getConnectedSiblingProjects(project.id) : [];

    // Consuming projects for tech
    const consumingProjects = tech ? getProjectsUsingTech(tech.id) : [];

    // Project technologies
    const projectTechs = project
        ? TECH_BRIDGES.filter((t) => project.techIds.includes(t.id))
        : [];

    // Paired technologies for tech
    const pairedTechs = tech
        ? TECH_BRIDGES.filter((t) => tech.pairedTechIds.includes(t.id))
        : [];

    return (
        <div className="w-full flex flex-col space-y-4">
            {/* Top Navigation Mode Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl border border-border/80 bg-card/80 backdrop-blur-md">
                <button
                    type="button"
                    onClick={() => {
                        setExplorerMode("projects");
                        if (!isProject) {
                            onSelectProject(PROJECT_STATIONS[0].id);
                        }
                    }}
                    className={cn(
                        "cursor-pointer min-h-[44px] rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                        explorerMode === "projects"
                            ? "bg-foreground text-background font-bold shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Layers className="w-4 h-4" />
                    <span>Systems ({PROJECT_STATIONS.length})</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setExplorerMode("tech");
                        if (isProject) {
                            onSelectTech(TECH_BRIDGES[0].id);
                        }
                    }}
                    className={cn(
                        "cursor-pointer min-h-[44px] rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                        explorerMode === "tech"
                            ? "bg-foreground text-background font-bold shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Cpu className="w-4 h-4" />
                    <span>Tech Bridges ({TECH_BRIDGES.length})</span>
                </button>
            </div>

            {/* Horizontal Entity Selector Rail (Thumb-Friendly) */}
            <div className="overflow-x-auto custom-scrollbar pb-1 -mx-4 px-4 flex gap-2 snap-x">
                {explorerMode === "projects"
                    ? PROJECT_STATIONS.map((p) => {
                          const isSelected = project?.id === p.id;
                          return (
                              <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => onSelectProject(p.id)}
                                  className={cn(
                                      "cursor-pointer shrink-0 snap-start min-h-[48px] px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                      isSelected
                                          ? "bg-card shadow-md ring-1"
                                          : "bg-card/60 hover:bg-muted/40"
                                  )}
                                  style={{
                                      borderColor: isSelected
                                          ? p.accentColor
                                          : "hsl(var(--border) / 0.7)",
                                  }}
                              >
                                  <div
                                      className="w-7 h-7 rounded-lg flex items-center justify-center p-1 border border-border/80 bg-muted/40 shrink-0"
                                      style={{
                                          borderColor: isSelected
                                              ? p.accentColor
                                              : "hsl(var(--border))",
                                      }}
                                  >
                                      {p.iconUrl ? (
                                          <img
                                              src={p.iconUrl}
                                              alt={p.name}
                                              className="w-full h-full object-contain rounded"
                                          />
                                      ) : (
                                          <p.FallbackIcon
                                              className="w-4 h-4"
                                              style={{ color: p.accentColor }}
                                          />
                                      )}
                                  </div>
                                  <span
                                      className={cn(
                                          "text-xs font-semibold whitespace-nowrap",
                                          isSelected ? "text-foreground font-bold" : "text-muted-foreground"
                                      )}
                                  >
                                      {p.shortName}
                                  </span>
                              </button>
                          );
                      })
                    : TECH_BRIDGES.map((t) => {
                          const isSelected = tech?.id === t.id;
                          return (
                              <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => onSelectTech(t.id)}
                                  className={cn(
                                      "cursor-pointer shrink-0 snap-start min-h-[48px] px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition-all focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                      isSelected
                                          ? "bg-card shadow-md ring-1"
                                          : "bg-card/60 hover:bg-muted/40"
                                  )}
                                  style={{
                                      borderColor: isSelected
                                          ? t.accentColor
                                          : "hsl(var(--border) / 0.7)",
                                  }}
                              >
                                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                                      {t.themeable ? (
                                          <div
                                              className="w-4 h-4 bg-foreground"
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
                                              className="w-4 h-4 object-contain"
                                          />
                                      )}
                                  </div>
                                  <span
                                      className={cn(
                                          "text-xs font-semibold whitespace-nowrap",
                                          isSelected ? "text-foreground font-bold" : "text-muted-foreground"
                                      )}
                                  >
                                      {t.name}
                                  </span>
                              </button>
                          );
                      })}
            </div>

            {/* Focused Mobile Detail Container */}
            <div className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-4 sm:p-5 space-y-5 shadow-xl">
                {/* ═══════════════════════════════════════════════════════════
                   PROJECT VIEW (MOBILE)
                   ═══════════════════════════════════════════════════════════ */}
                {isProject && project && (
                    <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center p-1.5 border border-border/80 bg-muted/40 shadow-sm shrink-0"
                                style={{
                                    borderColor: `color-mix(in srgb, ${project.accentColor} 40%, hsl(var(--border)))`,
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
                                    />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <span
                                    className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase border inline-block"
                                    style={{
                                        color: project.accentColor,
                                        backgroundColor: `color-mix(in srgb, ${project.accentColor} 12%, transparent)`,
                                        borderColor: `color-mix(in srgb, ${project.accentColor} 30%, transparent)`,
                                    }}
                                >
                                    {project.categoryBadge}
                                </span>
                                <h3 className="text-lg font-bold font-display text-foreground tracking-tight truncate mt-0.5">
                                    {project.name}
                                </h3>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {project.description}
                        </p>

                        {/* Architecture Summary */}
                        <div className="rounded-xl border border-border/60 bg-muted/15 p-3 space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                                <Compass className="w-3.5 h-3.5 text-foreground/70" />
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
                                        className="rounded-lg border border-border/60 bg-muted/10 p-2 text-center"
                                    >
                                        <div className="text-sm font-bold font-mono text-foreground">
                                            {m.value}
                                        </div>
                                        <div className="text-[9px] text-muted-foreground line-clamp-1 mt-0.5">
                                            {m.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Technical Foundation: 44px+ Clickable Touch Targets */}
                        <div className="space-y-2">
                            <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5 text-[hsl(var(--accent-blue))]" />
                                <span>Technical Foundation (Tap to explore)</span>
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {projectTechs.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => {
                                            setExplorerMode("tech");
                                            onSelectTech(t.id);
                                        }}
                                        className="cursor-pointer min-h-[44px] px-3 py-2 rounded-xl border border-border/70 bg-card active:scale-95 transition-all text-xs font-sans text-foreground flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                    >
                                        <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                                            {t.themeable ? (
                                                <div
                                                    className="w-4 h-4 bg-foreground"
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
                                                    className="w-4 h-4 object-contain"
                                                />
                                            )}
                                        </span>
                                        <span className="font-medium">{t.name}</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Shared Ecosystem Sibling Systems */}
                        {siblingProjects.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-border/60">
                                <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                    <Share2 className="w-3.5 h-3.5 text-[hsl(var(--accent-emerald))]" />
                                    <span>Connected Sibling Systems</span>
                                </span>
                                <div className="space-y-2">
                                    {siblingProjects.map(({ project: sib, sharedTech }) => (
                                        <button
                                            key={sib.id}
                                            type="button"
                                            onClick={() => onSelectProject(sib.id)}
                                            className="cursor-pointer w-full text-left p-3 rounded-xl border border-border/60 bg-muted/20 active:bg-muted/40 transition-all flex items-center justify-between gap-3 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center p-1 border border-border/60 bg-card shrink-0"
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
                                                    <div className="text-xs font-bold text-foreground truncate">
                                                        {sib.name}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground truncate">
                                                        Shares {sharedTech.map((t) => t.name).join(", ")}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                Jump →
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Links */}
                        <div className="pt-2 flex items-center gap-2">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-border/80 bg-muted/20 text-foreground text-xs font-mono font-medium flex items-center justify-center gap-2 active:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                >
                                    <Github className="w-4 h-4" />
                                    <span>Source</span>
                                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                </a>
                            )}
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer flex-1 min-h-[44px] px-3 py-2 rounded-xl border border-[hsl(var(--accent-blue))/0.4] bg-[hsl(var(--accent-blue))/0.1] text-[hsl(var(--accent-blue))] text-xs font-mono font-medium flex items-center justify-center gap-2 active:bg-[hsl(var(--accent-blue))/0.2] focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                >
                                    <Activity className="w-4 h-4" />
                                    <span>Live Launch</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                   TECH BRIDGE VIEW (MOBILE)
                   ═══════════════════════════════════════════════════════════ */}
                {!isProject && tech && (
                    <div className="space-y-4">
                        {/* Header */}
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
                            <div className="min-w-0 flex-1">
                                <span
                                    className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase border inline-block"
                                    style={{
                                        color: tech.accentColor,
                                        backgroundColor: `color-mix(in srgb, ${tech.accentColor} 12%, transparent)`,
                                        borderColor: `color-mix(in srgb, ${tech.accentColor} 30%, transparent)`,
                                    }}
                                >
                                    {tech.category} BRIDGE
                                </span>
                                <h3 className="text-lg font-bold font-display text-foreground tracking-tight truncate mt-0.5">
                                    {tech.name}
                                </h3>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {tech.description}
                        </p>

                        {/* Architectural Role */}
                        <div className="rounded-xl border border-border/60 bg-muted/15 p-3 space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                                <Workflow className="w-3.5 h-3.5 text-foreground/70" />
                                <span>Architectural Role</span>
                            </div>
                            <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                                {tech.architecturalRole}
                            </p>
                        </div>

                        {/* Consuming Projects */}
                        <div className="space-y-2">
                            <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-[hsl(var(--accent-blue))]" />
                                <span>Consuming Systems ({consumingProjects.length})</span>
                            </span>
                            <div className="space-y-2">
                                {consumingProjects.map(({ project: p, role }) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => {
                                            setExplorerMode("projects");
                                            onSelectProject(p.id);
                                        }}
                                        className="cursor-pointer w-full text-left p-3 rounded-xl border border-border/70 bg-card active:bg-muted/40 transition-all space-y-1.5 focus-visible:ring-2 focus-visible:ring-ring outline-none"
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
                                                <span className="text-xs font-bold text-foreground">
                                                    {p.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-muted-foreground">
                                                Inspect →
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed pl-7">
                                            {role}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Paired Tech Bridges */}
                        {pairedTechs.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-border/60">
                                <span className="text-xs font-mono font-semibold text-foreground/80 tracking-wide uppercase flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5 text-[hsl(var(--accent-purple))]" />
                                    <span>Architectural Co-Dependencies</span>
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {pairedTechs.map((pt) => (
                                        <button
                                            key={pt.id}
                                            type="button"
                                            onClick={() => onSelectTech(pt.id)}
                                            className="cursor-pointer min-h-[44px] px-3 py-2 rounded-xl border border-border/70 bg-card active:scale-95 transition-all text-xs font-sans text-foreground flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                                        >
                                            <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                                                {pt.themeable ? (
                                                    <div
                                                        className="w-4 h-4 bg-foreground"
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
                                                        className="w-4 h-4 object-contain"
                                                    />
                                                )}
                                            </span>
                                            <span className="font-medium">{pt.name}</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});
