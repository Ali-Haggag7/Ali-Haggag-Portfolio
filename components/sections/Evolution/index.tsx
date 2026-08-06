"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { evolutionData } from "./evolution.data";
import { EvolutionCard } from "./EvolutionCard";
import { NarrativeConnector } from "./NarrativeConnector";

const SPRING_CONFIG = { stiffness: 200, damping: 40, restDelta: 0.001, mass: 0.5 } as const;
const SCROLL_OFFSET: any = ["start center", "end end"];

const GRID_BG: React.CSSProperties = {
    backgroundImage: "linear-gradient(to right,#80808012 1px,transparent 1px),linear-gradient(to bottom,#80808012 1px,transparent 1px)",
    backgroundSize: "24px 24px",
    maskImage: "radial-gradient(ellipse at center,black 40%,transparent 80%)",
    WebkitMaskImage: "radial-gradient(ellipse at center,black 40%,transparent 80%)",
};

const PROGRESS_LINE_STYLE: React.CSSProperties = {
    background: "linear-gradient(to bottom, var(--evo-accent-1), var(--evo-accent-3), var(--evo-accent-5), var(--evo-accent-6))",
};

const toAnchorId = (id: string) => `evo-${id}`;

export default function EvolutionArc() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: SCROLL_OFFSET,
    });

    const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    const anchors = useMemo(
        () => evolutionData.map((item) => ({ title: item.title, id: toAnchorId(item.id), year: item.year })),
        []
    );

    const jumpTo = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <section
            ref={containerRef}
            id="evolution"
            className="relative w-full py-24 bg-transparent overflow-hidden"
        >
            {/* Grid background */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 h-full w-full bg-transparent pointer-events-none"
                style={GRID_BG}
            />

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto animate-fade-in">
                    <p className="section-eyebrow mb-3">Chapter by Chapter</p>
                    <h2 className="section-title text-4xl md:text-5xl mb-3">
                        My Engineering{" "}
                        <span className="accent-word">Evolution</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                        From writing my first line of C++ to architecting autonomous AI agents with custom languages.
                    </p>
                </div>

                {/* Quick-nav buttons */}
                <nav
                    aria-label="Jump to chapter"
                    className="mb-16 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 w-full px-2"
                >
                    {anchors.map(({ title, id, year }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => jumpTo(id)}
                            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-mono font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                        >
                            <span className="opacity-60">{year}</span>
                            <span>{title}</span>
                        </button>
                    ))}
                </nav>

                <div className="relative mx-auto max-w-4xl">
                    {/* Static track line */}
                    <div
                        aria-hidden="true"
                        className="absolute left-8 top-0 h-full w-px md:left-1/2 bg-border rounded-full"
                    />

                    {/* Animated scroll progress line */}
                    <motion.div
                        aria-hidden="true"
                        style={{ scaleY: smoothProgress, ...PROGRESS_LINE_STYLE }}
                        className="absolute left-8 top-0 h-full w-[3px] -ml-px md:left-1/2 rounded-full origin-top z-10 shadow-[0_0_12px_2px_rgba(168,85,247,0.4)] will-change-transform"
                    />

                    {evolutionData.map((chapter, index) => (
                        <div key={chapter.id}>
                            <EvolutionCard
                                chapter={chapter}
                                index={index}
                                isMobile={isMobile}
                            />
                            {chapter.narrativeConnector && (
                                <NarrativeConnector
                                    text={chapter.narrativeConnector}
                                    isMobile={isMobile}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
