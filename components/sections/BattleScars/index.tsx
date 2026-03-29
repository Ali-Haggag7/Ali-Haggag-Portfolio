"use client";

import { useState, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { scarsData, scarCategories } from "./scars.data";
import { useStableMap } from "@/hooks/useStableMap";
import { CategoryFilter } from "./CategoryFilter";
import { ScarCard } from "./ScarCard";

export default function BattleScars() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [expandedId, setExpandedId] = useState<string | null>(scarsData[0].id);

    const filteredScars = useMemo(
        () => activeCategory === "All" ? scarsData : scarsData.filter((s) => s.category === activeCategory),
        [activeCategory]
    );

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
                    {/* Changed red → blue: red carries 'error' semantics, blue is neutral/brand */}
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

            <CategoryFilter
                categories={scarCategories}
                activeCategory={activeCategory}
                onSelect={handleCategoryChange}
            />

            {/* popLayout allows concurrent enter/exit — no dead-time between category switches */}
            <div className="space-y-4 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {filteredScars.map((scar, index) => (
                        <ScarCard
                            key={scar.id}
                            scar={scar}
                            index={index}
                            isExpanded={expandedId === scar.id}
                            onToggle={getToggleHandler(scar.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}