"use client";

import { memo } from "react";
import { Skill, SKILL_QUADRANTS, SkillQuadrant, getStatusConfig } from "./skills.data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Swords, ArrowUpRight } from "lucide-react";

const isRaster = (src: string) => /\.(png|jpe?g|webp)$/i.test(src);

const SkillMatrixCard = memo(function SkillMatrixCard({
    skill,
    onSelect,
}: {
    skill: Skill;
    onSelect: () => void;
}) {
    const statusConfig = getStatusConfig(skill.status);
    const raster = isRaster(skill.icon);
    const hasScar = Boolean(skill.scarId);

    return (
        <button
            type="button"
            onClick={onSelect}
            aria-label={`Inspect ${skill.name} telemetry`}
            className={cn(
                "group relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 min-h-[48px]",
                "border-border/50 bg-card/40 hover:bg-card/90 hover:border-[hsl(var(--accent-blue)/0.6)] hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] cursor-pointer"
            )}
        >
            <div className="flex items-center gap-2.5 min-w-0">
                {/* Skill Icon */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background/80 border border-border/40 p-1">
                    {skill.themeable ? (
                        <div
                            className="w-full h-full bg-foreground opacity-75 group-hover:opacity-100 transition-opacity"
                            style={{
                                maskImage: `url(${skill.icon})`,
                                WebkitMaskImage: `url(${skill.icon})`,
                                maskSize: "contain",
                                maskRepeat: "no-repeat",
                                maskPosition: "center",
                            }}
                        />
                    ) : raster ? (
                        <Image
                            src={skill.icon}
                            alt=""
                            width={20}
                            height={20}
                            className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    ) : (
                        <img
                            src={skill.icon}
                            alt=""
                            className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                        />
                    )}
                </div>

                {/* Skill Title & Mastery dot */}
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-display font-bold text-foreground truncate group-hover:text-[hsl(var(--accent-blue))] transition-colors">
                        {skill.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground truncate">
                        {skill.projects[0] || "Core Stack"}
                    </span>
                </div>
            </div>

            {/* Badges on right side */}
            <div className="flex items-center gap-1.5 shrink-0 pl-2">
                {/* Battle Scar indicator */}
                {hasScar && (
                    <span
                        title="Documented Incident Post-Mortem"
                        className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.3)] px-1.5 py-0.5 rounded"
                    >
                        <Swords className="w-2.5 h-2.5" />
                        <span className="hidden sm:inline">SCAR</span>
                    </span>
                )}

                {/* Status Dot */}
                <span
                    className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        skill.status === "Battle-Tested"
                            ? "bg-[hsl(var(--accent-purple))] shadow-[0_0_8px_hsl(var(--accent-purple)/0.6)]"
                            : skill.status === "Production Ready"
                            ? "bg-[hsl(var(--accent-emerald))]"
                            : "bg-[hsl(var(--accent-blue))]"
                    )}
                    title={skill.status}
                />
            </div>
        </button>
    );
});

export const SystemsMatrixView = memo(function SystemsMatrixView({
    skills,
    onSelectSkill,
}: {
    skills: Skill[];
    onSelectSkill: (skill: Skill) => void;
}) {
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {SKILL_QUADRANTS.map((quadrant) => {
                const quadrantSkills = skills.filter((s) => s.quadrant === quadrant.id);
                const QuadrantIcon = quadrant.icon;

                if (quadrantSkills.length === 0) return null;

                return (
                    <div
                        key={quadrant.id}
                        className="flex flex-col rounded-2xl border border-border/60 bg-card/30 dark:bg-card/20 p-5 sm:p-6 backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors hover:border-border/80"
                    >
                        {/* Top Accent Line */}
                        <div
                            className="absolute top-0 inset-x-0 h-1 bg-[hsl(var(--accent-blue)/0.4)]"
                            style={{
                                background: `linear-gradient(90deg, hsl(${quadrant.accentVar}), transparent)`,
                            }}
                            aria-hidden="true"
                        />

                        {/* Quadrant Header */}
                        <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-border/40">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/80 text-foreground">
                                    <QuadrantIcon className="w-5 h-5 text-[hsl(var(--accent-blue))]" />
                                </div>
                                <div>
                                    <h3 className="text-base font-display font-bold text-foreground">
                                        {quadrant.title}
                                    </h3>
                                    <span className="text-xs font-mono text-muted-foreground/70">
                                        {quadrant.subtitle}
                                    </span>
                                </div>
                            </div>

                            <span className="text-xs font-mono font-bold text-muted-foreground bg-muted/40 border border-border/40 px-2.5 py-1 rounded-full shrink-0">
                                {quadrantSkills.length} Units
                            </span>
                        </div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {quadrantSkills.map((skill) => (
                                <SkillMatrixCard
                                    key={skill.name}
                                    skill={skill}
                                    onSelect={() => onSelectSkill(skill)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});
