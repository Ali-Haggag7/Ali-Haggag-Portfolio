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
            <div
                className="absolute inset-0 -z-10 h-full w-full bg-background pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(to right,#80808012 1px,transparent 1px),linear-gradient(to bottom,#80808012 1px,transparent 1px)",
                    backgroundSize: "24px 24px",
                    maskImage: "radial-gradient(ellipse at center,black 40%,transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center,black 40%,transparent 80%)",
                }}
                aria-hidden="true"
            />

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center mb-16 animate-fade-in">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tighter text-center">
                        My{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                            Journey
                        </span>
                    </h2>
                    <p className="text-muted-foreground mt-4 text-center max-w-2xl text-lg">
                        From writing my first line of code to architecting scalable systems.
                    </p>
                </div>

                <div className="relative mx-auto max-w-4xl">
                    <div className="absolute left-8 top-0 h-full w-px md:left-1/2 bg-border rounded-full transform-gpu" aria-hidden="true" />

                    <motion.div
                        style={{
                            scaleY: smoothProgress,
                            background: "linear-gradient(to bottom,#3b82f6,#a855f7,#10b981)",
                        }}
                        className="absolute left-8 top-0 h-full w-[3px] -ml-px md:left-1/2 rounded-full origin-top z-10 shadow-[0_0_12px_2px_rgba(168,85,247,0.4)] transform-gpu will-change-transform"
                        aria-hidden="true"
                    />

                    {timelineData.map((item, index) => (
                        <TimelineCard key={item.title} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}