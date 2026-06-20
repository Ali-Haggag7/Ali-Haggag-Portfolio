// services/ServiceCard.tsx
"use client";

import { useRef, useCallback, useState, useId } from "react";
import { cn } from "@/lib/utils";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useMotionTemplate,
    Variants,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Service, ServiceCategory } from "./services.data";

// Human-readable label + CSS-variable accent per category. CSS vars only.
const CATEGORY_META: Record<ServiceCategory, { label: string; accent: string }> = {
    systems: { label: "Systems & Compilers", accent: "var(--svc-accent-systems)" },
    realtime: { label: "Real-Time", accent: "var(--svc-accent-realtime)" },
    security: { label: "Security & API", accent: "var(--svc-accent-security)" },
};

// Animation variants defined outside the component —
// same object reference on every render, never triggers re-creation.
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
    }),
};

// Expansion variants — opacity + translateY only (GPU-composited, no layout props).
const expandVariants: Variants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
};

export function ServiceCard({
    service,
    index,
    isMobile,
}: {
    service: Service;
    index: number;
    isMobile: boolean;
}) {
    const divRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [expanded, setExpanded] = useState(false);
    const detailId = useId();

    // Stable ref across renders — no new function allocated on each paint.
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!divRef.current) return;
            const rect = divRef.current.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        },
        // Motion values are stable refs themselves, safe as deps.
        [mouseX, mouseY]
    );

    // Built once per mount. mouseX/mouseY update imperatively,
    // so this template never needs to be recreated.
    const spotlightBg = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(59,130,246,0.12), transparent 40%)`;

    const Icon = service.icon;
    const category = CATEGORY_META[service.category];

    // The implementations detail body is shared between the Framer (desktop)
    // and CSS-transition (mobile) expansion paths.
    const detailBody = (
        <div className="mt-5 border-t border-border/60 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                In production
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {service.implementations}
            </p>
        </div>
    );

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true, margin: "-50px" }}
            className="h-full"
            // GPU-composited layer — keeps hover transforms off the main thread.
            style={{ willChange: "transform" }}
        >
            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                tabIndex={0}
                className={cn(
                    "group relative overflow-hidden h-full rounded-3xl border border-border/50 bg-card p-8 focus:outline-none cursor-default",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-2 focus:-translate-y-2",
                    "hover:shadow-2xl focus:shadow-2xl",
                    "hover:border-blue-500/30 focus:border-blue-500/30",
                    "dark:hover:shadow-blue-900/20 dark:focus:shadow-blue-900/20"
                )}
            >
                {/* Spotlight overlay — driven by motion values, zero re-renders */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus:opacity-100"
                    style={{ background: spotlightBg }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Category badge (top-left) — accent via CSS variable */}
                    <span
                        className="mb-4 inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide"
                        style={{
                            color: category.accent,
                            borderColor: category.accent,
                            backgroundColor: "color-mix(in srgb, transparent 88%, currentColor)",
                        }}
                    >
                        {category.label}
                    </span>

                    <div
                        className={cn(
                            "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl",
                            "bg-muted text-muted-foreground border border-border",
                            "transition-all duration-300 ease-out",
                            "group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-500",
                            "group-hover:text-white group-hover:scale-110",
                            "group-hover:shadow-lg group-hover:shadow-blue-500/40",
                            "group-hover:-rotate-6 group-hover:border-transparent"
                        )}
                    >
                        <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>

                    <h3 className="mb-3 text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-blue-600 group-focus:text-blue-600 dark:group-hover:text-blue-400 dark:group-focus:text-blue-400">
                        {service.title}
                    </h3>

                    <p className="text-muted-foreground text-base leading-relaxed">
                        {service.description}
                    </p>

                    {/* Metric badges row */}
                    {service.metrics.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {service.metrics.map((metric) => (
                                <span
                                    key={metric.label}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs"
                                >
                                    <span className="text-muted-foreground">{metric.label}</span>
                                    <span className="font-mono font-semibold text-foreground">
                                        {metric.value}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Tech stack pills row */}
                    {service.tech.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {service.tech.map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Expand toggle */}
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        aria-expanded={expanded}
                        aria-controls={detailId}
                        className={cn(
                            "mt-5 inline-flex min-h-[44px] w-fit items-center gap-1.5 rounded-lg px-3 text-sm font-semibold",
                            "text-blue-600 dark:text-blue-400",
                            "transition-colors duration-200 hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        )}
                    >
                        {expanded ? "Hide details" : "View implementation"}
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                expanded && "rotate-180"
                            )}
                            aria-hidden="true"
                        />
                    </button>

                    {/* Expansion: Framer Motion on desktop, CSS transition on mobile */}
                    {isMobile ? (
                        <div
                            id={detailId}
                            className="grid transition-[grid-template-rows] duration-300 ease-out"
                            style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                        >
                            <div className="overflow-hidden">{detailBody}</div>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {expanded && (
                                <motion.div
                                    id={detailId}
                                    variants={expandVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    style={{ willChange: "transform, opacity" }}
                                >
                                    {detailBody}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                {/* Scale on compositor thread — transform only, no layout cost */}
                <div className="absolute bottom-0 left-0 h-1.5 w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-cyan-400 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus:scale-x-100 z-20" />
            </div>
        </motion.div>
    );
}
