"use client";

import { memo, useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Official GitHub SVG from public/skills/github.svg (Adapts dynamically: deep black in Light Mode, crisp white in Dark Mode)
function GitHubSkillIcon({ className }: { className?: string }) {
    return (
        <div
            className={cn("w-5 h-5 bg-foreground transition-colors duration-300", className)}
            style={{
                maskImage: "url(/skills/github.svg)",
                WebkitMaskImage: "url(/skills/github.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
            }}
            aria-hidden="true"
        />
    );
}

// Official LinkedIn SVG from public/skills/linkedin.svg in original brand colors (#0A66C2)
function LinkedInSkillIcon({ className }: { className?: string }) {
    return (
        <img
            src="/skills/linkedin.svg"
            alt=""
            aria-hidden="true"
            className={cn("w-5 h-5 object-contain select-none", className)}
            loading="lazy"
            decoding="async"
        />
    );
}

// Official Resume / CV SVG from public/skills/resume.svg in signature holographic purple
function ResumeSkillIcon({ className }: { className?: string }) {
    return (
        <div
            className={cn("w-5 h-5 bg-purple-600 dark:bg-purple-400 group-hover:bg-purple-500 transition-colors duration-300", className)}
            style={{
                maskImage: "url(/skills/resume.svg)",
                WebkitMaskImage: "url(/skills/resume.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
            }}
            aria-hidden="true"
        />
    );
}

interface HeroOrbitalBeaconsProps {
    isVisible: boolean;
}

export const HeroDesktopOrbitalBeacons = memo(function HeroDesktopOrbitalBeacons({
    isVisible,
}: HeroOrbitalBeaconsProps) {
    return (
        /* =========================================================================
            DESKTOP ORBITAL BEACONS (Flanking the Terminal in Open 3D Space)
            lg: and above — zero occlusion by bottom floating dock, floating cosmos feel
            The outer wrapper MUST STAY pointer-events-none so it doesn't block clicks on the Terminal!
           ========================================================================= */
        <div
            aria-label="Orbital Action Beacons"
            className={cn(
                "hidden lg:block absolute inset-0 pointer-events-none z-20 transition-all duration-1000 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
        >
            {/* 🛰️ BEACON 01: GITHUB RELAY (Left Flank) */}
            <div
                className={cn(
                    "absolute -left-12 xl:-left-24 top-[24%] -translate-y-1/2 animate-[orbitalFloat1_6s_ease-in-out_infinite]",
                    isVisible ? "pointer-events-auto" : "pointer-events-none"
                )}
                style={{ willChange: "transform" }}
            >
                <a
                    href="https://github.com/Ali-Haggag7"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Ali Haggag's GitHub Profile — 40+ Repositories"
                    className={cn(
                        "group relative flex items-center gap-3.5 p-3 pr-4.5 rounded-2xl cursor-pointer select-none",
                        "bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-emerald-500/30 dark:border-emerald-500/40 text-foreground",
                        "shadow-[0_8px_30px_rgba(0,0,0,0.08),0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_18px_rgba(16,185,129,0.15)]",
                        "transition-all duration-300 ease-out",
                        "hover:border-emerald-500 hover:shadow-[0_8px_30px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_30px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    )}
                >
                    {/* Ambient Emerald Halo Glow */}
                    <div
                        aria-hidden="true"
                        className="absolute -inset-1 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/25 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    />

                    {/* Icon Node with Live Ping Radar */}
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-emerald-500/15 border border-slate-200 dark:border-emerald-500/40 group-hover:scale-110 transition-all duration-300 shadow-sm dark:shadow-[inset_0_0_12px_rgba(16,185,129,0.2)]">
                        <GitHubSkillIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                        {/* Live Radar Ping Wave */}
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        </span>
                    </div>

                    {/* Telemetry Data Stack */}
                    <div className="flex flex-col text-left">
                        <span className="font-mono text-[9px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                            NODE // GITHUB
                        </span>
                        <span className="text-xs font-bold font-display text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                            40+ Repos
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                                &rarr;
                            </span>
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground">
                            @Ali-Haggag7
                        </span>
                    </div>
                </a>
            </div>

            {/* 🛰️ BEACON 02: LINKEDIN UPLINK (Right Flank — Top) */}
            <div
                className={cn(
                    "absolute -right-12 xl:-right-24 top-[35%] -translate-y-1/2 animate-[orbitalFloat2_7s_ease-in-out_infinite]",
                    isVisible ? "pointer-events-auto" : "pointer-events-none"
                )}
                style={{ willChange: "transform" }}
            >
                <a
                    href="https://www.linkedin.com/in/ali-haggag7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with Ali Haggag on LinkedIn"
                    className={cn(
                        "group relative flex items-center gap-3.5 p-3 pr-4.5 rounded-2xl cursor-pointer select-none",
                        "bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-blue-500/30 dark:border-blue-500/40 text-foreground",
                        "shadow-[0_8px_30px_rgba(0,0,0,0.08),0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_18px_rgba(59,130,246,0.15)]",
                        "transition-all duration-300 ease-out",
                        "hover:border-blue-500 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_30px_rgba(59,130,246,0.35)] hover:scale-105 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    )}
                >
                    {/* Ambient Blue Halo Glow */}
                    <div
                        aria-hidden="true"
                        className="absolute -inset-1 rounded-2xl bg-blue-500/15 dark:bg-blue-500/25 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    />

                    {/* Icon Node with Live Ping Radar */}
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-100 dark:border-blue-500/40 group-hover:scale-110 transition-all duration-300 shadow-sm dark:shadow-[inset_0_0_12px_rgba(59,130,246,0.2)]">
                        <LinkedInSkillIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                        </span>
                    </div>

                    {/* Telemetry Data Stack */}
                    <div className="flex flex-col text-left">
                        <span className="font-mono text-[9px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                            LINK // NETWORK
                        </span>
                        <span className="text-xs font-bold font-display text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors flex items-center gap-1">
                            LinkedIn
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                                &rarr;
                            </span>
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground">
                            in/ali-haggag7
                        </span>
                    </div>
                </a>
            </div>

            {/* 🛰️ BEACON 03: LIVE RESUME / CV BEACON (Right Flank — Bottom) */}
            <div
                className={cn(
                    "absolute -right-14 xl:-right-28 top-[78%] -translate-y-1/2 animate-[orbitalFloat3_8s_ease-in-out_infinite]",
                    isVisible ? "pointer-events-auto" : "pointer-events-none"
                )}
                style={{ willChange: "transform" }}
            >
                <a
                    href="/Ali_Haggag_CV.pdf"
                    download="Ali_Haggag_FullStack_CV.pdf"
                    aria-label="Download Ali Haggag's Curriculum Vitae (PDF)"
                    className={cn(
                        "group relative flex p-0.5 overflow-hidden rounded-2xl cursor-pointer select-none",
                        "shadow-[0_8px_30px_rgba(0,0,0,0.1),0_0_20px_rgba(168,85,247,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_25px_rgba(168,85,247,0.2)]",
                        "transition-all duration-300 ease-out",
                        "hover:shadow-[0_8px_35px_rgba(168,85,247,0.35)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_35px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    )}
                >
                    {/* Animated Holographic Conic Border */}
                    <span
                        aria-hidden="true"
                        className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--accent-blue))_0%,hsl(var(--accent-purple))_50%,hsl(var(--accent-blue))_100%)] opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />

                    {/* Inner High-Tech Card */}
                    <div className="relative z-10 flex items-center gap-3.5 p-3 pr-4.5 rounded-2xl bg-card/95 dark:bg-card/90 backdrop-blur-xl border border-purple-500/30 dark:border-purple-500/40">
                        {/* Icon Node with Live Ping Radar */}
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/20 border border-purple-100 dark:border-purple-500/40 group-hover:scale-110 transition-all duration-300 shadow-sm dark:shadow-[inset_0_0_12px_rgba(168,85,247,0.25)]">
                            <ResumeSkillIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                            </span>
                        </div>

                        {/* Telemetry Data Stack */}
                        <div className="flex flex-col text-left">
                            <span className="font-mono text-[9px] font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                                SPEC // 2026 CV
                            </span>
                            <span className="text-xs font-bold font-display text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors flex items-center gap-1">
                                Download CV
                                <span className="text-[10px] text-purple-600 dark:text-purple-400 opacity-70 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all">
                                    &darr;
                                </span>
                            </span>
                            <span className="text-[9px] font-mono text-muted-foreground">
                                PDF · Full-Stack
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
});

interface SpringState {
    offset: number;
    velocity: number;
    target: number;
}

// =========================================================================
// MOBILE & TABLET ELASTIC LANYARD CONSTELLATION (< lg screens)
// Real-time Spring Physics & Dynamic Quadratic Bézier Rubber-Band Ropes
// =========================================================================
export const HeroMobileActionCluster = memo(function HeroMobileActionCluster({
    isVisible,
}: HeroOrbitalBeaconsProps) {
    const [offsets, setOffsets] = useState({ ab: 0, ac: 0, bc: 0 });

    const springsRef = useRef<{
        ab: SpringState;
        ac: SpringState;
        bc: SpringState;
    }>({
        ab: { offset: 0, velocity: 0, target: 0 },
        ac: { offset: 0, velocity: 0, target: 0 },
        bc: { offset: 0, velocity: 0, target: 0 },
    });

    const animFrameRef = useRef<number | null>(null);
    const isLoopRunningRef = useRef(false);

    const activeDragRef = useRef<{
        rope: "ab" | "ac" | "bc";
        startX: number;
        startY: number;
        hasMoved: boolean;
    } | null>(null);

    // Spring physics step loop (rubber band elastic mechanics like React Bits Lanyard)
    const runSpringLoop = useCallback(() => {
        if (isLoopRunningRef.current) return;
        isLoopRunningRef.current = true;

        const update = () => {
            const springs = springsRef.current;
            const k = 0.042; // Elastic spring stiffness (smooth, responsive, organic)
            const d = 0.935; // Spring damping factor (smooth rubbery harmonic decay)

            let isMoving = false;

            (["ab", "ac", "bc"] as const).forEach((key) => {
                // If this rope is actively being dragged by the user, skip physics calculation for it
                if (activeDragRef.current && activeDragRef.current.rope === key) {
                    return;
                }

                const s = springs[key];
                const force = -k * (s.offset - s.target);
                s.velocity = (s.velocity + force) * d;
                s.offset += s.velocity;

                if (Math.abs(s.velocity) > 0.02 || Math.abs(s.offset - s.target) > 0.02) {
                    isMoving = true;
                } else {
                    s.offset = s.target;
                    s.velocity = 0;
                }
            });

            setOffsets({
                ab: springs.ab.offset,
                ac: springs.ac.offset,
                bc: springs.bc.offset,
            });

            if (isMoving || activeDragRef.current) {
                animFrameRef.current = requestAnimationFrame(update);
            } else {
                isLoopRunningRef.current = false;
                animFrameRef.current = null;
            }
        };

        animFrameRef.current = requestAnimationFrame(update);
    }, []);

    // Pointer Down: Start Dragging a rope with pointer capture
    const handlePointerDownRope = useCallback((rope: "ab" | "ac" | "bc", e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        activeDragRef.current = {
            rope,
            startX: e.clientX,
            startY: e.clientY,
            hasMoved: false,
        };
        springsRef.current[rope].velocity = 0;
    }, []);

    // Pointer Move: Drag the rope dynamically in real-time
    const handlePointerMoveRope = useCallback((e: React.PointerEvent) => {
        if (!activeDragRef.current) return;
        const { rope, startX, startY } = activeDragRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            activeDragRef.current.hasMoved = true;
        }

        let perp = 0;
        if (rope === "ab") {
            // Top horizontal line
            perp = -dy;
        } else if (rope === "ac") {
            // Left diagonal line (GitHub -> Resume)
            perp = dx * -0.674 + dy * -0.738;
        } else if (rope === "bc") {
            // Right diagonal line (LinkedIn -> Resume)
            perp = dx * 0.674 - dy * 0.738;
        }

        // Clamp stretch range [-45px, +45px] for safe visual aesthetics
        const clampedPerp = Math.max(-45, Math.min(45, perp));
        springsRef.current[rope].offset = clampedPerp;
        springsRef.current[rope].velocity = 0;

        setOffsets({
            ab: springsRef.current.ab.offset,
            ac: springsRef.current.ac.offset,
            bc: springsRef.current.bc.offset,
        });
    }, []);

    // Pointer Up / Release: Recoil with spring physics proportional to dragged distance
    const handlePointerUpRope = useCallback((e: React.PointerEvent) => {
        if (!activeDragRef.current) return;
        const { rope, hasMoved } = activeDragRef.current;
        activeDragRef.current = null;

        try {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
            // Ignore if pointer capture already ended
        }

        const currentOffset = springsRef.current[rope].offset;

        if (!hasMoved || Math.abs(currentOffset) < 3) {
            // User just tapped without dragging -> apply gentle natural tap pluck
            springsRef.current[rope].velocity = (Math.random() > 0.5 ? 1 : -1) * 20;
        } else {
            // User stretched the rubber band -> release with recoil proportional to stretch!
            springsRef.current[rope].velocity = -currentOffset * 0.12;
        }

        runSpringLoop();
    }, [runSpringLoop]);

    // Handle node interaction: plucks both connected ropes with elastic spring tension
    const handleInteractNode = useCallback((node: "github" | "linkedin" | "cv") => {
        const springs = springsRef.current;
        if (node === "github") {
            springs.ab.velocity = -24;
            springs.ac.velocity = -24;
        } else if (node === "linkedin") {
            springs.ab.velocity = -24;
            springs.bc.velocity = 24;
        } else if (node === "cv") {
            springs.ac.velocity = 24;
            springs.bc.velocity = -24;
        }
        runSpringLoop();
    }, [runSpringLoop]);

    // Periodic Cosmic Quantum Pluck (Breathing rubber band pulse every 5 seconds when idle)
    useEffect(() => {
        if (!isVisible) return;
        const ropes: ("ab" | "ac" | "bc")[] = ["ab", "bc", "ac"];
        let index = 0;

        const interval = setInterval(() => {
            if (!isLoopRunningRef.current && !activeDragRef.current) {
                const r = ropes[index % ropes.length];
                springsRef.current[r].velocity += (Math.random() > 0.5 ? 1 : -1) * 14;
                runSpringLoop();
                index++;
            }
        }, 5000);

        return () => {
            clearInterval(interval);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isVisible, runSpringLoop]);

    // Compute dynamic Bézier control points for Inverted Cyber Prism ▽
    // Node A (GitHub): (65, 20) | Node B (LinkedIn): (285, 20) | Node C (Resume): (175, 125)
    const cyAB = (20 - offsets.ab).toFixed(1);
    const pathAB = `M 65 20 Q 175 ${cyAB} 285 20`;

    const cxAC = (120 - offsets.ac * 0.674).toFixed(1);
    const cyAC = (72.5 - offsets.ac * 0.738).toFixed(1);
    const pathAC = `M 65 20 Q ${cxAC} ${cyAC} 175 125`;

    const cxBC = (230 + offsets.bc * 0.674).toFixed(1);
    const cyBC = (72.5 - offsets.bc * 0.738).toFixed(1);
    const pathBC = `M 285 20 Q ${cxBC} ${cyBC} 175 125`;

    return (
        <div
            aria-label="Hero Mobile Action Constellation"
            className={cn(
                "flex lg:hidden relative w-full max-w-[340px] sm:max-w-[390px] h-[155px] sm:h-[165px] mx-auto mb-6 sm:mb-8 z-20 select-none",
                "transition-opacity duration-1000 ease-out transform-gpu",
                isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
        >
            {/* SVG Interactive Dynamic Elastic Rubber-Band LED Ropes */}
            <svg
                className="absolute inset-0 w-full h-full z-10 overflow-visible"
                viewBox="0 0 350 155"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    {/* Continuous Adaptive LED Gradient for Line AB (Emerald -> Blue) */}
                    <linearGradient id="ledGradAB" x1="65" y1="20" x2="285" y2="20" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#059669" className="dark:[stop-color:#10b981]" />
                        <stop offset="100%" stopColor="#2563eb" className="dark:[stop-color:#38bdf8]" />
                    </linearGradient>

                    {/* Continuous Adaptive LED Gradient for Line AC (Emerald -> Purple) */}
                    <linearGradient id="ledGradAC" x1="65" y1="20" x2="175" y2="125" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#059669" className="dark:[stop-color:#10b981]" />
                        <stop offset="100%" stopColor="#7c3aed" className="dark:[stop-color:#c084fc]" />
                    </linearGradient>

                    {/* Continuous Adaptive LED Gradient for Line BC (Blue -> Purple) */}
                    <linearGradient id="ledGradBC" x1="285" y1="20" x2="175" y2="125" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#2563eb" className="dark:[stop-color:#38bdf8]" />
                        <stop offset="100%" stopColor="#7c3aed" className="dark:[stop-color:#c084fc]" />
                    </linearGradient>
                </defs>

                {/* 🌟 ROPE AB: GitHub <-> LinkedIn (Top Horizontal Rubber Band) */}
                <g>
                    {/* Outer Ambient LED Bloom */}
                    <path d={pathAB} stroke="url(#ledGradAB)" strokeWidth="7" strokeOpacity="0.35" strokeLinecap="round" className="blur-[2.5px]" />
                    {/* High-Density Solid Neon Tube */}
                    <path d={pathAB} stroke="url(#ledGradAB)" strokeWidth="2.5" strokeOpacity="0.9" strokeLinecap="round" />
                    {/* White-Hot Core Light Filament */}
                    <path d={pathAB} stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.65" strokeLinecap="round" />
                    {/* Interactive Touch/Drag Target */}
                    <path
                        d={pathAB}
                        stroke="transparent"
                        strokeWidth="44"
                        strokeLinecap="round"
                        className="cursor-grab active:cursor-grabbing pointer-events-auto touch-none"
                        onPointerDown={(e) => handlePointerDownRope("ab", e)}
                        onPointerMove={handlePointerMoveRope}
                        onPointerUp={handlePointerUpRope}
                        onPointerCancel={handlePointerUpRope}
                    />
                </g>

                {/* 🌟 ROPE AC: GitHub <-> CV (Left Diagonal Rubber Band) */}
                <g>
                    {/* Outer Ambient LED Bloom */}
                    <path d={pathAC} stroke="url(#ledGradAC)" strokeWidth="7" strokeOpacity="0.35" strokeLinecap="round" className="blur-[2.5px]" />
                    {/* High-Density Solid Neon Tube */}
                    <path d={pathAC} stroke="url(#ledGradAC)" strokeWidth="2.5" strokeOpacity="0.9" strokeLinecap="round" />
                    {/* White-Hot Core Light Filament */}
                    <path d={pathAC} stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.65" strokeLinecap="round" />
                    {/* Interactive Touch/Drag Target */}
                    <path
                        d={pathAC}
                        stroke="transparent"
                        strokeWidth="44"
                        strokeLinecap="round"
                        className="cursor-grab active:cursor-grabbing pointer-events-auto touch-none"
                        onPointerDown={(e) => handlePointerDownRope("ac", e)}
                        onPointerMove={handlePointerMoveRope}
                        onPointerUp={handlePointerUpRope}
                        onPointerCancel={handlePointerUpRope}
                    />
                </g>

                {/* 🌟 ROPE BC: LinkedIn <-> CV (Right Diagonal Rubber Band) */}
                <g>
                    {/* Outer Ambient LED Bloom */}
                    <path d={pathBC} stroke="url(#ledGradBC)" strokeWidth="7" strokeOpacity="0.35" strokeLinecap="round" className="blur-[2.5px]" />
                    {/* High-Density Solid Neon Tube */}
                    <path d={pathBC} stroke="url(#ledGradBC)" strokeWidth="2.5" strokeOpacity="0.9" strokeLinecap="round" />
                    {/* White-Hot Core Light Filament */}
                    <path d={pathBC} stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.65" strokeLinecap="round" />
                    {/* Interactive Touch/Drag Target */}
                    <path
                        d={pathBC}
                        stroke="transparent"
                        strokeWidth="44"
                        strokeLinecap="round"
                        className="cursor-grab active:cursor-grabbing pointer-events-auto touch-none"
                        onPointerDown={(e) => handlePointerDownRope("bc", e)}
                        onPointerMove={handlePointerMoveRope}
                        onPointerUp={handlePointerUpRope}
                        onPointerCancel={handlePointerUpRope}
                    />
                </g>
            </svg>

            {/* 🛰️ NODE A: GITHUB RELAY (Top-Left Vertex — High Above Mascot) */}
            <div
                className="absolute left-2 sm:left-4 top-0 z-20 transition-all duration-75"
                style={{
                    transform: `rotate(${(offsets.ab * 0.2 - offsets.ac * 0.15).toFixed(1)}deg) translateY(${(-Math.abs(offsets.ab) * 0.08).toFixed(1)}px)`,
                }}
            >
                <a
                    href="https://github.com/Ali-Haggag7"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Ali Haggag's GitHub Profile — 40+ Repositories"
                    onMouseEnter={() => handleInteractNode("github")}
                    onTouchStart={() => handleInteractNode("github")}
                    className={cn(
                        "group relative flex items-center gap-2 px-3.5 py-1.5 min-h-[40px] rounded-2xl cursor-pointer select-none",
                        "bg-card/95 dark:bg-card/85 backdrop-blur-xl border border-emerald-500/35 dark:border-emerald-500/40 text-foreground",
                        "shadow-[0_4px_16px_rgba(0,0,0,0.08),0_0_10px_rgba(16,185,129,0.12)]",
                        "transition-all duration-200 hover:border-emerald-500 hover:scale-105 active:scale-95"
                    )}
                >
                    <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-emerald-500/15 border border-slate-200 dark:border-emerald-500/30">
                        <GitHubSkillIcon className="w-3.5 h-3.5" />
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                        </span>
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[11px] font-bold font-display text-foreground leading-tight">
                            GitHub
                        </span>
                        <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold leading-none">
                            40+ Repos
                        </span>
                    </div>
                </a>
            </div>

            {/* 🛰️ NODE B: LINKEDIN UPLINK (Top-Right Vertex — Elevated) */}
            <div
                className="absolute right-2 sm:right-4 top-0 z-20 transition-all duration-75"
                style={{
                    transform: `rotate(${(-offsets.ab * 0.2 + offsets.bc * 0.15).toFixed(1)}deg) translateY(${(-Math.abs(offsets.ab) * 0.08).toFixed(1)}px)`,
                }}
            >
                <a
                    href="https://www.linkedin.com/in/ali-haggag7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with Ali Haggag on LinkedIn"
                    onMouseEnter={() => handleInteractNode("linkedin")}
                    onTouchStart={() => handleInteractNode("linkedin")}
                    className={cn(
                        "group relative flex items-center gap-2 px-3.5 py-1.5 min-h-[40px] rounded-2xl cursor-pointer select-none",
                        "bg-card/95 dark:bg-card/85 backdrop-blur-xl border border-blue-500/35 dark:border-blue-500/40 text-foreground",
                        "shadow-[0_4px_16px_rgba(0,0,0,0.08),0_0_10px_rgba(59,130,246,0.12)]",
                        "transition-all duration-200 hover:border-blue-500 hover:scale-105 active:scale-95"
                    )}
                >
                    <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-100 dark:border-blue-500/30">
                        <LinkedInSkillIcon className="w-3.5 h-3.5" />
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                        </span>
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[11px] font-bold font-display text-foreground leading-tight">
                            LinkedIn
                        </span>
                        <span className="font-mono text-[9px] text-blue-600 dark:text-blue-400 font-semibold leading-none">
                            Network &rarr;
                        </span>
                    </div>
                </a>
            </div>

            {/* 🛰️ NODE C: CV DOSSIER (Bottom-Center Apex — Centered Dead on Vertex) */}
            <div
                className="absolute left-1/2 bottom-0 z-20 transition-all duration-75"
                style={{
                    transform: `translateX(-50%) rotate(${((offsets.bc - offsets.ac) * 0.25).toFixed(1)}deg) translateY(${(offsets.ac * 0.12 + offsets.bc * 0.12).toFixed(1)}px)`,
                }}
            >
                <a
                    href="/Ali_Haggag_CV.pdf"
                    download="Ali_Haggag_FullStack_CV.pdf"
                    aria-label="Download Ali Haggag's Curriculum Vitae (PDF)"
                    onMouseEnter={() => handleInteractNode("cv")}
                    onTouchStart={() => handleInteractNode("cv")}
                    className={cn(
                        "group relative flex p-0.5 overflow-hidden rounded-2xl cursor-pointer select-none",
                        "shadow-[0_4px_18px_rgba(0,0,0,0.1),0_0_14px_rgba(168,85,247,0.18)]",
                        "transition-all duration-200 hover:scale-105 active:scale-95"
                    )}
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--accent-blue))_0%,hsl(var(--accent-purple))_50%,hsl(var(--accent-blue))_100%)] opacity-80 pointer-events-none"
                    />
                    <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 min-h-[38px] rounded-2xl bg-card/95 dark:bg-card/90 backdrop-blur-xl">
                        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/15 border border-purple-100 dark:border-purple-500/30">
                            <ResumeSkillIcon className="w-3.5 h-3.5" />
                            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500 shadow-[0_0_6px_#a855f7]" />
                            </span>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[11px] font-bold font-display text-foreground leading-tight">
                                Resume
                            </span>
                            <span className="font-mono text-[9px] text-purple-600 dark:text-purple-400 font-semibold leading-none">
                                Get CV &darr;
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
});

// Legacy backward-compatible export
export const HeroOrbitalBeacons = HeroDesktopOrbitalBeacons;
