"use client";

import { Code2, ExternalLink, RotateCcw } from "lucide-react";
import { memo, useRef, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import MagicButton from "./magic-button";
import { useTerminal } from "./Terminal/useTerminal";

// Dynamically import TerminalWindow to separate heavy command engine from initial bundle
const TerminalWindow = dynamic(
    () => import("./Terminal/TerminalWindow").then((mod) => mod.TerminalWindow),
    {
        ssr: false,
        loading: () => (
            <div className="w-full max-w-3xl mx-auto mb-8 h-[360px] bg-slate-950/40 rounded-xl border border-slate-800/40 flex items-center justify-center font-mono text-gray-500 animate-pulse">
                Initializing Terminal...
            </div>
        ),
    }
);

const SystemOffline = memo(function SystemOffline({
    onReboot,
    isActive
}: {
    onReboot: () => void;
    isActive: boolean;
}) {
    return (
        <section
            aria-label="System Offline State"
            aria-hidden={!isActive}
            className={cn(
                "absolute inset-0 z-20 flex w-full flex-col items-center justify-center text-center px-4",
                "transition-[opacity,transform] duration-500 transform-gpu will-change-[opacity,transform]",
                isActive ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            )}
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
                tabIndex={isActive ? 0 : -1}
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
        return Array.from({ length: 50 }, (_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
        }));
    }, [mounted]);

    // Derived state for cleaner JSX logic
    const showUIElements = !terminal.isClosed && !terminal.isFullScreen;

    return (
        <section
            ref={containerRef}
            aria-label="Hero Section Terminal"
            className="relative flex min-h-[90vh] w-full flex-col items-center justify-center pt-24 pb-12 px-4 overflow-hidden bg-background"
        >
            {/* Animated Mesh Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 opacity-30 dark:opacity-40">
                <div 
                    className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full blur-[120px] mix-blend-screen animate-mesh-spin"
                    style={{
                        background: "radial-gradient(circle, var(--tl-accent-blue) 0%, transparent 70%)",
                        animationDuration: "25s",
                    }}
                />
                <div 
                    className="absolute -bottom-1/4 -right-1/4 w-[80%] h-[80%] rounded-full blur-[120px] mix-blend-screen animate-mesh-spin"
                    style={{
                        background: "radial-gradient(circle, var(--tl-accent-purple) 0%, transparent 70%)",
                        animationDuration: "35s",
                        animationDelay: "-10s",
                        animationDirection: "reverse",
                    }}
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

            {/* SYSTEM ONLINE BADGE */}
            <div className={cn(
                "mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-border/50 bg-card/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm",
                "transition-all duration-500 transform-gpu relative z-20",
                showUIElements ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 transform-gpu" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500 shadow-[0_0_8px_var(--live-dot)]" />
                </span>
                System Online &amp; Ready for Deployment
            </div>

            {/* TERMINAL WINDOW */}
            <TerminalWindow terminal={terminal} />

            {/* ACTION LINKS */}
            <nav
                aria-label="Hero Action Links"
                className={cn(
                    "flex flex-wrap justify-center items-center gap-4 md:gap-5 relative z-20 mt-8",
                    "transition-all duration-700 transform-gpu will-change-[opacity,transform]",
                    terminal.step >= 7 && showUIElements ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                )}
            >
                <a
                    href="https://github.com/Ali-Haggag7"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Ali Haggag's GitHub Profile"
                    className={cn(
                        "group relative flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 min-h-[44px] cursor-pointer",
                        "bg-foreground text-background rounded-full font-bold",
                        "transition-[transform,box-shadow] duration-200 transform-gpu will-change-transform",
                        "hover:scale-105 hover:shadow-[0_0_20px_-5px_hsl(var(--foreground)/0.3)] dark:hover:shadow-[0_0_20px_-5px_hsl(var(--foreground)/0.6)] active:scale-95"
                    )}
                >
                    <Code2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 transform-gpu" aria-hidden="true" />
                    GitHub
                </a>

                <a
                    href="https://www.linkedin.com/in/ali-haggag7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Ali Haggag's LinkedIn Profile"
                    className={cn(
                        "group flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 min-h-[44px] cursor-pointer",
                        "border-2 border-border bg-card/80 text-foreground rounded-full font-bold",
                        "transition-[transform,box-shadow,border-color,color,background-color] duration-200 transform-gpu will-change-transform",
                        "hover:bg-[hsl(var(--accent-blue)/0.05)] hover:border-[hsl(var(--accent-blue)/0.5)] hover:text-[hsl(var(--accent-blue))] active:scale-95 hover:scale-105 hover:shadow-[0_0_20px_hsl(var(--accent-blue)/0.15)] shadow-sm"
                    )}
                >
                    <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 transform-gpu" aria-hidden="true" />
                    LinkedIn
                </a>

                <MagicButton />
            </nav>
        </section>
    );
}