"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { timelineData } from "./timeline.data";
import { TimelineCard } from "./TimelineCard";

// Stable config objects — defined outside the component so useScroll and
// useSpring receive the same references on every render, preventing
// unnecessary hook re-initialisation.
const SPRING_CONFIG = { stiffness: 200, damping: 40, restDelta: 0.001, mass: 0.5 } as const;
const SCROLL_OFFSET: any = ["start center", "end end"];

const GRID_BG: React.CSSProperties = {
    backgroundImage: "linear-gradient(to right,#80808012 1px,transparent 1px),linear-gradient(to bottom,#80808012 1px,transparent 1px)",
    backgroundSize: "24px 24px",
    maskImage: "radial-gradient(ellipse at center,black 40%,transparent 80%)",
    WebkitMaskImage: "radial-gradient(ellipse at center,black 40%,transparent 80%)",
};

const PROGRESS_LINE_STYLE: React.CSSProperties = {
    background: "linear-gradient(to bottom,#3b82f6,#a855f7,#10b981)",
};

// Deterministic, SSR-safe anchor id from a period label (e.g. "2026 — Present").
const toAnchorId = (year: string) =>
    "timeline-" + year.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: SCROLL_OFFSET,
    });

    // useSpring with a stable config object avoids re-creating the spring on re-renders.
    const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);

    // isMobile computed once here and passed down as a prop. SSR-safe: defaults
    // to false on the server, syncs after mount to avoid hydration mismatch.
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    // Precompute anchor ids once.
    const anchors = useMemo(
        () => timelineData.map((item) => ({ year: item.year, id: toAnchorId(item.year) })),
        []
    );

    const jumpTo = useCallback((id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <section
            ref={containerRef}
            id="timeline"
            className="relative w-full py-24 overflow-hidden"
        >
            {/* Grid background */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 h-full w-full bg-background pointer-events-none"
                style={GRID_BG}
            />

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center mb-10 animate-fade-in">
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

                {/* Jump to year quick-nav */}
                <nav
                    aria-label="Jump to year"
                    className="mb-16 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
                >
                    {anchors.map(({ year, id }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => jumpTo(id)}
                            className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-card px-4 text-sm font-mono font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground hover:border-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                        >
                            {year}
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

                    {timelineData.map((item, index) => (
                        <TimelineCard
                            key={item.title}
                            item={item}
                            index={index}
                            anchorId={toAnchorId(item.year)}
                            isMobile={isMobile}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
