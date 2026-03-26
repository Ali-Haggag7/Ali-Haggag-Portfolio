"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { Globe } from "./Globe";

export default function ContactSection() {
    return (
        <section id="contact" className="py-32 w-full relative overflow-hidden flex items-center justify-center">
            <div
                className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none -z-10"
                style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }}
                aria-hidden="true"
            />

            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 mb-8 text-sm font-semibold tracking-wide"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                        </span>
                        Available for Remote Opportunities
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tighter mb-6 leading-[1.1]"
                    >
                        Working <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                            Worldwide.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-medium"
                    >
                        Based in Egypt 🇪🇬. Architecting high-performance MERN applications, real-time systems, and AI-driven solutions for clients across the globe. Distance is just a detail.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <MagneticButton href="mailto:ali.haggag2005@gmail.com">
                            Let's Build Together
                        </MagneticButton>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full lg:w-1/2 flex items-center justify-center relative mt-10 lg:mt-0"
                >
                    <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
                        <div
                            className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(6,182,212,0.1) 50%, transparent 70%)' }}
                            aria-hidden="true"
                        />
                        <Globe className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}