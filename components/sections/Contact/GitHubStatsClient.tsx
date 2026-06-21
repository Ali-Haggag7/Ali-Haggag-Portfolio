"use client";

import { motion } from "framer-motion";
import type { GitHubStats } from "@/lib/github";
import { Star, GitCommit, GitBranch, Flame, Github, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ContributionHeatmap } from "./ContributionHeatmap";

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.07,
            duration: 0.45,
            ease: "easeOut" as const,
        },
    }),
};

const viewport = { once: true } as const;

// Per-language brand colors sourced from CSS variables (dynamic per language).
const LANG_COLOR_VARS: Record<string, string> = {
    TypeScript: "var(--lang-typescript)",
    JavaScript: "var(--lang-javascript)",
    CSS: "var(--lang-css)",
    HTML: "var(--lang-html)",
    Python: "var(--lang-python)",
    MDX: "var(--lang-mdx)",
};

function langColor(name: string): string {
    return LANG_COLOR_VARS[name] ?? "var(--lang-fallback)";
}

interface Props {
    stats: GitHubStats;
}

export function GitHubStatsClient({ stats }: Props) {
    const isMobile = useIsMobile();

    const statCards = [
        { icon: Star, value: stats.totalStars, label: "Total Stars", suffix: "", isStreak: false },
        { icon: GitCommit, value: stats.totalCommits, label: "Commits 2026", suffix: "", isStreak: false },
        { icon: GitBranch, value: stats.contributions2026, label: "Contributions", suffix: "", isStreak: false },
        { icon: Flame, value: stats.currentStreak, label: "Streak", suffix: "d", isStreak: true },
    ];

    // On mobile skip all transform animations — render plain static elements.
    const motionProps = isMobile
        ? {}
        : ({
              variants: fadeUp,
              initial: "hidden" as const,
              whileInView: "visible" as const,
              viewport,
          });

    return (
        <div className="w-full flex flex-col gap-3">

            <motion.div
                {...(isMobile ? {} : { custom: 0, ...motionProps })}
                className="flex items-center justify-between mb-1"
            >
                <div className="flex items-center gap-2">
                    <Github size={16} className="text-foreground/70" />
                    <span className="text-sm font-semibold text-foreground/80 tracking-tight">
                        GitHub Activity
                    </span>
                    <span className="relative flex h-1.5 w-1.5">
                        <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ backgroundColor: "var(--color-live-light)" }}
                        />
                        <span
                            className="relative inline-flex rounded-full h-1.5 w-1.5"
                            style={{ backgroundColor: "var(--color-live)" }}
                        />
                    </span>
                </div>
                {/* min-h-11 (44px) hit area; negative margin keeps visual box unchanged. */}
                <a
                    href="https://github.com/Ali-Haggag7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 -my-3 py-3 min-h-11 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    View profile
                    <ExternalLink size={11} />
                </a>
            </motion.div>

            <div className="grid grid-cols-2 gap-2.5">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        {...(isMobile ? {} : { custom: i + 1, ...motionProps })}
                        className="flex flex-col gap-2 rounded-xl p-4 bg-foreground/3 dark:bg-white/3 border !border-foreground/6 dark:border-white/6 card-glow"
                    >
                        <div className="flex items-center gap-1.5">
                            <card.icon size={13} className="text-muted-foreground" />
                            <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
                                {card.label}
                            </span>
                        </div>
                        {card.isStreak ? (
                            <div className="grid grid-cols-2 gap-2 mt-0.5">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">Current</span>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-[22px] font-bold tracking-tight text-foreground leading-none">
                                            {stats.currentStreak.toLocaleString()}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground font-medium">d</span>
                                    </div>
                                </div>
                                <div className="flex flex-col border-l border-foreground/6 dark:border-white/6 pl-2.5">
                                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">Max</span>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-[22px] font-bold tracking-tight text-foreground leading-none">
                                            {stats.longestStreak.toLocaleString()}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground font-medium">d</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-[28px] font-bold tracking-tight text-foreground leading-none">
                                    {card.value.toLocaleString()}
                                </span>
                                {card.suffix && (
                                    <span className="text-sm text-muted-foreground font-medium">
                                        {card.suffix}
                                    </span>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <motion.div
                {...(isMobile ? {} : { custom: 5, ...motionProps })}
                className="rounded-xl p-4 bg-foreground/3 dark:bg-white/3 border !border-foreground/6 dark:border-white/6 card-glow"
            >
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                        Top Languages
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                        {stats.totalRepos} repos
                    </span>
                </div>
                <div className="flex h-1.5 rounded-full overflow-hidden gap-px mb-3">
                    {stats.topLanguages.map((lang) => (
                        <div
                            key={lang.name}
                            style={{
                                width: `${lang.percentage}%`,
                                backgroundColor: langColor(lang.name),
                            }}
                        />
                    ))}
                    <div className="flex-1 bg-foreground/10 dark:bg-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {stats.topLanguages.map((lang) => (
                        <div key={lang.name} className="flex items-center gap-1.5">
                            <span
                                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: langColor(lang.name) }}
                            />
                            <span className="text-[11px] text-muted-foreground truncate">
                                {lang.name}
                            </span>
                            <span className="text-[11px] text-foreground font-semibold ml-auto">
                                {lang.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <ContributionHeatmap
                recentDays={stats.recentDays}
                lastSynced={stats.lastSynced}
            />

            <motion.a
                {...(isMobile ? {} : { custom: 6, ...motionProps })}
                href="https://github.com/Ali-Haggag7"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl p-4 border !border-foreground/6 dark:border-white/6 card-glow cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-foreground/3 dark:bg-white/3 group-hover:bg-foreground/5 dark:group-hover:bg-white/5 transition-colors">
                        <Github size={15} className="text-foreground/70" />
                    </div>
                    <div className="flex flex-col gap-0">
                        <span className="text-sm font-semibold text-foreground leading-tight">
                            Ali-Haggag7
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {stats.totalRepos} public repositories
                        </span>
                    </div>
                </div>
                <ExternalLink
                    size={14}
                    className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                />
            </motion.a>

        </div >
    );
}
