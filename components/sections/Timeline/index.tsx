"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { timelineData } from "./timeline.data";
import { TimelineCard } from "./TimelineCard";

export default function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end end"],
    });

    // Tighter spring = snappier feel with near-zero perceived lag
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 40,
        restDelta: 0.001,
        mass: 0.5,
    });

    return (
        <section
            ref={containerRef}
            className="relative w-full py-24 overflow-hidden"
            id="timeline"
        >
            {/* Static grid background — pure CSS, zero JS cost */}
            <div
                className="absolute inset-0 -z-10 h-full w-full bg-background"
                style={{
                    backgroundImage:
                        "linear-gradient(to right,#80808012 1px,transparent 1px),linear-gradient(to bottom,#80808012 1px,transparent 1px)",
                    backgroundSize: "24px 24px",
                    maskImage:
                        "radial-gradient(ellipse at center,black 40%,transparent 80%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse at center,black 40%,transparent 80%)",
                }}
            />

            <div className="container mx-auto px-4 md:px-6">
                {/* Section header — once:true so animations never replay */}
                <div className="flex flex-col items-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{ willChange: "opacity, transform" }}
                        className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tighter text-center"
                    >
                        My{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                            Journey
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                        style={{ willChange: "opacity, transform" }}
                        className="text-muted-foreground mt-4 text-center max-w-2xl text-lg"
                    >
                        From writing my first line of code to architecting scalable systems.
                    </motion.p>
                </div>

                <div className="relative mx-auto max-w-4xl">
                    {/* Static base line — no motion, no cost */}
                    <div className="absolute left-8 top-0 h-full w-px md:left-1/2 bg-border rounded-full" />

                    {/* Single animated fill line for the whole section */}
                    <motion.div
                        style={{
                            scaleY: smoothProgress,
                            willChange: "transform",
                            background: "linear-gradient(to bottom,#3b82f6,#a855f7,#10b981)",
                            boxShadow: "0 0 12px 2px rgba(168,85,247,0.4)",
                        }}
                        className="absolute left-8 top-0 h-full w-[3px] -ml-px md:left-1/2 rounded-full origin-top z-10"
                    />

                    {timelineData.map((item, index) => (
                        <TimelineCard key={item.title} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}