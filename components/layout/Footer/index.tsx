"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { footerLinks, socialLinks, handleSmoothScroll } from "./footer.data";
import { LocalTime } from "./LocalTime";
import { NewsletterForm } from "./NewsletterForm";

export default function Footer() {
    return (
        <footer className="w-full relative bg-background pt-20 pb-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* PERF: Replaced heavy blur with a clean radial gradient */}
            <div
                className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none -z-10"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)' }}
                aria-hidden="true"
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    <div className="lg:col-span-5">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-3xl font-extrabold text-foreground mb-4 tracking-tighter"
                        >
                            Ali <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Haggag</span>
                        </motion.h2>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-8">
                            Full-Stack Developer crafting scalable web experiences.
                            Turning complex problems into elegant, high-performance solutions.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className={cn(
                                        "group p-3 rounded-full bg-card border border-border text-muted-foreground transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                        social.hoverClass
                                    )}
                                >
                                    <social.icon className="w-5 h-5 transition-colors" aria-hidden="true" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-foreground font-bold mb-6 text-lg">Explore</h3>
                        <ul className="space-y-4 text-muted-foreground text-sm font-medium">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleSmoothScroll(e, link.href)}
                                        className="group flex items-center gap-2 hover:text-blue-500 transition-colors w-fit cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
                                    >
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-focus:opacity-100 group-focus:translate-x-0 text-blue-500" aria-hidden="true" />
                                        <span className="transition-transform duration-300 group-hover:translate-x-1 group-focus:translate-x-1">{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        <h3 className="text-foreground font-bold mb-6 text-lg">Stay Updated</h3>
                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                            Subscribe to get the latest updates on my projects, freelance journey, and tech articles.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
                    <p className="font-medium order-2 md:order-1">© {new Date().getFullYear()} Ali Haggag. All rights reserved.</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 font-medium order-1 md:order-2">
                        <LocalTime />
                        <span className="hidden sm:flex items-center gap-1.5">
                            Built with <span className="text-blue-500 font-semibold">Next.js</span> & <span className="text-cyan-500 font-semibold">Tailwind</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}