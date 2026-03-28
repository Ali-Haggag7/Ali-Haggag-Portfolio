"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { scarsData, scarCategories } from "./scars.data";
import { CategoryFilter } from "./CategoryFilter";
import { ScarCard } from "./ScarCard";

// Stable per-card toggle handler factory — same reference per scar.id,
// so ScarCard's memo bail-out isn't defeated on every expandedId change.
function useStableToggles(onToggle: (id: string) => void) {
    const handlersRef = useRef<Map<string, () => void>>(new Map());

    return useCallback(
        (id: string): (() => void) => {
            if (!handlersRef.current.has(id)) {
                handlersRef.current.set(id, () => onToggle(id));
            }
            return handlersRef.current.get(id)!;
        },
        [onToggle]
    );
}

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

    const toggleScar = useCallback(
        (id: string) => setExpandedId((prev) => (prev === id ? null : id)),
        []
    );

    // Pre-built stable handlers — avoids inline `() => toggleScar(scar.id)` per card.
    const getToggleHandler = useStableToggles(toggleScar);

    return (
        <section
            id="battle-scars"
            aria-labelledby="battle-scars-title"
            className="py-24 px-4 md:px-8 w-full max-w-5xl mx-auto"
        >
            <div className="text-center mb-10 animate-fade-in">
                <div className="inline-flex items-center justify-center gap-2 mb-4">
                    <span className="h-px w-8 bg-red-500/50 block" aria-hidden="true" />
                    <span className="text-red-600 dark:text-red-500 font-mono text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4" aria-hidden="true" /> Engineering Logs
                    </span>
                    <span className="h-px w-8 bg-red-500/50 block" aria-hidden="true" />
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

            <div className="space-y-4 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {filteredScars.map((scar, index) => (
                        <ScarCard
                            key={scar.id}
                            scar={scar}
                            index={index}
                            isExpanded={expandedId === scar.id}
                            // Stable reference — memo bail-out preserved on expandedId changes.
                            onToggle={getToggleHandler(scar.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </section>
    );
}