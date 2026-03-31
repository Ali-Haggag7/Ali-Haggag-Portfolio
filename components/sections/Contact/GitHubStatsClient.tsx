"use client";

import { motion } from "framer-motion";
import type { GitHubStats } from "@/lib/github";
import { Star, GitCommit, GitBranch, Flame, Github, ExternalLink } from "lucide-react";

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

const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178C6",
    JavaScript: "#F7DF1E",
    CSS: "#A855F7",
    HTML: "#E34F26",
    Python: "#3776AB",
    MDX: "#4B5563",
};

interface Props {
    stats: GitHubStats;
}

export function GitHubStatsClient({ stats }: Props) {
    const statCards = [
        { icon: Star, value: stats.totalStars, label: "Total Stars", suffix: "" },
        { icon: GitCommit, value: stats.totalCommits, label: "Commits 2026", suffix: "" },
        { icon: GitBranch, value: stats.contributions2026, label: "Contributions", suffix: "" },
        { icon: Flame, value: stats.currentStreak, label: "Day Streak", suffix: "d" },
    ];

    return (
        <div className="w-full flex flex-col gap-3">

            <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="flex items-center justify-between mb-1"
            >
                <div className="flex items-center gap-2">
                    <Github size={16} className="text-foreground/70" />
                    <span className="text-sm font-semibold text-foreground/80 tracking-tight">
                        GitHub Activity
                    </span>
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                    </span>
                </div>
                <a
                    href="https://github.com/Ali-Haggag7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    View profile
                    <ExternalLink size={11} />
                </a>
            </motion.div>

            <div className="grid grid-cols-2 gap-2.5">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        custom={i + 1}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        className="flex flex-col gap-2 rounded-xl p-4 bg-foreground/3 dark:bg-white/3 border !border-foreground/6 dark:border-white/6 hover:border-foreground/12
                            dark:hover:border-white/10 hover:bg-foreground/5 dark:hover:bg-white/5 transition-all duration-300"
                    >
                        <div className="flex items-center gap-1.5">
                            <card.icon size={13} className="text-muted-foreground" />
                            <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
                                {card.label}
                            </span>
                        </div>
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
                    </motion.div>
                ))}
            </div>

            <motion.div
                custom={5}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="rounded-xl p-4 bg-foreground/3 dark:bg-white/3 border !border-foreground/6 dark:border-white/6 hover:border-foreground/12
                    dark:hover:border-white/10 hover:bg-foreground/5 dark:hover:bg-white/5 transition-all duration-300"
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
                                backgroundColor: LANG_COLORS[lang.name] ?? "#6B7280",
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
                                style={{ backgroundColor: LANG_COLORS[lang.name] ?? "#6B7280" }}
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

            <motion.a
                custom={6}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                href="https://github.com/Ali-Haggag7"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl p-4 border !border-foreground/6 dark:border-white/6 hover:border-foreground/12
                    dark:hover:border-white/10 hover:bg-foreground/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
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