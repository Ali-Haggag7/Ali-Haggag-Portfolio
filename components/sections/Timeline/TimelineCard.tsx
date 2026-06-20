"use client";

import { memo, useState, useId } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimelineItem } from "./timeline.data";

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

// Expansion variants — opacity + translateY only (no height animation).
const expandVariants: Variants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
};

const VIEWPORT = { once: true, margin: "-50px" } as const;

interface TimelineCardProps {
    item: TimelineItem;
    index: number;
    anchorId: string;
    isMobile: boolean;
}

export const TimelineCard = memo(function TimelineCard({
    item,
    index,
    anchorId,
    isMobile,
}: TimelineCardProps) {
    const isEven = index % 2 === 0;
    const Icon = item.icon;
    const [expanded, setExpanded] = useState(false);
    const detailId = useId();

    const hasDetails =
        item.milestones.length > 0 || item.projects.length > 0 || item.tech.length > 0;

    // Shared detail body for both the Framer (desktop) and CSS (mobile) paths.
    const detailBody = (
        <div className="mt-4 border-t border-border/60 pt-4 text-left">
            {item.milestones.length > 0 && (
                <ul className="space-y-2">
                    {item.milestones.map((milestone) => (
                        <li
                            key={milestone}
                            className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                        >
                            <span
                                aria-hidden="true"
                                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: item.accentVar }}
                            />
                            <span>{milestone}</span>
                        </li>
                    ))}
                </ul>
            )}

            {item.projects.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {item.projects.map((project) => (
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

            {item.tech.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {item.tech.map((tech) => (
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
            id={anchorId}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className={cn(
                "group relative mb-16 flex items-center md:justify-between w-full scroll-mt-28",
                isEven && "md:flex-row-reverse"
            )}
        >
            <div className={cn(
                "absolute left-8 md:left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 z-10",
                "bg-background border-border dark:bg-neutral-950 dark:border-neutral-800",
                "transition-transform duration-300 ease-out group-hover:scale-110 will-change-transform",
                item.glowBg,
            )}>
                {item.isActive && (
                    <span
                        aria-hidden="true"
                        className={cn("absolute inset-0 rounded-full opacity-50 animate-ping", item.glowBg)}
                    />
                )}
                <Icon
                    className={cn("h-5 w-5 transition-transform duration-300 ease-out group-hover:rotate-12", item.color)}
                    aria-hidden="true"
                />
            </div>

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
                    "ml-20 md:ml-0 w-full md:w-[45%] rounded-2xl p-6 relative z-10",
                    hasDetails ? "cursor-pointer" : "cursor-default",
                    "bg-card/80 border border-border shadow-sm transition-colors duration-300",
                    "hover:shadow-xl hover:bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    item.hoverBorder,
                )}
                // Active card: subtle left-border highlight via CSS variable accent.
                style={
                    item.isActive
                        ? { borderLeftWidth: "3px", borderLeftColor: item.accentVar }
                        : undefined
                }
            >
                <span className={cn(
                    "text-sm font-mono font-bold tracking-wider px-3 py-1 rounded-full",
                    "bg-background border border-border dark:border-white/5",
                    item.color,
                )}>
                    {item.year}
                </span>

                <h3 className="text-2xl font-bold text-foreground mt-3 tracking-tight">
                    {item.title}
                </h3>

                <p className="mt-3 text-muted-foreground text-base leading-relaxed">
                    {item.description}
                </p>

                {hasDetails && (
                    <>
                        <span className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-foreground/80">
                            {expanded ? "Hide milestones" : "View milestones"}
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    expanded && "rotate-180"
                                )}
                                aria-hidden="true"
                            />
                        </span>

                        {/* Framer Motion on desktop, CSS transition on mobile */}
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
