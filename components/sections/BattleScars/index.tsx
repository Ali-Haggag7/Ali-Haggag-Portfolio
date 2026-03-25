"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { scarsData, scarCategories } from "./scars.data";
import { CategoryFilter } from "./CategoryFilter";
import { ScarCard } from "./ScarCard";

export default function BattleScars() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [expandedId, setExpandedId] = useState<string | null>(scarsData[0].id);

    const filteredScars = useMemo(() => {
        if (activeCategory === "All") return scarsData;
        return scarsData.filter((scar) => scar.category === activeCategory);
    }, [activeCategory]);

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setExpandedId(null);
    };

    const toggleScar = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <section id="battle-scars" aria-labelledby="battle-scars-title" className="py-24 px-4 md:px-8 w-full max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center justify-center gap-2 mb-4 transform-gpu"
                >
                    <span className="h-px w-8 bg-red-500/50 block" aria-hidden="true"></span>
                    <span className="text-red-600 dark:text-red-500 font-mono text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4" aria-hidden="true" /> Engineering Logs
                    </span>
                    <span className="h-px w-8 bg-red-500/50 block" aria-hidden="true"></span>
                </motion.div>

                <motion.h2
                    id="battle-scars-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4 transform-gpu"
                >
                    Battle Scars
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-lg max-w-2xl mx-auto transform-gpu"
                >
                    Real engineering isn't just writing code. It's about the architectural decisions made when systems fail, latency spikes, and requirements evolve.
                </motion.p>
            </div>

            <CategoryFilter
                categories={scarCategories}
                activeCategory={activeCategory}
                onSelect={handleCategoryChange}
            />

            <motion.div layout className="space-y-4 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {filteredScars.map((scar, index) => (
                        <ScarCard
                            key={scar.id}
                            scar={scar}
                            index={index}
                            isExpanded={expandedId === scar.id}
                            onToggle={toggleScar}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}