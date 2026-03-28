"use client";

import { useState, useCallback, useRef, memo } from "react";
import { AnimatePresence } from "framer-motion";
import { Wrench } from "lucide-react";
import { Skill, technicalArsenal } from "./skills.data";
import { SkillBadge } from "./SkillBadge";
import { SkillModal } from "./SkillModal";

// Stable per-skill handler factory — same reference per skill.name across renders,
// so SkillBadge's memo bail-out is never defeated by inline arrow functions.
function useStableHandlers(onSelect: (s: Skill) => void) {
    const handlersRef = useRef<Map<string, () => void>>(new Map());

    return useCallback(
        (skill: Skill): (() => void) => {
            if (!handlersRef.current.has(skill.name)) {
                handlersRef.current.set(skill.name, () => onSelect(skill));
            }
            return handlersRef.current.get(skill.name)!;
        },
        [onSelect]
    );
}

// Extracted so React can bail out on re-renders when category data hasn't changed.
const SkillCategory = memo(function SkillCategory({
    title,
    skills,
    getHandler,
}: {
    title: string;
    skills: Skill[];
    getHandler: (skill: Skill) => () => void;
}) {
    return (
        <div className="group relative flex flex-col gap-5 bg-card/80 border border-border/50 rounded-3xl p-6 overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 w-full md:w-fit max-w-full">
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-blue-500/5 to-transparent"
            />

            <div className="relative z-10 flex items-center gap-3">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
                    {title}
                </h3>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
                {skills.map((skill) => (
                    <SkillBadge
                        key={skill.name}
                        skill={skill}
                        onClick={getHandler(skill)}
                    />
                ))}
            </div>
        </div>
    );
});

export default function NeuralSkills() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    const handleSelect = useCallback((skill: Skill) => setSelectedSkill(skill), []);
    const handleClose = useCallback(() => setSelectedSkill(null), []);
    const getHandler = useStableHandlers(handleSelect);

    return (
        <section
            aria-labelledby="skills-title"
            className="relative flex w-full max-w-6xl flex-col items-center justify-center pt-24 pb-32 mx-auto px-4 md:px-8"
        >
            <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none -z-10"
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)" }}
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

            <div className="w-full flex flex-wrap justify-center items-stretch md:items-start gap-4 md:gap-6 relative z-10">
                {technicalArsenal.map((category) => (
                    <SkillCategory
                        key={category.title}
                        title={category.title}
                        skills={category.skills}
                        getHandler={getHandler}
                    />
                ))}
            </div>

            {/* mode="wait" ensures clean exit before a new skill modal mounts */}
            <AnimatePresence mode="wait">
                {selectedSkill && (
                    <SkillModal
                        key={selectedSkill.name}
                        skill={selectedSkill}
                        onClose={handleClose}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}