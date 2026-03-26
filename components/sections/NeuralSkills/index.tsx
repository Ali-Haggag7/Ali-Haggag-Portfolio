"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Wrench } from "lucide-react";
import { Skill, technicalArsenal } from "./skills.data";
import { CategoryRow } from "./CategoryRow";
import { SkillModal } from "./SkillModal";

export default function NeuralSkills() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    const handleSelect = useCallback((skill: Skill) => setSelectedSkill(skill), []);
    const handleClose = useCallback(() => setSelectedSkill(null), []);

    return (
        <section
            aria-labelledby="skills-title"
            className="relative flex w-full max-w-5xl flex-col items-center justify-center py-24 mb-10 mx-auto px-4 md:px-8"
        >
            {/* Super Optimized Glow Effect: Using pure CSS radial-gradient instead of expensive filter:blur() */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none -z-10"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
                aria-hidden="true"
            />

            <div className="text-center mb-16 px-4 animate-fade-in">
                <div className="inline-flex items-center justify-center gap-2 mb-4">
                    <span className="text-blue-500 font-mono text-sm uppercase tracking-widest font-bold flex items-center gap-2 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
                        <Wrench className="w-4 h-4" aria-hidden="true" /> Technical Arsenal
                    </span>
                </div>

                <h2
                    id="skills-title"
                    className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
                >
                    My Technology Stack
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    A highly curated ecosystem of tools, frameworks, and languages I use to architect and deploy scalable, production-grade applications.
                </p>
            </div>

            {/* Removed the laggy backdrop-blur, used a sleek solid/semi-solid card background */}
            <div className="w-full flex flex-col gap-2 relative z-10 bg-card border border-border/50 rounded-3xl p-2 md:p-6 shadow-xl">
                {technicalArsenal.map((category, index) => (
                    <CategoryRow
                        key={category.title}
                        category={category}
                        index={index}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedSkill && (
                    <SkillModal skill={selectedSkill} onClose={handleClose} />
                )}
            </AnimatePresence>
        </section>
    );
}