"use client";

import { useState, useCallback, useMemo, useEffect, useRef, memo } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Wrench, Search, X, Activity, CheckCircle2, FlaskConical, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Skill,
    technicalArsenal,
    SKILL_MAP,
    arsenalStats,
    ACCENT_STYLES,
    AccentColor,
} from "./skills.data";
import { useStableMap } from "@/hooks/useStableMap";
import { SkillBadge } from "./SkillBadge";
import { SkillModal } from "./SkillModal";
import { RadarChart } from "./RadarChart";
import { CopyStackButton } from "./CopyStackButton";

// Static reference — hoisted to module scope to avoid re-allocation
const GLOW_STYLE = {
    background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
} as const;

const categoryVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { opacity: { duration: 0.5, delay: i * 0.06, ease: "easeOut" } },
    }),
};

// ── Memoized category row ──────────────────────────────────────────────

const SkillCategory = memo(function SkillCategory({
    title,
    icon: CategoryIcon,
    accent,
    skills,
    getHandler,
    index,
    isSearching,
}: {
    title: string;
    icon: LucideIcon;
    accent: AccentColor;
    skills: Skill[];
    getHandler: (key: string) => () => void;
    index: number;
    isSearching: boolean;
}) {
    const styles = ACCENT_STYLES[accent];

    return (
        <motion.div
            variants={categoryVariants}
            initial={isSearching ? "visible" : "hidden"}
            whileInView={isSearching ? undefined : "visible"}
            whileHover={{ y: -6 }}
            transition={{ y: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
            viewport={{ once: true, margin: "-40px" }}
            custom={index}
            style={{ willChange: "transform, opacity" }}
            className={cn(
                "group relative flex flex-col gap-5 border border-slate-200/90 dark:border-border/60 overflow-hidden cyber-card cyber-card-interactive tactical-corner-reticles",
                "w-full max-w-full bg-white/90 dark:bg-card/90 backdrop-blur-xl rounded-[24px] p-5 shadow-sm",
                "md:rounded-3xl md:p-6 md:w-fit",
                styles.border,
                "hover:shadow-xl",
                styles.shadow,
            )}
        >
            <div
                aria-hidden="true"
                className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                    styles.overlay,
                )}
            />

            <div className="relative z-10 flex items-center gap-2.5">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-foreground flex items-center gap-2">
                    <span
                        className={cn("w-2 h-2 rounded-full", styles.dot)}
                        aria-hidden="true"
                    />
                    <CategoryIcon
                        className="w-4 h-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    {title}
                </h3>
                <span className="text-muted-foreground/60 font-mono text-[10px] font-bold">
                    {skills.length}
                </span>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
                {skills.map((skill) => (
                    <SkillBadge
                        key={skill.name}
                        skill={skill}
                        onClick={getHandler(skill.name)}
                    />
                ))}
            </div>
        </motion.div>
    );
});

// ── Main component ─────────────────────────────────────────────────────

export default function NeuralSkills() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const gridRef = useRef<HTMLDivElement>(null);
    const defaultHeightRef = useRef<number>(0);

    // Measure height of the grid container when unfiltered to prevent scroll jumps
    useEffect(() => {
        if (!searchQuery && gridRef.current) {
            defaultHeightRef.current = gridRef.current.clientHeight;
        }
    }, [searchQuery]);

    // isMobile computed ONCE here and passed down as a prop. SSR-safe: defaults
    // to false on the server, syncs after mount to avoid hydration mismatch.
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    // O(1) lookup from the pre-built Map (replaces flatMap+find)
    const handleSelectByName = useCallback((name: string) => {
        const match = SKILL_MAP.get(name);
        if (match) setSelectedSkill(match);
    }, []);

    const handleClose = useCallback(() => setSelectedSkill(null), []);
    const handleClearSearch = useCallback(() => setSearchQuery(""), []);

    // Stabilize handlers keyed by skill name
    const getHandler = useStableMap(handleSelectByName);

    // Filter categories by search query
    const filteredArsenal = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return technicalArsenal;
        return technicalArsenal
            .map((cat) => ({
                ...cat,
                skills: cat.skills.filter((s) =>
                    s.name.toLowerCase().includes(q),
                ),
            }))
            .filter((cat) => cat.skills.length > 0);
    }, [searchQuery]);

    const matchCount = useMemo(
        () => filteredArsenal.reduce((sum, cat) => sum + cat.skills.length, 0),
        [filteredArsenal],
    );

    return (
        <section
            id="skills"
            aria-labelledby="skills-title"
            className="relative flex w-full max-w-6xl flex-col items-center justify-center pt-24 pb-32 mx-auto px-4 md:px-8"
        >
            <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none -z-10"
                style={GLOW_STYLE}
            />

            {/* ── Section Header ─────────────────────────────────── */}
            <div className="flex flex-col items-center text-center mb-10 px-4 animate-fade-in w-full max-w-3xl mx-auto">
                <p className="section-eyebrow mb-3">Technical Arsenal</p>
                <h2
                    id="skills-title"
                    className="section-title text-4xl md:text-5xl mb-3"
                >
                    My Technology{" "}
                    <span className="accent-word">Stack</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                    A curated ecosystem of tools, frameworks, and languages I use to architect and deploy scalable, production-grade applications.
                </p>
            </div>

            {/* ── Arsenal Summary Stats Bar ──────────────────────── */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mb-8">
                <div className="flex flex-col items-center justify-center rounded-[24px] md:rounded-2xl border border-border/50 bg-card/40 md:bg-card/80 backdrop-blur-xl md:backdrop-blur-none p-4 text-center shadow-sm md:shadow-none">
                    <LayoutGrid className="w-5 h-5 mb-1.5 text-muted-foreground/80" aria-hidden="true" />
                    <dd className="text-2xl font-bold tracking-tighter text-foreground leading-none">
                        {arsenalStats.total}
                    </dd>
                    <dt className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mt-1">
                        Total Skills
                    </dt>
                </div>
                <div className="flex flex-col items-center justify-center rounded-[24px] md:rounded-2xl border border-violet-500/20 bg-violet-500/5 backdrop-blur-xl md:backdrop-blur-none p-4 text-center shadow-sm md:shadow-none">
                    <Activity className="w-5 h-5 mb-1.5 text-violet-500/80" aria-hidden="true" />
                    <dd className="text-2xl font-bold tracking-tighter text-violet-500 leading-none">
                        {arsenalStats.battleTested}
                    </dd>
                    <dt className="text-[10px] font-semibold tracking-widest text-violet-500/80 uppercase mt-1">
                        Battle-Tested
                    </dt>
                </div>
                <div className="flex flex-col items-center justify-center rounded-[24px] md:rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl md:backdrop-blur-none p-4 text-center shadow-sm md:shadow-none">
                    <CheckCircle2 className="w-5 h-5 mb-1.5 text-emerald-500/80" aria-hidden="true" />
                    <dd className="text-2xl font-bold tracking-tighter text-emerald-500 leading-none">
                        {arsenalStats.productionReady}
                    </dd>
                    <dt className="text-[10px] font-semibold tracking-widest text-emerald-500/80 uppercase mt-1">
                        Production Ready
                    </dt>
                </div>
                <div className="flex flex-col items-center justify-center rounded-[24px] md:rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl md:backdrop-blur-none p-4 text-center shadow-sm md:shadow-none">
                    <FlaskConical className="w-5 h-5 mb-1.5 text-blue-500/80" aria-hidden="true" />
                    <dd className="text-2xl font-bold tracking-tighter text-blue-500 leading-none">
                        {arsenalStats.exploring}
                    </dd>
                    <dt className="text-[10px] font-semibold tracking-widest text-blue-500/80 uppercase mt-1">
                        R&D / Exploring
                    </dt>
                </div>
            </dl>

            {/* Technical Radar Chart & Copy Stack Controls */}
            <div className="w-full my-8 space-y-6">
                <div className="flex justify-center">
                    <CopyStackButton />
                </div>
                <RadarChart />
            </div>

            {/* ── Search Bar ─────────────────────────────────────── */}
            <div className="w-full max-w-md mb-10 px-2">
                <div className="relative flex items-center gap-2 border border-border/50 rounded-full bg-card/40 md:bg-card/60 backdrop-blur-xl px-4 py-2.5 shadow-sm transition-all duration-200 focus-within:border-blue-500/40 focus-within:shadow-blue-500/10 focus-within:shadow-lg">
                    <Search
                        className="w-4 h-4 text-muted-foreground shrink-0"
                        aria-hidden="true"
                    />
                    <input
                        type="text"
                        placeholder={`Search ${arsenalStats.total} skills...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60 flex-1 min-w-0"
                        aria-label="Search skills"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="text-center text-xs text-muted-foreground mt-2 animate-in fade-in duration-150">
                        {matchCount} result{matchCount !== 1 ? "s" : ""} in{" "}
                        {filteredArsenal.length} categor
                        {filteredArsenal.length !== 1 ? "ies" : "y"}
                    </p>
                )}
            </div>

            {/* ── Skills Grid ────────────────────────────────────── */}
            <div
                ref={gridRef}
                style={{
                    minHeight: searchQuery && defaultHeightRef.current
                        ? `${defaultHeightRef.current}px`
                        : undefined
                }}
                className="w-full flex flex-wrap justify-center items-stretch md:items-start gap-4 md:gap-6 relative z-10"
            >
                {filteredArsenal.map((category, index) => (
                    <SkillCategory
                        key={category.title}
                        title={category.title}
                        icon={category.icon}
                        accent={category.accent}
                        skills={category.skills}
                        getHandler={getHandler}
                        index={index}
                        isSearching={!!searchQuery}
                    />
                ))}

                {/* Empty state */}
                {filteredArsenal.length === 0 && searchQuery && (
                    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                        <Search className="w-8 h-8 opacity-30" aria-hidden="true" />
                        <p className="text-sm font-medium">
                            No skills match &ldquo;{searchQuery}&rdquo;
                        </p>
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="text-xs text-blue-500 hover:underline cursor-pointer"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            {/* ── Skill Detail Modal ─────────────────────────────── */}
            <AnimatePresence mode="sync">
                {selectedSkill && (
                    <SkillModal
                        key={selectedSkill.name}
                        skill={selectedSkill}
                        onClose={handleClose}
                        isMobile={isMobile}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}