"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import Marquee from "@/components/ui/marquee";
import { Skill, skillsData } from "./skills.data";
import { SkillModal } from "./SkillModal";
import { SkillNode } from "./SkillNode";

export default function NeuralSkills() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    const { desktopRow1, desktopRow2, mobileRow1, mobileRow2, mobileRow3 } = useMemo(() => {
        const half = Math.ceil(skillsData.length / 2);
        return {
            desktopRow1: skillsData.slice(0, half),
            desktopRow2: skillsData.slice(half),
            mobileRow1: skillsData.slice(0, 5),
            mobileRow2: skillsData.slice(5, 9),
            mobileRow3: skillsData.slice(9),
        };
    }, []);

    const handleSelect = useCallback((skill: Skill) => setSelectedSkill(skill), []);
    const handleClose = useCallback(() => setSelectedSkill(null), []);

    return (
        <section
            aria-labelledby="skills-title"
            className="relative flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden py-24 mb-10 mx-auto"
        >
            <div className="text-center mb-16 px-4 animate-fade-in">
                <h2
                    id="skills-title"
                    className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
                >
                    Neural Skills Map
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Click on any technological node to trace its connections across my architecture, projects, and engineering challenges.
                </p>
            </div>

            <div className="w-full relative">
                {/* Desktop */}
                <div className="hidden md:flex flex-col gap-6 w-full">
                    <Marquee pauseOnHover className="[--duration:40s]">
                        {desktopRow1.map((skill) => (
                            <SkillNode key={`d1-${skill.name}`} skill={skill} onClick={() => handleSelect(skill)} />
                        ))}
                    </Marquee>
                    <Marquee pauseOnHover reverse className="[--duration:45s]">
                        {desktopRow2.map((skill) => (
                            <SkillNode key={`d2-${skill.name}`} skill={skill} onClick={() => handleSelect(skill)} />
                        ))}
                    </Marquee>
                </div>

                {/* Mobile */}
                <div className="flex md:hidden flex-col gap-4 w-full">
                    <Marquee pauseOnHover className="[--duration:30s]">
                        {mobileRow1.map((skill) => (
                            <SkillNode key={`m1-${skill.name}`} skill={skill} onClick={() => handleSelect(skill)} />
                        ))}
                    </Marquee>
                    <Marquee pauseOnHover reverse className="[--duration:35s]">
                        {mobileRow2.map((skill) => (
                            <SkillNode key={`m2-${skill.name}`} skill={skill} onClick={() => handleSelect(skill)} />
                        ))}
                    </Marquee>
                    <Marquee pauseOnHover className="[--duration:25s]">
                        {mobileRow3.map((skill) => (
                            <SkillNode key={`m3-${skill.name}`} skill={skill} onClick={() => handleSelect(skill)} />
                        ))}
                    </Marquee>
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background via-background/80 to-transparent transform-gpu" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background via-background/80 to-transparent transform-gpu" aria-hidden="true" />
            </div>

            <AnimatePresence>
                {selectedSkill && (
                    <SkillModal skill={selectedSkill} onClose={handleClose} />
                )}
            </AnimatePresence>
        </section>
    );
}