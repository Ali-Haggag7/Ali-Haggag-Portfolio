"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { timelineData } from "./timeline.data";
import { TimelineCard } from "./TimelineCard";

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

    return (
        <section ref={containerRef} className="relative w-full py-24 overflow-hidden" id="timeline">
            <div
                className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] transform-gpu"
                style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }}
            ></div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tighter text-center transform-gpu will-change-[opacity,transform]"
                    >
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Journey</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-4 text-center max-w-2xl text-lg transform-gpu will-change-[opacity,transform]"
                    >
                        From writing my first line of code to architecting scalable systems.
                    </motion.p>
                </div>

                <div className="relative mx-auto max-w-4xl">
                    <div className="absolute left-8 top-0 h-full w-[2px] -ml-[1px] bg-border md:left-1/2 rounded-full"></div>

                    <motion.div
                        style={{ scaleY: smoothProgress }}
                        className="absolute left-8 top-0 h-full w-[4px] -ml-[2px] bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 md:left-1/2 rounded-full origin-top shadow-[0_0_15px_rgba(168,85,247,0.5)] z-0 transform-gpu will-change-transform"
                    ></motion.div>

                    {timelineData.map((item, index) => (
                        <TimelineCard key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}