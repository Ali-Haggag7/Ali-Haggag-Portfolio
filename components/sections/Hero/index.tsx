"use client";

import { RotateCcw } from "lucide-react";
import { memo, useRef, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useTerminal } from "./Terminal/useTerminal";
import { CurrentlyBuildingTicker } from "./CurrentlyBuildingTicker";
import { EasterEggController } from "./EasterEggController";
import { HeroOrbitalBeacons } from "./HeroOrbitalBeacons";

import { useTheme } from "next-themes";

// Dark Mode: Deep Molten Violet & Electric Orchid (Signature Cyberpunk)
const DARK_FLUID_COLORS = ['#5227FF', '#FF9FFC', '#B497CF'];

// Light Mode: Luminous Cyan, Royal Azure & Soft Violet (Clean, airy, crystal-clear)
const LIGHT_FLUID_COLORS = ['#06B6D4', '#3B82F6', '#8B5CF6'];

// Dynamically import LiquidEther WebGL background from React Bits
const LiquidEther = dynamic(() => import("@/components/ui/LiquidEther"), {
    ssr: false,
});

import { TerminalWindow } from "./Terminal/TerminalWindow";

const SystemOffline = memo(function SystemOffline({
    onReboot,
    isActive
}: {
    onReboot: () => void;
    isActive: boolean;
}) {
    if (!isActive) return null;

    return (
        <section
            aria-label="System Offline State"
            className="absolute inset-0 z-20 flex w-full flex-col items-center justify-center text-center px-4 transition-[opacity,transform] duration-500 transform-gpu will-change-[opacity,transform] opacity-100 scale-100 pointer-events-auto"
        >
            <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none -z-10 transform-gpu"
                style={{ background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)" }}
            />
            <h2 className="text-3xl md:text-5xl font-bold text-red-700 dark:text-red-500 mb-6 font-mono">
                SYSTEM OFFLINE
            </h2>
            <button
                type="button"
                onClick={onReboot}
                aria-label="Reboot System"
                className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-[background-color,transform] duration-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)] will-change-transform transform-gpu cursor-pointer"
            >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                Reboot System
            </button>
        </section>
    );
});

export default function HeroSection() {
    const terminal = useTerminal();
    const containerRef = useRef<HTMLDivElement>(null);
    const hasBootedRef = useRef(false);

    // One-shot IntersectionObserver to trigger the boot sequence when hero enters viewport
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasBootedRef.current) {
                    hasBootedRef.current = true;
                    terminal.startBootSequence();
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [terminal]);

    // Client-side generated twinkling stars to avoid hydration mismatches
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const stars = useMemo(() => {
        if (!mounted) return [];
        const isMobile = window.innerWidth <= 768;
        // Fewer stars on mobile = less DOM + fewer CSS animations running simultaneously
        const count = isMobile ? 10 : 40;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
        }));
    }, [mounted]);

    // Derived state for cleaner JSX logic
    const { resolvedTheme } = useTheme();
    const isDark = !mounted || resolvedTheme === "dark";
    const fluidColors = isDark ? DARK_FLUID_COLORS : LIGHT_FLUID_COLORS;
    const showUIElements = !terminal.isClosed && !terminal.isFullScreen;
    // Lower fluid resolution on mobile — halves GPU fill rate at the cost of imperceptible sharpness
    const isMobile = mounted && window.innerWidth <= 768;

    return (
        <section
            id="hero"
            ref={containerRef}
            aria-label="Hero Section Terminal"
            className="relative flex min-h-[90vh] w-full flex-col items-center justify-center pt-24 pb-12 px-4 bg-transparent"
        >
            {/* React Bits Liquid Ether Fluid Background — theme adaptive & seamless section bleeding */}
            {/* transform-gpu+will-change promotes the canvas to its own GPU compositor layer */}
            <div
                className={cn(
                    "absolute top-0 left-0 right-0 -bottom-64 md:-bottom-96 -z-10 pointer-events-none transform-gpu transition-opacity duration-500",
                    isDark ? "opacity-100" : "opacity-60"
                )}
                style={{
                    willChange: 'transform',
                    maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                }}
            >
                <LiquidEther
                    interactiveElementId="hero"
                    colors={fluidColors}
                    mouseForce={isMobile ? 24 : 36}
                    cursorSize={isMobile ? 85 : 110}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={isMobile ? 6 : 10}
                    iterationsPoisson={isMobile ? 8 : 14}
                    resolution={isMobile ? 0.25 : 0.35}
                    BFECC={false}
                    isBounce={false}
                    autoDemo
                    autoSpeed={0.45}
                    autoIntensity={2.0}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>

            {/* Twinkling Constellation Stars */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-blue-400/40 animate-twinkle pointer-events-none -z-10"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}

            <SystemOffline onReboot={terminal.startBootSequence} isActive={terminal.isClosed} />

            {/* THE AMBIENT GLOW */}
            <div
                aria-hidden="true"
                className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] pointer-events-none -z-10",
                    "transition-opacity duration-700 transform-gpu",
                    showUIElements ? "opacity-100" : "opacity-0"
                )}
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 50%, transparent 70%)" }}
            />

            {/* EASTER EGG CONTROLLER */}
            <EasterEggController />

            {/* CURRENTLY BUILDING TICKER */}
            <CurrentlyBuildingTicker />

            {/* SYSTEM ONLINE BADGE (Desktop-only to keep mobile top header spacious & uncluttered) */}
            <div className={cn(
                "hidden sm:inline-flex items-center justify-center gap-2 mb-6 rounded-full border border-slate-300/80 dark:border-border/50 bg-slate-100/90 dark:bg-card/80 px-4 py-2 text-sm font-bold text-slate-800 dark:text-foreground shadow-sm",
                "transition-all duration-500 transform-gpu relative z-20",
                showUIElements ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 transform-gpu" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500 shadow-[0_0_8px_var(--live-dot)]" />
                </span>
                System Online &amp; Ready for Deployment
            </div>

            {/* TERMINAL & CYBERNETIC ORBITAL BEACONS */}
            <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
                <TerminalWindow terminal={terminal} />
                <HeroOrbitalBeacons isVisible={terminal.step >= 7 && showUIElements} />
            </div>
        </section>
    );
}