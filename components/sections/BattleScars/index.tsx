"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Activity, ShieldAlert, FolderGit2, ListChecks, ChevronDown, ArrowDown } from "lucide-react";
import { useInView } from "framer-motion";
import { scarsData, scarCategories } from "./scars.data";
import { useStableMap } from "@/hooks/useStableMap";
import { CategoryFilter } from "./CategoryFilter";
import { ScarCard } from "./ScarCard";
import { useSearchParams } from "next/navigation";

export default function BattleScars() {
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState("All");
    const [expandedId, setExpandedId] = useState<string | null>(scarsData[0].id);

    const [showAllCards, setShowAllCards] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { margin: "0px 0px -200px 0px" });

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

    // Deep Linking Logic: On mount, check for ?scar=scarId in URL and auto-expand the corresponding card
    useEffect(() => {
        const scarIdParam = searchParams.get('scar');
        if (scarIdParam) {
            const targetScar = scarsData.find(s => s.id === scarIdParam);
            if (targetScar) {
                setExpandedId(scarIdParam);
                setActiveCategory("All");
                setShowAllCards(true);

                setTimeout(() => {
                    const cardElement = document.getElementById(`scar-card-${scarIdParam}`);
                    if (cardElement) {
                        cardElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, '', newUrl);
                    }
                }, 400);
            }
        }
    }, [searchParams]);

    const filteredScars = useMemo(
        () => activeCategory === "All" ? scarsData : scarsData.filter((s) => s.category === activeCategory),
        [activeCategory]
    );

    // Stats bar metrics — computed once from the full dataset (not the filtered view).
    const stats = useMemo(() => {
        const total = scarsData.length;
        const critical = scarsData.filter((s) => s.severity === "critical").length;

        const counts = new Map<string, number>();
        for (const s of scarsData) {
            // Group by base project name (strip version suffix e.g. " v2.5.0")
            const name = s.project.replace(/\s+v?\d.*$/i, "").trim();
            counts.set(name, (counts.get(name) ?? 0) + 1);
        }
        let mostAffected = "";
        let max = 0;
        for (const [name, count] of counts) {
            if (count > max) {
                max = count;
                mostAffected = name;
            }
        }
        return { total, critical, mostAffected, mostAffectedCount: max };
    }, []);

    const handleCategoryChange = useCallback((category: string) => {
        setActiveCategory(category);
        setExpandedId(null);
        setShowAllCards(false);
    }, []);

    const toggle = useCallback(
        (id: string) => setExpandedId((prev) => (prev === id ? null : id)),
        []
    );

    // Stable per-card handlers — prevents memo bail-out on expandedId changes
    const getToggleHandler = useStableMap(toggle);

    const INITIAL_CARDS = 4;
    const needsExpansion = filteredScars.length > INITIAL_CARDS;
    const visibleScars = showAllCards ? filteredScars : filteredScars.slice(0, INITIAL_CARDS);

    return (
        <section
            id="battle-scars"
            aria-labelledby="battle-scars-title"
            className="py-24 px-4 md:px-8 w-full max-w-5xl mx-auto"
        >
            <div className="text-center mb-10 animate-fade-in">
                <div className="inline-flex items-center justify-center gap-2 mb-4">
                    <span className="h-px w-8 bg-blue-500/40 block" aria-hidden="true" />
                    <span className="text-blue-500 font-mono text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4" aria-hidden="true" />
                        Engineering Logs
                    </span>
                    <span className="h-px w-8 bg-blue-500/40 block" aria-hidden="true" />
                </div>
                <h2
                    id="battle-scars-title"
                    className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
                >
                    Battle Scars
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Real engineering isn&apos;t just writing code. It&apos;s about the architectural decisions made when systems fail, latency spikes, and requirements evolve.
                </p>
            </div>

            {/* Post-mortem stats bar - iOS Native Style on Mobile */}
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
                <div className="flex flex-col items-center justify-center rounded-[24px] border border-border/50 bg-background/40 backdrop-blur-xl p-5 text-center shadow-sm">
                    <ListChecks className="w-5 h-5 mb-2 text-muted-foreground/80" aria-hidden="true" />
                    <dt className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase order-2 mt-1">Total Scars</dt>
                    <dd className="text-3xl font-semibold tracking-tighter text-foreground order-1 leading-none">{stats.total}</dd>
                </div>

                <div className="flex flex-col items-center justify-center rounded-[24px] border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-5 text-center shadow-sm">
                    <ShieldAlert className="w-5 h-5 mb-2 text-red-500/80" aria-hidden="true" />
                    <dt className="text-[10px] font-semibold tracking-widest text-red-500/80 uppercase order-2 mt-1">Critical</dt>
                    <dd className="text-3xl font-semibold tracking-tighter text-red-500 order-1 leading-none">{stats.critical}</dd>
                </div>

                <div className="flex flex-col items-center justify-center rounded-[24px] border border-border/50 bg-background/40 backdrop-blur-xl p-5 text-center shadow-sm col-span-2 md:col-span-1">
                    <FolderGit2 className="w-5 h-5 mb-2 text-muted-foreground/80" aria-hidden="true" />
                    <dt className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase order-2 mt-1">Most Affected</dt>
                    <dd className="text-lg font-semibold tracking-tight text-foreground order-1 leading-tight flex flex-col items-center gap-0.5">
                        {stats.mostAffected}
                        <span className="text-[11px] font-normal text-muted-foreground">
                            {stats.mostAffectedCount} scars
                        </span>
                    </dd>
                </div>
            </dl>

            <CategoryFilter
                categories={scarCategories}
                activeCategory={activeCategory}
                onSelect={handleCategoryChange}
            />

            <div ref={containerRef} className="relative min-h-[400px]">
                {/* Fixed Skip Button (Visible only when scrolling through expanded list) */}
                {showAllCards && needsExpansion && isInView && (
                    <div className="fixed bottom-8 md:bottom-28 left-0 z-50 w-full flex justify-center pointer-events-none animate-in slide-in-from-bottom-8 fade-in duration-300">
                        <button 
                            type="button"
                            onClick={() => {
                                const nextSection = document.getElementById("timeline");
                                if (nextSection) {
                                    nextSection.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="pointer-events-auto cursor-pointer bg-foreground/90 backdrop-blur-xl border border-border/50 px-4 py-2 rounded-full text-xs font-semibold shadow-xl hover:bg-foreground active:scale-95 text-background flex items-center gap-1.5 transition-all"
                            aria-label="Skip to Next Section"
                            title="Skip to next section"
                        >
                            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                            <span>Skip</span>
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {visibleScars.map((scar, index) => (
                        <ScarCard
                            key={scar.id}
                            scar={scar}
                            index={index}
                            isExpanded={expandedId === scar.id}
                            onToggle={getToggleHandler(scar.id)}
                            isMobile={isMobile}
                        />
                    ))}
                </div>

                {/* Smart Fade Overlay */}
                {needsExpansion && !showAllCards && (
                    <div className="absolute bottom-0 left-0 w-full h-[280px] bg-gradient-to-t from-background via-background/90 to-transparent flex items-end justify-center pb-4 z-10 pointer-events-none rounded-b-[32px]">
                        <button
                            type="button"
                            onClick={() => setShowAllCards(true)}
                            className="pointer-events-auto cursor-pointer bg-card border border-border/50 backdrop-blur-xl px-6 py-3 rounded-full font-bold text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-muted transition-all active:scale-95 flex items-center gap-2 text-foreground"
                        >
                            View all {filteredScars.length} Scars <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
