"use client";

import {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
    memo,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
    capabilityData,
    securityLayers,
    type CapabilityDomain,
    type SecurityLayer,
} from "./services.data";
import {
    Layers,
    Zap,
    Bot,
    ShieldCheck,
    Smartphone,
    Palette,
    ExternalLink,
    ArrowRight,
    CheckCircle2,
    Lock,
    Terminal,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════
   ICON MAPPER
   ═══════════════════════════════════════════════════════════════════════ */

const ICON_MAP = {
    Layers,
    Zap,
    Bot,
    ShieldCheck,
    Smartphone,
    Palette,
};

const TOTAL = capabilityData.length;

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════════════ */

const panelVariants: Variants = {
    initial: {
        opacity: 0,
        y: 16,
        filter: "blur(4px)",
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
        opacity: 0,
        y: -12,
        filter: "blur(2px)",
        transition: { duration: 0.2, ease: [0.55, 0.06, 0.68, 0.19] },
    },
};

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ═══════════════════════════════════════════════════════════════════════
   ARCHITECTURE PIPELINE BLUEPRINT
   ═══════════════════════════════════════════════════════════════════════ */

const ArchitecturePipeline = memo(function ArchitecturePipeline({
    pipeline,
}: {
    pipeline: CapabilityDomain["pipeline"];
}) {
    return (
        <div className="w-full bg-card/60 dark:bg-card/40 border border-border/50 rounded-xl p-4 sm:p-5 my-6 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-[hsl(var(--accent-emerald))] animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground/80">
                        Architecture Data Pipeline
                    </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/60 border border-border/40 px-2 py-0.5 rounded">
                    End-to-End Topology
                </span>
            </div>

            {/* Horizontal flow */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
                {pipeline.map((node, i) => (
                    <div
                        key={node.label}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center flex-1 min-w-[140px] gap-2"
                    >
                        <div className="flex-1 bg-background/80 dark:bg-background/40 border border-border/60 hover:border-[hsl(var(--accent-blue)/0.5)] transition-colors rounded-lg p-2.5 flex flex-col justify-center">
                            <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-mono font-bold text-muted-foreground/50">
                                    0{i + 1}
                                </span>
                                <span className="text-[9px] font-mono text-[hsl(var(--accent-blue))] font-semibold">
                                    NODE
                                </span>
                            </div>
                            <span className="text-xs font-display font-bold text-foreground truncate">
                                {node.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium truncate mt-0.5">
                                {node.role}
                            </span>
                        </div>

                        {i < pipeline.length - 1 && (
                            <div className="hidden sm:flex items-center justify-center shrink-0 text-muted-foreground/40 px-1">
                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

/* ═══════════════════════════════════════════════════════════════════════
   SECURITY POSTURE DECK (5 LAYERS)
   ═══════════════════════════════════════════════════════════════════════ */

const SecurityDeck = memo(function SecurityDeck() {
    const [selectedLayer, setSelectedLayer] = useState<number>(1);

    return (
        <div className="w-full mt-14 pt-10 border-t border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--accent-emerald)/0.4)] bg-[hsl(var(--accent-emerald)/0.1)] text-[hsl(var(--accent-emerald))]">
                        <Lock className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm sm:text-base font-display font-bold text-foreground">
                            Defence-in-Depth Security Posture
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Multi-layered hardening implemented across all production endpoints
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[hsl(var(--accent-emerald))] font-semibold px-2.5 py-1 rounded-full border border-[hsl(var(--accent-emerald)/0.3)] bg-[hsl(var(--accent-emerald)/0.08)]">
                        5 Active Layers
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {securityLayers.map((layer) => {
                    const isSelected = selectedLayer === layer.layer;
                    return (
                        <button
                            key={layer.layer}
                            type="button"
                            onClick={() => setSelectedLayer(layer.layer)}
                            aria-pressed={isSelected}
                            className={cn(
                                "flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 min-h-[44px]",
                                isSelected
                                    ? "border-[hsl(var(--accent-emerald)/0.6)] bg-card shadow-sm dark:bg-card/70"
                                    : "border-border/50 bg-card/30 hover:border-border/80 hover:bg-card/50"
                            )}
                        >
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-mono font-bold text-[hsl(var(--accent-emerald))]">
                                    L0{layer.layer}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground/60 truncate">
                                    {layer.projects}
                                </span>
                            </div>
                            <span className="text-xs font-display font-bold text-foreground mb-1 leading-snug">
                                {layer.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                {layer.description}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

/* ═══════════════════════════════════════════════════════════════════════
   MAIN SERVICES COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function Services() {
    const [activeId, setActiveId] = useState(capabilityData[0].id);
    const sectionRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);

    const activeCap = useMemo(
        () => capabilityData.find((c) => c.id === activeId) || capabilityData[0],
        [activeId],
    );

    const relatedCaps = useMemo(
        () => capabilityData.filter((c) => activeCap.relatedIds.includes(c.id)),
        [activeCap.relatedIds],
    );

    const handleSelect = useCallback((id: string) => {
        setActiveId(id);
    }, []);

    /* ── Keyboard navigation ── */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;

            const currentIdx = capabilityData.findIndex((c) => c.id === activeId);

            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                const next = (currentIdx + 1) % TOTAL;
                setActiveId(capabilityData[next].id);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                const prev = (currentIdx - 1 + TOTAL) % TOTAL;
                setActiveId(capabilityData[prev].id);
            } else if (e.key === "Escape") {
                e.preventDefault();
                setActiveId(capabilityData[0].id);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [activeId]);

    /* ── Touch swipe navigation for mobile ── */
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const onTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (touchStartX.current === null) return;
            const diff = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(diff) > 50) {
                const currentIdx = capabilityData.findIndex((c) => c.id === activeId);
                if (diff < 0) {
                    setActiveId(capabilityData[(currentIdx + 1) % TOTAL].id);
                } else {
                    setActiveId(capabilityData[(currentIdx - 1 + TOTAL) % TOTAL].id);
                }
            }
            touchStartX.current = null;
        },
        [activeId],
    );

    const ActiveIcon = ICON_MAP[activeCap.iconName] || Layers;
    const reduced = prefersReducedMotion();

    return (
        <section
            ref={sectionRef}
            id="services"
            className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 relative select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <p className="section-eyebrow mb-3">Engineering Capabilities</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-foreground">
                    What I{" "}
                    <span className="text-muted-foreground/60">Offer</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Technical systems designed to scale. Real-time protocols, robust API gateways, and production-grade architectures.
                </p>
            </div>

            {/* Capability Selector Bar (Modular Navigation) */}
            <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8"
                role="tablist"
                aria-label="Engineering capability domains"
            >
                {capabilityData.map((cap) => {
                    const isActive = cap.id === activeId;
                    const isRelated = activeCap.relatedIds.includes(cap.id);
                    const NodeIcon = ICON_MAP[cap.iconName] || Layers;

                    return (
                        <button
                            key={cap.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => handleSelect(cap.id)}
                            className={cn(
                                "group relative flex flex-col items-start p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 min-h-[52px]",
                                isActive
                                    ? "border-[hsl(var(--accent-blue)/0.8)] bg-card shadow-md dark:bg-card/70"
                                    : isRelated
                                    ? "border-border/80 bg-card/40 hover:bg-card/60"
                                    : "border-border/40 bg-card/20 hover:border-border/70 hover:bg-card/40"
                            )}
                        >
                            <div className="flex items-center justify-between w-full mb-1.5">
                                <span className={cn(
                                    "text-[10px] font-mono font-bold",
                                    isActive
                                        ? "text-[hsl(var(--accent-blue))]"
                                        : "text-muted-foreground/50 group-hover:text-muted-foreground/80"
                                )}>
                                    0{cap.index + 1}
                                </span>
                                <NodeIcon className={cn(
                                    "w-4 h-4 transition-colors",
                                    isActive
                                        ? "text-[hsl(var(--accent-blue))]"
                                        : "text-muted-foreground/40 group-hover:text-muted-foreground/70"
                                )} />
                            </div>

                            <span className={cn(
                                "text-xs font-display font-bold leading-tight",
                                isActive ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground"
                            )}>
                                {cap.shortTitle}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="cap-active-border"
                                    className="absolute inset-0 rounded-xl border-2 border-[hsl(var(--accent-blue))] pointer-events-none"
                                    transition={{ duration: 0.25 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Active Capability Workbench Container */}
            <div className="w-full bg-card/40 dark:bg-card/30 border border-border/50 rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-xl relative overflow-hidden">
                {/* Background ambient glow */}
                <div
                    className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-20 blur-3xl"
                    style={{ background: "radial-gradient(circle, hsl(var(--accent-blue)), transparent 70%)" }}
                    aria-hidden="true"
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCap.id}
                        variants={reduced ? undefined : panelVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full relative z-10"
                    >
                        {/* Domain Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
                            <div className="flex items-center gap-3.5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[hsl(var(--accent-blue)/0.4)] bg-[hsl(var(--accent-blue)/0.1)] text-[hsl(var(--accent-blue))]">
                                    <ActiveIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-bold text-[hsl(var(--accent-blue))]">
                                            0{activeCap.index + 1}
                                        </span>
                                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60 border border-border/40 px-2 py-0.5 rounded">
                                            {activeCap.domain}
                                        </span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mt-0.5">
                                        {activeCap.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/40 border border-border/40 px-3 py-1.5 rounded-lg">
                                    <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent-emerald))] animate-pulse" />
                                    PRODUCTION READY
                                </span>
                            </div>
                        </div>

                        {/* Tagline */}
                        <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed font-medium">
                            {activeCap.description}
                        </p>

                        {/* Architectural Data Pipeline Flow Diagram */}
                        <ArchitecturePipeline pipeline={activeCap.pipeline} />

                        {/* Two-Column Deep Dive */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
                            {/* Left Column (7 cols): What I Build + Implementation Evidence */}
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                {/* What I Build & Deliver */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--accent-blue))]" />
                                        What I Build & Deliver
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {activeCap.builds.map((build) => (
                                            <div
                                                key={build}
                                                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-background/60 dark:bg-background/30 border border-border/40 text-xs text-foreground/90 font-medium"
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-blue))]" />
                                                <span className="truncate">{build}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Implementation Evidence */}
                                <div className="space-y-2.5 bg-background/70 dark:bg-background/40 border border-border/50 rounded-xl p-4 sm:p-5">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
                                            <Terminal className="w-4 h-4 text-[hsl(var(--accent-purple))]" />
                                            <span>Production Implementation Evidence</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-muted-foreground/60">
                                            VERIFIED
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {activeCap.implementation}
                                    </p>
                                </div>

                                {/* Shipped In Projects */}
                                {activeCap.projects.length > 0 && (
                                    <div className="space-y-2">
                                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60">
                                            Shipped In Production:
                                        </span>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {activeCap.projects.map((p) => (
                                                <a
                                                    key={p.name}
                                                    href={p.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-foreground bg-muted/40 hover:bg-muted/70 border border-border/60 hover:border-border transition-colors px-3 py-2 rounded-lg min-h-[44px]"
                                                >
                                                    <span>{p.name}</span>
                                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column (5 cols): Tech Stack + Metrics + Connected Domains */}
                            <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-6 lg:border-l lg:border-border/40">
                                {/* Key Verifiable Metrics */}
                                {activeCap.metrics.length > 0 && (
                                    <div className="space-y-2.5">
                                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60">
                                            Verifiable Metrics
                                        </span>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                                            {activeCap.metrics.map((m) => (
                                                <div
                                                    key={m.label}
                                                    className="flex flex-col p-3 rounded-xl bg-card border border-border/50 dark:bg-card/50"
                                                >
                                                    <span className="text-sm font-display font-bold text-foreground">
                                                        {m.value}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                                        {m.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Technology Stack, Grouped */}
                                <div className="space-y-3">
                                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60">
                                        Technology Stack
                                    </span>
                                    <div className="space-y-2.5">
                                        {activeCap.stack.map((group) => (
                                            <div key={group.group} className="space-y-1">
                                                <span className="text-[10px] font-mono font-semibold uppercase text-muted-foreground/50">
                                                    {group.group}
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {group.items.map((item) => (
                                                        <span
                                                            key={item}
                                                            className="text-xs font-mono px-2 py-1 rounded bg-muted/40 border border-border/50 text-foreground/80 font-medium"
                                                        >
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Connected Capabilities Navigation */}
                                <div className="space-y-2 pt-2 border-t border-border/30">
                                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60">
                                        Connected Domains
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {relatedCaps.map((rc) => (
                                            <button
                                                key={rc.id}
                                                type="button"
                                                onClick={() => handleSelect(rc.id)}
                                                className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-muted-foreground hover:text-foreground bg-card/40 hover:bg-card/80 border border-border/50 px-2.5 py-1.5 rounded-lg transition-colors min-h-[44px]"
                                            >
                                                <span className="text-[10px] font-mono text-[hsl(var(--accent-blue))]">
                                                    0{rc.index + 1}
                                                </span>
                                                <span>{rc.shortTitle}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Defence-in-Depth Security Matrix */}
                <SecurityDeck />
            </div>

            {/* Keyboard hints */}
            <div className="hidden sm:flex items-center justify-center gap-2 mt-6 text-[11px] font-mono text-muted-foreground/40">
                <span className="px-1.5 py-0.5 rounded border border-border/40">←</span>
                <span className="px-1.5 py-0.5 rounded border border-border/40">→</span>
                <span>Use keyboard arrows or touch swipe to cycle capability domains</span>
            </div>
        </section>
    );
}
