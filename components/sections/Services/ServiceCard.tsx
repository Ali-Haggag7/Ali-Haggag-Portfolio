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
import { ChevronDown, Terminal } from "lucide-react";
import type { Service, ServiceCategory } from "./services.data";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { DecryptedText } from "@/components/ui/DecryptedText";

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

// Expansion variants — smooth height expansion matching evolution cards
const expandVariants: Variants = {
    hidden: {
        opacity: 0,
        height: 0,
        y: -6,
    },
    visible: {
        opacity: 1,
        height: "auto",
        y: 0,
        transition: {
            height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.25, delay: 0.05 },
            y: { duration: 0.3, ease: "easeOut" },
        },
    },
    exit: {
        opacity: 0,
        height: 0,
        y: -6,
        transition: {
            height: { duration: 0.3, ease: [0.7, 0, 0.84, 0] },
            opacity: { duration: 0.18 },
            y: { duration: 0.2 },
        },
    },
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

    const cachedRectRef = useRef<DOMRect | null>(null);

    const handleMouseEnter = useCallback(() => {
        if (divRef.current) {
            cachedRectRef.current = divRef.current.getBoundingClientRect();
        }
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!cachedRectRef.current && divRef.current) {
                cachedRectRef.current = divRef.current.getBoundingClientRect();
            }
            const rect = cachedRectRef.current;
            if (!rect) return;
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        },
        [mouseX, mouseY]
    );

    // Built once per mount. mouseX/mouseY update imperatively,
    // so this template never needs to be recreated.
    const spotlightBg = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(59,130,246,0.12), transparent 40%)`;

    const Icon = service.icon;
    const category = CATEGORY_META[service.category];

    // Bespoke Technical Architecture Specification Drawer
    const detailBody = (
        <div className="mt-4 pt-4 border-t border-border/60 text-left space-y-2.5">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--accent-blue))]">
                    <Terminal className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Production Architecture</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SHIPPED
                </span>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-border/60 bg-muted/20 dark:bg-black/30 p-3.5 shadow-inner">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(var(--accent-blue))] to-[hsl(var(--accent-purple))]" />
                <p className="text-xs md:text-sm font-medium text-foreground/90 leading-relaxed pl-1">
                    {service.implementations}
                </p>
                <div className="mt-2.5 pt-2 border-t border-border/30 flex items-center justify-between text-[10px] font-mono text-muted-foreground/70">
                    <span>STATUS: ACTIVE // PRODUCTION</span>
                    <span>VERIFIED SPEC</span>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ y: -6 }}
            custom={index}
            viewport={{ once: true, margin: "-50px" }}
            className="h-full"
            style={{ willChange: "transform" }}
        >
            <div
                ref={divRef}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                tabIndex={0}
                className={cn(
                    "group relative overflow-hidden h-full rounded-2xl cyber-card cyber-card-interactive tactical-corner-reticles p-7 focus:outline-none cursor-default",
                    "transition-[border-color,box-shadow] duration-300 ease-out",
                    "hover:border-[hsl(var(--accent-blue)/0.6)] focus:border-[hsl(var(--accent-blue)/0.6)] hover:shadow-xl"
                )}
            >
                {/* React Bits Border Beam Glow */}
                <BorderBeam duration={9 + (index % 3) * 2} borderWidth={1.5} colorFrom="hsl(var(--accent-blue))" colorTo="hsl(var(--accent-purple))" />

                {/* Spotlight overlay — driven by motion values, zero re-renders */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus:opacity-100 rounded-2xl"
                    style={{ background: spotlightBg }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Category badge (top-left) — accent via CSS variable */}
                    <div className="mb-4 flex items-center justify-between">
                        <span
                            className="hud-tag"
                            style={{
                                color: category.accent,
                                borderColor: "color-mix(in srgb, currentColor 30%, transparent)",
                                backgroundColor: "color-mix(in srgb, transparent 88%, currentColor)",
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: category.accent }} />
                            <DecryptedText text={category.label} speed={30} sequential={true} animateOn="view" />
                        </span>
                    </div>

                    <div
                        className={cn(
                            "mb-5 inline-flex h-13 w-13 items-center justify-center rounded-xl",
                            "bg-muted/80 text-foreground border border-border/80 shadow-sm",
                            "transition-all duration-300 ease-out",
                            "group-hover:bg-[hsl(var(--accent-blue))] group-hover:text-white group-hover:scale-105",
                            "group-hover:shadow-md group-hover:shadow-[hsl(var(--accent-blue)/0.3)]",
                            "group-hover:border-transparent"
                        )}
                    >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <h3 className="mb-2 text-2xl font-bold font-display tracking-tight text-foreground transition-colors duration-300 group-hover:text-[hsl(var(--accent-blue))]">
                        {service.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {service.description}
                    </p>

                    {/* Metric badges row */}
                    {service.metrics.length > 0 && (
                        <div className="mt-auto pt-2 flex flex-wrap gap-2">
                            {service.metrics.map((metric) => (
                                <span
                                    key={metric.label}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/30 px-2.5 py-1 text-xs"
                                >
                                    <span className="text-muted-foreground font-display text-[11px] uppercase tracking-wider">{metric.label}:</span>
                                    <span className="font-mono font-semibold text-foreground">
                                        {metric.value}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Tech stack pills row */}
                    {service.tech.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {service.tech.map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-md border border-border/50 bg-background/80 px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
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
                            "mt-5 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-lg px-3 text-xs font-display font-semibold uppercase tracking-wider cursor-pointer",
                            "text-[hsl(var(--accent-blue))]",
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

                    {/* Smooth Height Expansion via Framer Motion */}
                    <AnimatePresence initial={false}>
                        {expanded && (
                            <motion.div
                                id={detailId}
                                variants={expandVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="overflow-hidden"
                                style={{ willChange: "height, opacity, transform" }}
                            >
                                {detailBody}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Accent line on bottom — 100% flush at bottom edge with zero gap */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 origin-left scale-x-0 bg-gradient-to-r from-[hsl(var(--accent-blue))] to-[hsl(var(--accent-purple))] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus:scale-x-100 rounded-b-2xl z-30" />
            </div>
        </motion.div>
    );
}
