// ContactSection.tsx
"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { Suspense } from "react";
import { GitHubStatsPanel } from "./GitHubStatsPanel";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Cpu, Terminal, Shield, Zap } from "lucide-react";

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
    // This client component sits above a Suspense-fed server panel and cannot be
    // prop-drilled isMobile, so it reads the shared hook directly.
    const isMobile = useIsMobile();

    // Helper: only attach motion animation props off mobile.
    const anim = (
        variants: Record<string, unknown>,
        extra?: Record<string, unknown>
    ) =>
        isMobile
            ? {}
            : {
                  variants,
                  initial: "hidden" as const,
                  whileInView: "visible" as const,
                  viewport,
                  ...extra,
              };

    return (
        <section
            id="contact"
            className="py-32 w-full relative overflow-hidden flex items-center justify-center"
        >
            <div className="contact-glow" aria-hidden="true" />

            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">

                <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">

                    <motion.div
                        {...anim(fadeUp)}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 text-sm font-semibold tracking-wide border"
                        style={{
                            backgroundColor: "hsl(var(--accent-blue) / 0.1)",
                            borderColor: "hsl(var(--accent-blue) / 0.2)",
                            color: "var(--color-accent)",
                        }}
                    >
                        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                            <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                style={{ backgroundColor: "var(--color-live-light)" }}
                            />
                            <span
                                className="relative inline-flex rounded-full h-2.5 w-2.5"
                                style={{ backgroundColor: "var(--color-live)" }}
                            />
                        </span>
                        Available for Remote Opportunities
                    </motion.div>

                    <motion.h2
                        {...anim(fadeUpFar, { transition: { delay: 0.1 } })}
                        className="text-4xl min-[380px]:text-5xl md:text-7xl font-extrabold text-foreground tracking-tighter mb-6 leading-[1.1]"
                    >
                        Working <br />
                        <span
                            className="text-transparent bg-clip-text"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, var(--color-accent), var(--color-accent-secondary))",
                            }}
                        >
                            Worldwide.
                        </span>
                    </motion.h2>

                    <motion.p
                        {...anim(fadeUp, { transition: { delay: 0.2 } })}
                        className="text-muted-foreground text-lg md:text-xl mb-6 max-w-lg leading-relaxed font-medium"
                    >
                        Based in Egypt 🇪🇬. Engineering secure real-time game engines,
                        custom sandboxed compilers, and high-throughput microservices. Architecting
                        resilient systems for global scale.
                    </motion.p>

                    <motion.div
                        {...anim(fadeUp, { transition: { delay: 0.25 } })}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-lg mb-8 text-left mt-2"
                    >
                        <div className="flex gap-3 p-3 rounded-2xl bg-card border border-border hover:border-[hsl(var(--accent-blue))]/40 hover:bg-muted/20 dark:hover:bg-white/3 transition-all duration-300">
                            <Cpu className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "hsl(var(--accent-blue))" }} />
                            <div>
                                <h4 className="text-sm font-semibold text-foreground">Real-Time Engines</h4>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                                    WebSockets, WebRTC, & high-frequency game loop sync.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 p-3 rounded-2xl bg-card border border-border hover:border-[hsl(var(--accent-purple))]/40 hover:bg-muted/20 dark:hover:bg-white/3 transition-all duration-300">
                            <Terminal className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "hsl(var(--accent-purple))" }} />
                            <div>
                                <h4 className="text-sm font-semibold text-foreground">Compiler Design</h4>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                                    Custom AST parsing & secure server-side execution sandboxes.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 p-3 rounded-2xl bg-card border border-border hover:border-[hsl(var(--accent-emerald))]/40 hover:bg-muted/20 dark:hover:bg-white/3 transition-all duration-300">
                            <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "hsl(var(--accent-emerald))" }} />
                            <div>
                                <h4 className="text-sm font-semibold text-foreground">Defensive Architecture</h4>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                                    Domain-Driven Design & robust Anti-Corruption Layers.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 p-3 rounded-2xl bg-card border border-border hover:border-[var(--tl-accent-yellow)]/40 hover:bg-muted/20 dark:hover:bg-white/3 transition-all duration-300">
                            <Zap className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--tl-accent-yellow)" }} />
                            <div>
                                <h4 className="text-sm font-semibold text-foreground">High-Throughput APIs</h4>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                                    Redis caching, multi-layer validation, & rate-limiting.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div {...anim(scaleIn, { transition: { delay: 0.35 } })}>
                        <MagneticButton href="mailto:ali.haggag2005@gmail.com">
                            Let&apos;s Build Together
                        </MagneticButton>
                    </motion.div>
                </div>

                <motion.div
                    {...anim(rightVariant)}
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
