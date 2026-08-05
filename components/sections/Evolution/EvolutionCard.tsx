"use client";

import { memo, useState, useId } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown, ExternalLink, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvolutionChapter } from "./evolution.data";

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const expandVariants: Variants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
};

const VIEWPORT = { once: true, margin: "-50px" } as const;

interface EvolutionCardProps {
    chapter: EvolutionChapter;
    index: number;
    isMobile: boolean;
}

export const EvolutionCard = memo(function EvolutionCard({
    chapter,
    index,
    isMobile,
}: EvolutionCardProps) {
    const isEven = index % 2 === 0;
    const Icon = chapter.icon;
    const [expanded, setExpanded] = useState(false);
    const detailId = useId();

    const hasDetails =
        chapter.evidence.length > 0 ||
        chapter.projects.length > 0 ||
        chapter.tech.length > 0 ||
        !!chapter.experience;

    // ── Shared detail body ──
    const detailBody = (
        <div className="mt-4 border-t border-border/60 pt-4 text-left space-y-4">
            {/* Experience panel (if present) */}
            {chapter.experience && (
                <div
                    className="rounded-xl border border-border/60 bg-background/40 p-4"
                    style={{ borderLeftWidth: "3px", borderLeftColor: chapter.accentVar }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span className="text-sm font-bold text-foreground">
                            {chapter.experience.role}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {chapter.experience.company} · {chapter.experience.type}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {chapter.experience.period}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {chapter.experience.metrics.map((m) => (
                            <span
                                key={m.label}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1 text-xs font-medium"
                            >
                                <span className="font-bold text-foreground">{m.value}</span>
                                <span className="text-muted-foreground">{m.label}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Evidence bullets */}
            {chapter.evidence.length > 0 && (
                <ul className="space-y-2">
                    {chapter.evidence.map((point) => (
                        <li
                            key={point}
                            className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                        >
                            <span
                                aria-hidden="true"
                                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: chapter.accentVar }}
                            />
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Project links */}
            {chapter.projects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {chapter.projects.map((project) => (
                        <a
                            key={project.name}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {project.name}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                    ))}
                </div>
            )}

            {/* Tech pills */}
            {chapter.tech.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {chapter.tech.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <motion.div
            id={`evo-${chapter.id}`}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className={cn(
                "group relative mb-8 flex items-center md:justify-between w-full scroll-mt-28",
                isEven && "md:flex-row-reverse"
            )}
        >
            {/* Timeline dot */}
            <div className={cn(
                "absolute left-8 md:left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 z-10",
                "bg-background border-border dark:bg-neutral-950 dark:border-neutral-800",
                "transition-transform duration-300 ease-out group-hover:scale-110 will-change-transform",
            )}>
                {chapter.isActive && (
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full opacity-50 animate-ping"
                        style={{ backgroundColor: `color-mix(in srgb, ${chapter.accentVar} 20%, transparent)` }}
                    />
                )}
                <Icon
                    className="h-5 w-5 transition-transform duration-300 ease-out group-hover:rotate-12"
                    style={{ color: chapter.accentVar }}
                    aria-hidden="true"
                />
            </div>

            {/* Card */}
            <motion.div
                whileHover={{
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                role={hasDetails ? "button" : undefined}
                tabIndex={hasDetails ? 0 : undefined}
                aria-expanded={hasDetails ? expanded : undefined}
                aria-controls={hasDetails ? detailId : undefined}
                onClick={hasDetails ? () => setExpanded((v) => !v) : undefined}
                onKeyDown={
                    hasDetails
                        ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setExpanded((v) => !v);
                              }
                          }
                        : undefined
                }
                className={cn(
                    "ml-20 md:ml-0 w-full md:w-[45%] rounded-2xl p-6 relative z-10 cyber-card cyber-card-interactive tactical-corner-reticles",
                    hasDetails ? "cursor-pointer" : "cursor-default",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
                style={
                    chapter.isActive
                        ? { borderLeftWidth: "3px", borderLeftColor: chapter.accentVar }
                        : undefined
                }
            >
                {/* Year badge */}
                <span
                    className="hud-tag"
                    style={{
                        color: chapter.accentVar,
                        borderColor: `color-mix(in srgb, ${chapter.accentVar} 40%, transparent)`,
                        backgroundColor: `color-mix(in srgb, ${chapter.accentVar} 10%, transparent)`,
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: chapter.accentVar }} />
                    {chapter.year}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-bold font-display text-foreground mt-3 tracking-tight">
                    {chapter.title}
                </h3>

                {/* Shift statement */}
                <p className="mt-1 text-sm font-medium italic" style={{ color: chapter.accentVar }}>
                    &quot;{chapter.shift}&quot;
                </p>

                {/* Description */}
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                    {chapter.description}
                </p>

                {/* Experience badge (collapsed indicator) */}
                {chapter.experience && !expanded && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/60 px-2.5 py-1 text-xs font-mono text-muted-foreground">
                        <Briefcase className="h-3 w-3" aria-hidden="true" />
                        {chapter.experience.role} @ {chapter.experience.company}
                    </span>
                )}

                {/* Expand trigger */}
                {hasDetails && (
                    <>
                        <span className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wider text-[hsl(var(--accent-blue))]">
                            {expanded ? "Hide details" : "View details"}
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    expanded && "rotate-180"
                                )}
                                aria-hidden="true"
                            />
                        </span>

                        {isMobile ? (
                            <div
                                id={detailId}
                                className="grid transition-[grid-template-rows] duration-300 ease-out"
                                style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                            >
                                <div className="overflow-hidden">{detailBody}</div>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {expanded && (
                                    <motion.div
                                        id={detailId}
                                        variants={expandVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        style={{ willChange: "transform, opacity" }}
                                    >
                                        {detailBody}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </>
                )}
            </motion.div>
        </motion.div>
    );
});
