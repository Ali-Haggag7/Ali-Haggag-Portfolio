"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Activity, ShieldAlert, FolderGit2, ListChecks } from "lucide-react";
import { scarsData, scarCategories } from "./scars.data";
import { useStableMap } from "@/hooks/useStableMap";
import { CategoryFilter } from "./CategoryFilter";
import { ScarCard } from "./ScarCard";
import { useSearchParams } from "next/navigation";

export default function BattleScars() {
    const searchParams = useSearchParams();
    const [activeCategory, setActiveCategory] = useState("All");
    const [expandedId, setExpandedId] = useState<string | null>(scarsData[0].id);

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
    }, []);

    const toggle = useCallback(
        (id: string) => setExpandedId((prev) => (prev === id ? null : id)),
        []
    );

    // Stable per-card handlers — prevents memo bail-out on expandedId changes
    const getToggleHandler = useStableMap(toggle);

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

            {/* Post-mortem stats bar */}
            <dl className="grid grid-cols-3 gap-3 md:gap-4 mb-10">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/60 py-4 px-2 text-center">
                    <ListChecks className="w-5 h-5 mb-2 text-muted-foreground" aria-hidden="true" />
                    <dt className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground order-2">Total Scars</dt>
                    <dd className="text-2xl md:text-3xl font-extrabold text-foreground order-1 leading-none mb-1">{stats.total}</dd>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border bg-card/60 py-4 px-2 text-center"
                     style={{ borderColor: "var(--scar-critical)" }}>
                    <ShieldAlert className="w-5 h-5 mb-2" style={{ color: "var(--scar-critical)" }} aria-hidden="true" />
                    <dt className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground order-2">Critical</dt>
                    <dd className="text-2xl md:text-3xl font-extrabold order-1 leading-none mb-1" style={{ color: "var(--scar-critical)" }}>
                        {stats.critical}
                    </dd>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/60 py-4 px-2 text-center">
                    <FolderGit2 className="w-5 h-5 mb-2 text-muted-foreground" aria-hidden="true" />
                    <dt className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground order-2">Most Affected</dt>
                    <dd className="text-sm md:text-base font-bold text-foreground order-1 leading-tight mb-1">
                        {stats.mostAffected}
                        <span className="block text-[11px] font-mono font-normal text-muted-foreground">
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

            <div className="space-y-4 min-h-[400px]">
                {filteredScars.map((scar, index) => (
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
        </section>
    );
}
