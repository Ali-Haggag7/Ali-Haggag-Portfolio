"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, WifiOff, Network, ChevronDown, Activity, CheckCircle2, Zap, Filter, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const scars = [
    {
        id: "webrtc-latency",
        icon: Swords,
        title: "Real-Time Combat: The WebRTC Signaling Dilemma",
        project: "Flurry v2.0",
        badges: ["Socket.io", "WebRTC", "P2P"],
        problem: "Managing unpredictable connection states and achieving near-zero latency for peer-to-peer audio and video calls without relying on heavy third-party plugins.",
        solution: "Architected a hybrid signaling server using Socket.io to reliably manage the complex handshake states, offloading the heavy media streaming payload directly to WebRTC P2P channels.",
        impact: "Achieved <50ms latency for seamless voice notes, video calls, and instant read receipts across different network conditions."
    },
    {
        id: "offline-sync",
        icon: WifiOff,
        title: "The Offline-First Illusion: Data Sync Strategies",
        project: "Flurry v2.0",
        badges: ["PWA", "Service Workers", "Background Sync"],
        problem: "Users losing data or experiencing app crashes when network connectivity drops, leading to failed message deliveries and poor UX.",
        solution: "Engineered a robust Progressive Web App (PWA) architecture utilizing Workbox Service Workers for aggressive asset caching, coupled with the Background Sync API to queue user actions locally.",
        impact: "Actions performed offline (like sending messages) are instantly reflected in the Optimistic UI, securely queued, and automatically synchronized with MongoDB once connectivity returns."
    },
    {
        id: "ddd-boundaries",
        icon: Network,
        title: "Defending Boundaries: Third-Party API Chaos",
        project: "Cybership Carrier Service",
        badges: ["Domain-Driven Design", "TypeScript", "Zod"],
        problem: "Tight coupling between internal business logic and unpredictable, constantly changing external carrier (UPS) JSON data structures, causing runtime crashes.",
        solution: "Implemented strict Domain-Driven Design (DDD) principles. Created an isolated Anti-Corruption Layer with Zod schemas to enforce strict runtime validation before any external HTTP calls reach the core domain.",
        impact: "Zero runtime crashes due to external API changes. Structured custom Error Classes provide actionable feedback to the client instead of generic 500 errors."
    },
    {
        id: "cascading-filters-race",
        icon: Filter,
        title: "State Synchronization: The Cascading Filter Race Condition",
        project: "CS Arena",
        badges: ["Next.js 16", "URL Sync", "State Management"],
        problem: "Clearing multiple dependent filters (Subdomain and Tech) simultaneously when a parent category (Domain) changes, causing a race condition in the Next.js router and UI freezing.",
        solution: "Implemented careful state management tightly coupled with URL synchronization, leveraging React's useTransition to decouple the UI state updates from the router navigation.",
        impact: "Achieved a fluid, glitch-free filtering experience where the UI remains highly responsive even during complex multi-level query parameter updates."
    },
    {
        id: "enterprise-security",
        icon: ShieldAlert,
        title: "The Vulnerability Matrix: Enterprise-Grade Security",
        project: "Blog Pro CMS",
        badges: ["Security", "JWT", "XSS Prevention"],
        problem: "Securing a full-stack CMS against modern web vulnerabilities like Cross-Site Scripting (XSS), HTTP Parameter Pollution (HPP), and brute-force attacks while maintaining fast API response times.",
        solution: "Engineered a multi-layered security pipeline integrating Helmet for HTTP headers, XSS-Clean for payload sanitization, strict Joi schema validation, and Redis-backed rate limiting.",
        impact: "Blocked 100% of malicious data payloads and mitigated brute-force attempts without degrading the API performance or user experience."
    }
];

export default function BattleScars() {
    const [expandedId, setExpandedId] = useState<string | null>(scars[0].id);

    const toggleScar = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <section id="battle-scars" aria-labelledby="battle-scars-title" className="py-24 px-4 md:px-8 w-full max-w-5xl mx-auto">

            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center justify-center gap-2 mb-4 transform-gpu"
                >
                    <span className="h-px w-8 bg-red-500/50 block" aria-hidden="true"></span>
                    <span className="text-red-600 dark:text-red-500 font-mono text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4" aria-hidden="true" /> Engineering Logs
                    </span>
                    <span className="h-px w-8 bg-red-500/50 block" aria-hidden="true"></span>
                </motion.div>

                <motion.h2
                    id="battle-scars-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4 transform-gpu"
                >
                    Battle Scars
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-lg max-w-2xl mx-auto transform-gpu"
                >
                    Real engineering isn't just writing code. It's about the architectural decisions made when systems fail, latency spikes, and requirements evolve.
                </motion.p>
            </div>

            <div className="space-y-4">
                {scars.map((scar, index) => {
                    const isExpanded = expandedId === scar.id;
                    const Icon = scar.icon;

                    return (
                        <motion.div
                            key={scar.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300 overflow-hidden transform-gpu",
                                isExpanded
                                    ? "bg-card border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]"
                                    : "bg-background border-border hover:border-muted-foreground/30 hover:bg-muted/10"
                            )}
                        >
                            <button
                                type="button"
                                onClick={() => toggleScar(scar.id)}
                                aria-expanded={isExpanded}
                                aria-controls={`content-${scar.id}`}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                            >
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className={cn(
                                        "flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300 shrink-0",
                                        isExpanded ? "bg-blue-500/10 text-blue-600 dark:text-blue-500" : "bg-muted text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        <Icon className="w-6 h-6" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-mono text-muted-foreground mb-1">{scar.project}</p>
                                        <h3 className="text-lg md:text-xl font-bold text-foreground">
                                            {scar.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 shrink-0 bg-muted/50 transform-gpu will-change-transform",
                                    isExpanded ? "rotate-180 bg-blue-500/10 text-blue-600 dark:text-blue-500" : "text-muted-foreground"
                                )}>
                                    <ChevronDown className="w-5 h-5" aria-hidden="true" />
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        id={`content-${scar.id}`}
                                        role="region"
                                        aria-labelledby={`heading-${scar.id}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        style={{ willChange: "height, opacity" }}
                                        className="transform-gpu"
                                    >
                                        <div className="px-6 pb-6 pt-2">
                                            <div className="flex flex-wrap gap-2 mb-6 ml-0 md:ml-18">
                                                {scar.badges.map(badge => (
                                                    <span key={badge} className="px-3 py-1 text-xs font-mono font-medium bg-muted text-muted-foreground rounded-full border border-border/50">
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 ml-0 md:ml-18">

                                                <div className="space-y-3">
                                                    <h4 className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-500 uppercase tracking-wider">
                                                        <Activity className="w-4 h-4" aria-hidden="true" /> The Bleed
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {scar.problem}
                                                    </p>
                                                </div>

                                                <div className="space-y-3">
                                                    <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">
                                                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> The Cure
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {scar.solution}
                                                    </p>
                                                </div>

                                                <div className="space-y-3">
                                                    <h4 className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider">
                                                        <Zap className="w-4 h-4" aria-hidden="true" /> The Impact
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {scar.impact}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}