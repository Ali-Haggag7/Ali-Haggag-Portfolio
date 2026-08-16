"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { servicesData, type ServiceCategory } from "./services.data";
import { ServiceCard } from "./ServiceCard";
import { SecurityPostureCard } from "./SecurityPostureCard";
import { DecryptedText } from "@/components/ui/DecryptedText";

type FilterValue = "all" | ServiceCategory;

// Filter definitions — accent is a CSS variable, never a hardcoded hex.
const FILTERS: { value: FilterValue; label: string; accent: string }[] = [
    { value: "all", label: "All", accent: "var(--svc-accent-systems)" },
    { value: "systems", label: "Systems & Compilers", accent: "var(--svc-accent-systems)" },
    { value: "realtime", label: "Real-Time", accent: "var(--svc-accent-realtime)" },
    { value: "security", label: "Security & API", accent: "var(--svc-accent-security)" },
];

// Card enter/exit — opacity + scale only (compositor-friendly, no layout props).
const gridItemTransition = { duration: 0.25, ease: "easeOut" } as const;

export default function Services() {
    const [filter, setFilter] = useState<FilterValue>("all");

    // isMobile is computed once here and passed down as a prop — children never
    // recompute it. SSR-safe: defaults to false on the server to avoid hydration
    // mismatch, then syncs after mount.
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    const visibleServices = useMemo(
        () =>
            filter === "all"
                ? servicesData
                : servicesData.filter((s) => s.category === filter),
        [filter]
    );

    return (
        <section
            id="services"
            className="py-24 relative overflow-hidden bg-transparent scroll-mt-10"
        >
            {/* Decorative glow — extracted to a stable element, no inline style recalc */}
            <div className="services-glow" aria-hidden="true" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center mb-12 max-w-3xl mx-auto animate-fade-in">
                    <p className="section-eyebrow mb-3">
                        <DecryptedText text="Technical Capabilities" speed={30} sequential={true} animateOn="view" />
                    </p>
                    <h2 className="section-title text-4xl md:text-5xl mb-3">
                        What I{" "}
                        <span className="accent-word">Offer</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                        Technical solutions designed to scale. Turning complex ideas into elegant, high-performance applications.
                    </p>
                </div>

                {/* Filter bar */}
                <div
                    role="group"
                    aria-label="Filter services by category"
                    className="mb-12 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 w-full px-2"
                >
                    {FILTERS.map((f) => {
                        const active = filter === f.value;
                        return (
                            <button
                                key={f.value}
                                type="button"
                                onClick={() => setFilter(f.value)}
                                aria-pressed={active}
                                className={cn(
                                    "inline-flex min-h-[44px] shrink-0 items-center rounded-full border px-4 text-sm font-semibold",
                                    "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                                    !active &&
                                        "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30"
                                )}
                                // Active state colored via CSS variable accent only.
                                style={
                                    active
                                        ? {
                                              color: f.accent,
                                              borderColor: f.accent,
                                              backgroundColor:
                                                  "color-mix(in srgb, transparent 86%, currentColor)",
                                          }
                                        : undefined
                                }
                            >
                                {f.label}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* popLayout keeps siblings from jumping while items animate out */}
                    <AnimatePresence mode="popLayout">
                        {visibleServices.map((service, index) => (
                            <motion.div
                                key={service.title}
                                layout="position"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={gridItemTransition}
                                style={{ willChange: "transform, opacity" }}
                            >
                                <ServiceCard
                                    service={service}
                                    index={index}
                                    isMobile={isMobile}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* 5-Layer Security Architecture Posture Card */}
                <SecurityPostureCard />
            </div>
        </section>
    );
}
