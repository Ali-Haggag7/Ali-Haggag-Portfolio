"use client";

import { useState, useCallback, useMemo, useEffect, useRef, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Search,
    X,
    Activity,
    CheckCircle2,
    FlaskConical,
    Swords,
    LayoutGrid,
    Target,
    Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Skill,
    technicalArsenal,
    SKILL_MAP,
    arsenalStats,
    SKILL_QUADRANTS,
} from "./skills.data";
import { SystemsMatrixView } from "./SystemsMatrixView";
import { TechRadarView } from "./TechRadarView";
import { SkillInspector } from "./SkillInspector";
import { CopyStackButton } from "./CopyStackButton";
import { DecryptedText } from "@/components/ui/DecryptedText";

type FilterStatus = "all" | "Battle-Tested" | "Production Ready" | "R&D / Exploring" | "scar";
type ViewMode = "matrix" | "radar";

export default function NeuralSkills() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
    const [viewMode, setViewMode] = useState<ViewMode>("matrix");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Global keyboard shortcut '/' to focus search bar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/" && document.activeElement !== searchInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Flatten all skills
    const allSkills = useMemo(() => {
        return technicalArsenal.flatMap((cat) => cat.skills);
    }, []);

    // Filter skills by search query and status filter
    const filteredSkills = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        return allSkills.filter((skill) => {
            // Search matching
            const matchesQuery =
                !q ||
                skill.name.toLowerCase().includes(q) ||
                skill.projects.some((p) => p.toLowerCase().includes(q));

            if (!matchesQuery) return false;

            // Status filter
            if (statusFilter === "all") return true;
            if (statusFilter === "scar") return Boolean(skill.scarId);
            return skill.status === statusFilter;
        });
    }, [allSkills, searchQuery, statusFilter]);

    const handleSelectSkill = useCallback((skill: Skill) => {
        setSelectedSkill(skill);
    }, []);

    const handleCloseInspector = useCallback(() => {
        setSelectedSkill(null);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
        searchInputRef.current?.focus();
    }, []);

    return (
        <section
            id="skills"
            aria-labelledby="skills-title"
            className="relative flex w-full max-w-6xl flex-col items-center justify-center pt-24 pb-28 mx-auto px-4 md:px-6"
        >
            {/* ── Section Header ─────────────────────────────────── */}
            <div className="flex flex-col items-center text-center mb-10 px-4 w-full max-w-3xl mx-auto">
                <p className="section-eyebrow mb-3">
                    <DecryptedText text="Technical Arsenal & Systems Registry" speed={30} sequential={true} animateOn="view" />
                </p>
                <h2
                    id="skills-title"
                    className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground"
                >
                    Technical{" "}
                    <span className="text-muted-foreground/60">Arsenal</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl mt-3">
                    A curated registry of 50+ enterprise frameworks, runtime engines, and distributed protocols battle-tested across production shipments.
                </p>
            </div>

            {/* ── Summary Telemetry Stats Bar ──────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mb-10">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-4 text-center">
                    <LayoutGrid className="w-5 h-5 mb-1.5 text-muted-foreground/80" aria-hidden="true" />
                    <span className="text-2xl font-display font-bold text-foreground">
                        {arsenalStats.total}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1">
                        Active Technologies
                    </span>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-[hsl(var(--accent-purple)/0.3)] bg-[hsl(var(--accent-purple)/0.06)] backdrop-blur-xl p-4 text-center">
                    <Activity className="w-5 h-5 mb-1.5 text-[hsl(var(--accent-purple))]" aria-hidden="true" />
                    <span className="text-2xl font-display font-bold text-[hsl(var(--accent-purple))]">
                        {arsenalStats.battleTested}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--accent-purple))] mt-1">
                        Battle-Tested
                    </span>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-[hsl(var(--accent-emerald)/0.3)] bg-[hsl(var(--accent-emerald)/0.06)] backdrop-blur-xl p-4 text-center">
                    <CheckCircle2 className="w-5 h-5 mb-1.5 text-[hsl(var(--accent-emerald))]" aria-hidden="true" />
                    <span className="text-2xl font-display font-bold text-[hsl(var(--accent-emerald))]">
                        {arsenalStats.productionReady}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--accent-emerald))] mt-1">
                        Production Ready
                    </span>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.06)] backdrop-blur-xl p-4 text-center">
                    <Swords className="w-5 h-5 mb-1.5 text-[hsl(var(--destructive))]" aria-hidden="true" />
                    <span className="text-2xl font-display font-bold text-[hsl(var(--destructive))]">
                        {arsenalStats.withScars}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--destructive))] mt-1">
                        Battle Scars Documented
                    </span>
                </div>
            </div>

            {/* ── Command Controls (Search + View Switcher + Copy Stack) ── */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                    <div className="relative flex items-center border border-border/60 rounded-xl bg-card/60 backdrop-blur-xl px-3.5 py-2.5 shadow-sm transition-all focus-within:border-[hsl(var(--accent-blue))] focus-within:ring-2 focus-within:ring-[hsl(var(--accent-blue)/0.2)]">
                        <Search className="w-4 h-4 text-muted-foreground shrink-0 mr-2" aria-hidden="true" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by technology or project... (Press /)"
                            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                        />
                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                                className="text-muted-foreground hover:text-foreground p-1 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/50 border border-border/50 rounded bg-muted/40">
                                /
                            </kbd>
                        )}
                    </div>
                </div>

                {/* View Switcher & Copy Stack */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
                    {/* View Switcher Toggle */}
                    <div className="flex items-center p-1 rounded-xl bg-card/60 border border-border/50">
                        <button
                            type="button"
                            onClick={() => setViewMode("matrix")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all min-h-[44px] cursor-pointer",
                                viewMode === "matrix"
                                    ? "bg-background text-foreground shadow-sm border border-border/60"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>Systems Matrix</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("radar")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all min-h-[44px] cursor-pointer",
                                viewMode === "radar"
                                    ? "bg-background text-foreground shadow-sm border border-border/60"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Target className="w-3.5 h-3.5" />
                            <span>Tech Radar</span>
                        </button>
                    </div>

                    {/* Copy Stack Button */}
                    <CopyStackButton />
                </div>
            </div>

            {/* ── Status Filter Pills ──────────────────────────────── */}
            <div className="w-full flex flex-wrap items-center gap-2 mb-8">
                <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={cn(
                        "text-xs font-mono font-semibold px-3 py-1.5 rounded-full border transition-all min-h-[44px] cursor-pointer",
                        statusFilter === "all"
                            ? "bg-card border-foreground/50 text-foreground shadow-sm"
                            : "bg-card/20 border-border/40 text-muted-foreground hover:text-foreground"
                    )}
                >
                    All ({allSkills.length})
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("Battle-Tested")}
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border transition-all min-h-[44px] cursor-pointer",
                        statusFilter === "Battle-Tested"
                            ? "bg-[hsl(var(--accent-purple)/0.15)] border-[hsl(var(--accent-purple)/0.6)] text-[hsl(var(--accent-purple))] shadow-sm"
                            : "bg-card/20 border-border/40 text-muted-foreground hover:text-foreground"
                    )}
                >
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent-purple))]" />
                    <span>Battle-Tested ({arsenalStats.battleTested})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("Production Ready")}
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border transition-all min-h-[44px] cursor-pointer",
                        statusFilter === "Production Ready"
                            ? "bg-[hsl(var(--accent-emerald)/0.15)] border-[hsl(var(--accent-emerald)/0.6)] text-[hsl(var(--accent-emerald))] shadow-sm"
                            : "bg-card/20 border-border/40 text-muted-foreground hover:text-foreground"
                    )}
                >
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent-emerald))]" />
                    <span>Production Ready ({arsenalStats.productionReady})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("R&D / Exploring")}
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border transition-all min-h-[44px] cursor-pointer",
                        statusFilter === "R&D / Exploring"
                            ? "bg-[hsl(var(--accent-blue)/0.15)] border-[hsl(var(--accent-blue)/0.6)] text-[hsl(var(--accent-blue))] shadow-sm"
                            : "bg-card/20 border-border/40 text-muted-foreground hover:text-foreground"
                    )}
                >
                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent-blue))]" />
                    <span>R&D ({arsenalStats.exploring})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("scar")}
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-full border transition-all min-h-[44px] cursor-pointer",
                        statusFilter === "scar"
                            ? "bg-[hsl(var(--destructive)/0.15)] border-[hsl(var(--destructive)/0.6)] text-[hsl(var(--destructive))] shadow-sm"
                            : "bg-card/20 border-border/40 text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Swords className="w-3.5 h-3.5 text-[hsl(var(--destructive))]" />
                    <span>Battle Scars ({arsenalStats.withScars})</span>
                </button>
            </div>

            {/* ── Active View (Matrix or Radar) ───────────────────── */}
            {filteredSkills.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center p-12 border border-border/40 rounded-2xl bg-card/20 text-center">
                    <p className="text-sm font-mono text-muted-foreground">
                        No technical units matched &ldquo;{searchQuery}&rdquo;
                    </p>
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="mt-3 text-xs font-mono font-bold text-[hsl(var(--accent-blue))] hover:underline min-h-[44px] flex items-center cursor-pointer"
                    >
                        Reset Search Filters
                    </button>
                </div>
            ) : viewMode === "matrix" ? (
                <SystemsMatrixView
                    skills={filteredSkills}
                    onSelectSkill={handleSelectSkill}
                />
            ) : (
                <TechRadarView
                    skills={filteredSkills}
                    onSelectSkill={handleSelectSkill}
                />
            )}

            {/* ── Telemetry Spec Inspector Modal ───────────────────── */}
            <AnimatePresence>
                {selectedSkill && (
                    <SkillInspector
                        skill={selectedSkill}
                        onClose={handleCloseInspector}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}