"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { triggerEasterEggDirect } from "@/components/ui/custom-effects";
import { cn } from "@/lib/utils";
import { footerLinks, socialLinks, handleSmoothScroll, currentYear } from "./footer.data";
import { LocalTime } from "./LocalTime";
import { NewsletterForm } from "./NewsletterForm";

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const socialSpring = {
    type: "spring",
    stiffness: 400,
    damping: 10,
} as const;

const viewport = { once: true } as const;

export default function Footer() {

    return (
        <footer className="w-full relative bg-background pt-20 pb-8 overflow-hidden">
            {/* Top border gradient — CSS only, no layout cost */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="footer-glow" aria-hidden="true" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* ── Brand column ── */}
                    <div className="lg:col-span-4">
                        <motion.h2
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewport}
                            className="text-3xl font-extrabold text-foreground mb-4 tracking-tighter"
                        >
                            Ali{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                                Haggag
                            </span>
                        </motion.h2>

                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-8 font-medium">
                            Systems Engineer & Real-Time Architect. Engineering high-frequency physics engines, sandboxed compilers, and resilient distributed microservices.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={socialSpring}
                                    className={cn(
                                        "group p-3 rounded-full bg-card border border-border text-muted-foreground transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-11 min-w-11 flex items-center justify-center",
                                        social.hoverClass
                                    )}
                                >
                                    <social.icon className="w-5 h-5 transition-colors" aria-hidden="true" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* ── Nav links column ── */}
                    <div className="lg:col-span-2">
                        <h3 className="text-foreground font-bold mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wider pl-1 md:pl-0">Explore</h3>
                        <ul className="flex flex-col bg-card/40 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border border-border/50 md:border-none rounded-[24px] md:rounded-none overflow-hidden space-y-0 md:space-y-1 shadow-sm md:shadow-none">
                            {footerLinks.map((link) => (
                                <li key={link.name} className={cn("border-b border-border/50 md:border-none last:border-b-0")}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleSmoothScroll(e, link.href)}
                                        className="group flex items-center justify-between md:justify-start gap-2 hover:text-blue-500 transition-colors w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px] md:min-h-11 py-3.5 px-4 md:py-2 md:px-1 md:-my-1.5 hover:bg-muted/30 md:hover:bg-transparent active:bg-muted/50 md:active:bg-transparent"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ArrowRight
                                                className="hidden md:block w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-focus:opacity-100 group-focus:translate-x-0 text-blue-500 shrink-0"
                                                aria-hidden="true"
                                            />
                                            <span className="text-[15px] md:text-sm font-medium text-foreground/90 md:text-muted-foreground transition-transform duration-300 md:group-hover:translate-x-1 md:group-focus:translate-x-1">
                                                {link.name}
                                            </span>
                                        </div>
                                        <ArrowRight
                                            className="block md:hidden w-4 h-4 text-muted-foreground/30 shrink-0"
                                            aria-hidden="true"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Systems Diagnostics Console ── */}
                    <div className="lg:col-span-3 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 md:mb-4 pl-1 md:pl-0">
                            <Terminal size={14} className="text-muted-foreground" />
                            <h3 className="text-foreground font-bold text-xs md:text-sm uppercase tracking-wider">Diagnostics</h3>
                        </div>
                        <div className="relative overflow-hidden rounded-[24px] md:rounded-2xl border border-border/50 bg-card/40 md:bg-foreground/3 dark:md:bg-white/3 backdrop-blur-xl md:backdrop-blur-none p-5 md:p-4 font-mono text-[12px] md:text-[11px] leading-relaxed shadow-sm md:shadow-inner">
                            <div className="flex flex-col gap-2 md:gap-1.5 text-muted-foreground select-none">
                                <div className="flex justify-between items-center">
                                    <span>SYS_INTEGRITY:</span>
                                    <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                        SECURE
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>RAM_STATUS:</span>
                                    <span className="text-foreground font-semibold">0_LEAKS</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>COMPILER:</span>
                                    <span className="text-foreground font-semibold">ALISCRIPT_V2.2</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>TICK_RATE:</span>
                                    <span className="text-foreground font-semibold">20_HZ_DET</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>SYNC_LATENCY:</span>
                                    <span className="text-foreground font-semibold">&lt;50_MS</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-border/40 pt-2 md:pt-1.5 mt-1 md:mt-0.5">
                                    <span>OVERRIDE:</span>
                                    <span className="text-amber-500 font-semibold animate-pulse">STANDBY</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Stay Updated & Override Console ── */}
                    <div className="lg:col-span-3 flex flex-col">
                        <h3 className="text-foreground font-bold mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wider pl-1 md:pl-0">Stay Updated</h3>
                        <div className="flex flex-col gap-6 md:gap-5">
                            <div className="w-full">
                                <NewsletterForm />
                            </div>
                            <div className="flex flex-col gap-3 md:gap-2">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider pl-1 md:pl-0">
                                    System Override (Easter Eggs)
                                </span>
                                <div className="grid grid-cols-3 md:flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => triggerEasterEggDirect("matrix")}
                                        className="flex-1 min-h-[48px] md:min-h-11 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 rounded-[16px] md:rounded-xl border border-border/50 md:border-border bg-card/40 md:bg-card backdrop-blur-xl md:backdrop-blur-none text-[11px] md:text-xs font-semibold hover:border-[hsl(var(--accent-blue))]/40 hover:bg-muted/20 dark:hover:bg-white/3 active:scale-95 transition-all cursor-pointer shadow-sm md:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                        title="Trigger Matrix Rain"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        Matrix
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => triggerEasterEggDirect("party")}
                                        className="flex-1 min-h-[48px] md:min-h-11 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 rounded-[16px] md:rounded-xl border border-border/50 md:border-border bg-card/40 md:bg-card backdrop-blur-xl md:backdrop-blur-none text-[11px] md:text-xs font-semibold hover:border-[hsl(var(--accent-purple))]/40 hover:bg-muted/20 dark:hover:bg-white/3 active:scale-95 transition-all cursor-pointer shadow-sm md:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                        title="Trigger Party Lights"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shrink-0" />
                                        Party
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => triggerEasterEggDirect("nuke")}
                                        className="flex-1 min-h-[48px] md:min-h-11 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 rounded-[16px] md:rounded-xl border border-border/50 md:border-border bg-card/40 md:bg-card backdrop-blur-xl md:backdrop-blur-none text-[11px] md:text-xs font-semibold hover:border-[hsl(var(--accent-emerald))]/40 hover:bg-muted/20 dark:hover:bg-white/3 active:scale-95 transition-all cursor-pointer shadow-sm md:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                        title="Trigger System Nuke"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        Nuke
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
                    <p className="font-medium order-2 md:order-1">
                        © {currentYear} Ali Haggag. All rights reserved.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 font-medium order-1 md:order-2">
                        <LocalTime />
                        <span className="hidden sm:flex items-center gap-1.5">
                            Built with{" "}
                            <span className="text-blue-500 font-semibold">Next.js</span> &{" "}
                            <span className="text-cyan-500 font-semibold">Tailwind</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}