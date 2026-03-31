// ContactSection.tsx
"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { Suspense } from "react";
import { GitHubStatsPanel } from "./GitHubStatsPanel";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const fadeUpFar = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

const rightVariant = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6 },
    },
};

const viewport = { once: true } as const;

function StatsSkeleton() {
    return (
        <div className="w-full flex flex-col gap-4 animate-pulse">
            <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-muted/30" />
                ))}
            </div>
            <div className="h-24 rounded-xl bg-muted/30" />
            <div className="h-16 rounded-xl bg-muted/30" />
        </div>
    );
}

export default function ContactSection({ statsPanel }: { statsPanel: React.ReactNode }) {
    return (
        <section
            id="contact"
            className="py-32 w-full relative overflow-hidden flex items-center justify-center"
        >
            <div className="contact-glow" aria-hidden="true" />

            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">

                {/* ── Left column ── */}
                <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 mb-8 text-sm font-semibold tracking-wide"
                    >
                        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                        </span>
                        Available for Remote Opportunities
                    </motion.div>

                    <motion.h2
                        variants={fadeUpFar}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tighter mb-6 leading-[1.1]"
                    >
                        Working <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                            Worldwide.
                        </span>
                    </motion.h2>

                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-medium"
                    >
                        Based in Egypt 🇪🇬. Architecting high-performance MERN applications,
                        real-time systems, and AI-driven solutions for clients across the
                        globe. Distance is just a detail.
                    </motion.p>

                    <motion.div
                        variants={scaleIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        transition={{ delay: 0.3 }}
                    >
                        <MagneticButton href="mailto:ali.haggag2005@gmail.com">
                            Let's Build Together
                        </MagneticButton>
                    </motion.div>
                </div>

                {/* ── Right column — GitHub Stats ── */}
                <motion.div
                    variants={rightVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="w-full lg:w-1/2 flex items-start justify-center mt-10 lg:mt-0"
                >
                    <div className="w-full max-w-md">
                        <Suspense fallback={<StatsSkeleton />}>
                            {statsPanel}
                        </Suspense>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}