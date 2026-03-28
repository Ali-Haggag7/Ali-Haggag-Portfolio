// ContactSection.tsx
"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { Globe } from "./Globe";

// All variants live in module scope — one allocation, zero re-creation.
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

const globeVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8 },
    },
};

// Shared viewport config — same object ref passed to every motion element.
const viewport = { once: true } as const;

export default function ContactSection() {
    return (
        <section
            id="contact"
            className="py-32 w-full relative overflow-hidden flex items-center justify-center"
        >
            {/* Static glow — moved to CSS class, no inline style object on render */}
            <div className="contact-glow" aria-hidden="true" />

            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">

                {/* ── Left column ── */}
                <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">

                    {/* Available badge */}
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

                    {/* Heading */}
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

                    {/* Body */}
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

                    {/* CTA — MagneticButton handles its own GPU layer, no wrapper needed */}
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

                {/* ── Globe column ── */}
                <motion.div
                    variants={globeVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="w-full lg:w-1/2 flex items-center justify-center mt-10 lg:mt-0"
                    // Promote to its own compositor layer early — prevents jank on entry animation.
                    style={{ willChange: "transform, opacity" }}
                >
                    {/* Single sizing wrapper — Globe inherits w-full / aspect-square internally */}
                    <div className="relative w-full max-w-[600px] aspect-square">
                        <div className="globe-inner-glow absolute inset-0 rounded-full pointer-events-none" aria-hidden="true" />
                        <Globe className="w-full h-full relative z-10" />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}