"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Link as LinkIcon, AlertTriangle, Lightbulb, CheckCircle2, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import Marquee from "./magicui/marquee";

type Skill = {
    name: string;
    icon: string;
    status: "Battle-Tested" | "Production Ready" | "R&D / Exploring";
    projects: string[];
    scarId: string | null;
};

const skillsData: Skill[] = [
    {
        name: "Next.js 14+",
        icon: "/skills/nextjs.svg",
        status: "Battle-Tested",
        projects: ["CS Arena", "Blog Pro"],
        scarId: "cascading-filters-race"
    },
    {
        name: "TypeScript",
        icon: "/skills/typescript.svg",
        status: "Battle-Tested",
        projects: ["Cybership API", "CS Arena", "Flurry v2.0"],
        scarId: "ddd-boundaries"
    },
    {
        name: "WebRTC",
        icon: "/skills/webrtc.svg",
        status: "Battle-Tested",
        projects: ["Flurry v2.0"],
        scarId: "webrtc-latency"
    },
    {
        name: "Socket.io",
        icon: "/skills/socketio.svg",
        status: "Battle-Tested",
        projects: ["Flurry v2.0"],
        scarId: "webrtc-latency"
    },
    {
        name: "MongoDB",
        icon: "/skills/mongodb.svg",
        status: "Production Ready",
        projects: ["Admin Dashboard", "Blog Pro", "Flurry v2.0"],
        scarId: null
    },
    {
        name: "Node.js",
        icon: "/skills/nodejs.svg",
        status: "Production Ready",
        projects: ["Cybership API", "Admin Dashboard", "Blog Pro"],
        scarId: null
    },
    {
        name: "NestJS",
        icon: "/skills/nestjs.svg",
        status: "Production Ready",
        projects: ["Cybership API"],
        scarId: null
    },
    {
        name: "GraphQL",
        icon: "/skills/graphql.svg",
        status: "R&D / Exploring",
        projects: [],
        scarId: null
    },
    {
        name: "Zod",
        icon: "/skills/zod.svg",
        status: "Battle-Tested",
        projects: ["Cybership API", "CS Arena"],
        scarId: "ddd-boundaries"
    },
    {
        name: "React",
        icon: "/skills/react.svg",
        status: "Production Ready",
        projects: ["CS Arena", "Flurry v2.0", "Blog Pro"],
        scarId: null
    },
    {
        name: "Tailwind CSS",
        icon: "/skills/tailwindcss.svg",
        status: "Production Ready",
        projects: ["CS Arena", "Flurry v2.0", "Gemini Clone"],
        scarId: null
    },
    {
        name: "Firebase",
        icon: "/skills/firebase.svg",
        status: "Production Ready",
        projects: ["Realtime Chat Engine"],
        scarId: null
    },
    {
        name: "Gemini AI",
        icon: "/skills/google.svg",
        status: "Battle-Tested",
        projects: ["Gemini Clone", "Flurry v2.0"],
        scarId: "gemini-clone"
    }
];

export default function NeuralSkills() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    const handleJumpToScar = (scarId: string) => {
        setSelectedSkill(null);
        setTimeout(() => {
            const el = document.getElementById(scarId);
            const container = document.getElementById('battle-scars');
            if (container) {
                container.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    const getStatusConfig = (status: Skill["status"]) => {
        switch (status) {
            case "Battle-Tested":
                return { color: "text-red-600 dark:text-red-500", bg: "bg-red-500/10", icon: Activity };
            case "Production Ready":
                return { color: "text-emerald-600 dark:text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 };
            case "R&D / Exploring":
                return { color: "text-purple-600 dark:text-purple-500", bg: "bg-purple-500/10", icon: FlaskConical };
        }
    };

    const firstRow = skillsData.slice(0, Math.ceil(skillsData.length / 2));
    const secondRow = skillsData.slice(Math.ceil(skillsData.length / 2));

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

            <div className="w-full relative flex flex-col gap-6">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {firstRow.map((skill, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => setSelectedSkill(skill)}
                            aria-label={`View details for ${skill.name}`}
                            className="group/skill relative mx-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md transition-[transform,background-color,box-shadow,border-color] duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 hover:border-blue-500/50 hover:bg-card hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] cursor-pointer transform-gpu will-change-transform"
                        >
                            <img
                                src={skill.icon}
                                alt={`${skill.name} icon`}
                                className="h-12 w-12 opacity-50 transition-[opacity,filter] duration-500 group-hover/skill:opacity-100 group-focus/skill:opacity-100 grayscale group-hover/skill:grayscale-0 group-focus/skill:grayscale-0 dark:invert dark:group-hover/skill:invert-0 dark:group-focus/skill:invert-0 will-change-[opacity,filter]"
                            />
                            {skill.scarId && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-background transform-gpu" aria-label="Has battle scar"></span>
                            )}
                        </button>
                    ))}
                </Marquee>

                <Marquee pauseOnHover reverse className="[--duration:45s]">
                    {secondRow.map((skill, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => setSelectedSkill(skill)}
                            aria-label={`View details for ${skill.name}`}
                            className="group/skill relative mx-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md transition-[transform,background-color,box-shadow,border-color] duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110 hover:border-blue-500/50 hover:bg-card hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] cursor-pointer transform-gpu will-change-transform"
                        >
                            <img
                                src={skill.icon}
                                alt={`${skill.name} icon`}
                                className="h-12 w-12 opacity-50 transition-[opacity,filter] duration-500 group-hover/skill:opacity-100 group-focus/skill:opacity-100 grayscale group-hover/skill:grayscale-0 group-focus/skill:grayscale-0 dark:invert dark:group-hover/skill:invert-0 dark:group-focus/skill:invert-0 will-change-[opacity,filter]"
                            />
                            {skill.scarId && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-background transform-gpu" aria-label="Has battle scar"></span>
                            )}
                        </button>
                    ))}
                </Marquee>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background via-background/80 to-transparent transform-gpu"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background via-background/80 to-transparent transform-gpu"></div>
            </div>

            <AnimatePresence>
                {selectedSkill && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSkill(null)}
                            style={{ willChange: "opacity" }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            aria-hidden="true"
                        />
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="skill-modal-title"
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            style={{ willChange: "transform, opacity" }}
                            className="relative w-full max-w-lg bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 md:p-8 transform-gpu"
                        >
                            <button
                                type="button"
                                aria-label="Close modal"
                                onClick={() => setSelectedSkill(null)}
                                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <X className="w-5 h-5" aria-hidden="true" />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted border border-border">
                                    <img src={selectedSkill.icon} alt="" className="w-8 h-8 dark:invert transform-gpu" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 id="skill-modal-title" className="text-2xl font-bold text-foreground">{selectedSkill.name}</h3>

                                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mt-2", getStatusConfig(selectedSkill.status).bg, getStatusConfig(selectedSkill.status).color)}>
                                        {(() => {
                                            const StatusIcon = getStatusConfig(selectedSkill.status).icon;
                                            return <StatusIcon className="w-3.5 h-3.5" aria-hidden="true" />;
                                        })()}
                                        {selectedSkill.status}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" aria-hidden="true" /> Neural Connections
                                    </h4>
                                    {selectedSkill.projects.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSkill.projects.map((project, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-lg font-medium">
                                                    {project}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-muted/50 rounded-xl border border-border border-dashed">
                                            <p className="text-sm text-muted-foreground flex items-start gap-2">
                                                <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" aria-hidden="true" />
                                                Currently researching and exploring this technology in isolated environments. Production implementations coming soon.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {selectedSkill.scarId && (
                                    <div className="pt-4 border-t border-border/50">
                                        <button
                                            type="button"
                                            onClick={() => handleJumpToScar(selectedSkill.scarId!)}
                                            className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-500 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform transform-gpu will-change-transform" aria-hidden="true" />
                                                <span className="font-bold text-sm">View Linked Battle Scar</span>
                                            </div>
                                            <Activity className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}