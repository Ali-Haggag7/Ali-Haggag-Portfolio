"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Marquee from "@/components/ui/marquee";
import { Skill, skillsData } from "./skills.data";
import { SkillModal } from "./SkillModal";
import { SkillNode } from "./SkillNode";

export default function NeuralSkills() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    const desktopRow1 = skillsData.slice(0, Math.ceil(skillsData.length / 2));
    const desktopRow2 = skillsData.slice(Math.ceil(skillsData.length / 2));

    const mobileRow1 = skillsData.slice(0, 5);
    const mobileRow2 = skillsData.slice(5, 9);
    const mobileRow3 = skillsData.slice(9);

    return (
        <section aria-labelledby="skills-title" className="relative flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden py-24 mb-10 mx-auto">
            <div className="text-center mb-16 px-4">
                <motion.h2
                    id="skills-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4"
                >
                    Neural Skills Map
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-lg max-w-2xl mx-auto"
                >
                    Click on any technological node to trace its connections across my architecture, projects, and engineering challenges.
                </motion.p>
            </div>

            <div className="w-full relative">
                <div className="hidden md:flex flex-col gap-6 w-full">
                    <Marquee pauseOnHover className="[--duration:40s]">
                        {desktopRow1.map((skill, index) => (
                            <SkillNode key={`desktop-1-${index}`} skill={skill} onClick={() => setSelectedSkill(skill)} />
                        ))}
                    </Marquee>
                    <Marquee pauseOnHover reverse className="[--duration:45s]">
                        {desktopRow2.map((skill, index) => (
                            <SkillNode key={`desktop-2-${index}`} skill={skill} onClick={() => setSelectedSkill(skill)} />
                        ))}
                    </Marquee>
                </div>

                <div className="flex md:hidden flex-col gap-4 w-full">
                    <Marquee pauseOnHover className="[--duration:30s]">
                        {mobileRow1.map((skill, index) => (
                            <SkillNode key={`mobile-1-${index}`} skill={skill} onClick={() => setSelectedSkill(skill)} />
                        ))}
                    </Marquee>
                    <Marquee pauseOnHover reverse className="[--duration:35s]">
                        {mobileRow2.map((skill, index) => (
                            <SkillNode key={`mobile-2-${index}`} skill={skill} onClick={() => setSelectedSkill(skill)} />
                        ))}
                    </Marquee>
                    <Marquee pauseOnHover className="[--duration:25s]">
                        {mobileRow3.map((skill, index) => (
                            <SkillNode key={`mobile-3-${index}`} skill={skill} onClick={() => setSelectedSkill(skill)} />
                        ))}
                    </Marquee>
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background via-background/80 to-transparent transform-gpu"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background via-background/80 to-transparent transform-gpu"></div>
            </div>

            <AnimatePresence>
                {selectedSkill && (
                    <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
                )}
            </AnimatePresence>
        </section>
    );
}