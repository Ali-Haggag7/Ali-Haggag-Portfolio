"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { GraduationCap, Layout, Database, Rocket } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const timelineData = [
    {
        year: "2023",
        title: "The Beginning",
        description: "Started my B.Sc. in Computer Science & Artificial Intelligence at South Valley National University. Laid strong foundations in Data Structures, OOP, and Database Systems.",
        icon: GraduationCap,
        color: "text-purple-500",
        glowBg: "bg-purple-500/10",
        hoverBorder: "group-hover:border-purple-500/50 group-focus:border-purple-500/50",
        isActive: false,
    },
    {
        year: "2024",
        title: "Frontend Engineering",
        description: "Mastered the UI/UX world. Earned my Front-End Development Diploma (React.js) and built responsive, interactive interfaces using Tailwind CSS and Framer Motion.",
        icon: Layout,
        color: "text-blue-500",
        glowBg: "bg-blue-500/10",
        hoverBorder: "group-hover:border-blue-500/50 group-focus:border-blue-500/50",
        isActive: false,
    },
    {
        year: "2025",
        title: "Backend & Full-Stack Shift",
        description: "Completed a Backend Internship at Web Masters. Engineered RESTful APIs, optimized MongoDB schemas, and mastered the MERN stack with strict JWT authentication.",
        icon: Database,
        color: "text-yellow-500",
        glowBg: "bg-yellow-500/10",
        hoverBorder: "group-hover:border-yellow-500/50 group-focus:border-yellow-500/50",
        isActive: false,
    },
    {
        year: "2026 — Present",
        title: "Elite Software Engineer",
        description: "Architecting complex, offline-first systems like the 'Flurry' Super App and the 'CS Arena' developer ecosystem. Specializing in WebRTC, Socket.io, Next.js architecture, and Gemini AI integrations.",
        icon: Rocket,
        color: "text-emerald-500",
        glowBg: "bg-emerald-500/10",
        hoverBorder: "group-hover:border-emerald-500/50 group-focus:border-emerald-500/50",
        isActive: true,
    },
];

export default function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const height = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="relative w-full py-24 overflow-hidden" id="timeline">
            <div
                className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }}
            ></div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tighter text-center"
                    >
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Journey</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-4 text-center max-w-2xl text-lg"
                    >
                        From writing my first line of code to architecting scalable systems.
                    </motion.p>
                </div>

                <div className="relative mx-auto max-w-4xl">
                    <div className="absolute left-8 top-0 h-full w-[2px] -ml-[1px] bg-border md:left-1/2 rounded-full"></div>

                    <motion.div
                        style={{ height }}
                        className="absolute left-8 top-0 w-[4px] -ml-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 md:left-1/2 rounded-full origin-top shadow-[0_0_15px_rgba(168,85,247,0.5)] z-0"
                    ></motion.div>

                    {timelineData.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                            tabIndex={0}
                            className={cn(
                                "group relative mb-16 flex items-center md:justify-between w-full focus:outline-none",
                                index % 2 === 0 ? "md:flex-row-reverse" : "",
                            )}
                        >
                            <div className={cn(
                                "absolute left-8 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 z-10 transition-all duration-500 md:left-1/2",
                                "group-hover:scale-125 group-focus:scale-125 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] group-focus:shadow-[0_0_20px_rgba(0,0,0,0.2)]",
                                "bg-background border-border",
                                "dark:bg-neutral-950 dark:border-neutral-800",
                                item.glowBg
                            )}>
                                {item.isActive && (
                                    <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping", item.glowBg)}></span>
                                )}
                                <item.icon className={cn("h-5 w-5 transition-transform duration-500 group-hover:rotate-12 group-focus:rotate-12", item.color)} />
                            </div>

                            <div className={cn(
                                "ml-20 md:ml-0 w-full md:w-[45%] rounded-2xl p-6 transition-all duration-500",
                                "bg-card/60 backdrop-blur-md border border-border shadow-sm cursor-default relative z-10",
                                "group-hover:-translate-y-2 group-focus:-translate-y-2 group-hover:shadow-xl group-focus:shadow-xl dark:group-hover:shadow-black/50 dark:group-focus:shadow-black/50",
                                item.hoverBorder
                            )}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={cn("text-sm font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-background border border-border dark:border-white/5", item.color)}>
                                        {item.year}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-foreground mt-3 tracking-tight transition-all group-focus:text-transparent group-hover:bg-clip-text group-focus:bg-clip-text group-hover:bg-gradient-to-r group-focus:bg-gradient-to-r group-hover:from-foreground group-focus:from-foreground group-hover:to-muted-foreground group-focus:to-muted-foreground">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-muted-foreground text-base leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}