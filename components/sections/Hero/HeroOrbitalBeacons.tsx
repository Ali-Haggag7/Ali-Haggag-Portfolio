"use client";

import { memo } from "react";
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
            alt="LinkedIn"
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

export const HeroOrbitalBeacons = memo(function HeroOrbitalBeacons({
    isVisible,
}: HeroOrbitalBeaconsProps) {
    const visibilityClasses = isVisible
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 translate-y-6 pointer-events-none";

    return (
        <>
            {/* =========================================================================
                DESKTOP ORBITAL BEACONS (Flanking the Terminal in Open 3D Space)
                lg: and above — zero occlusion by bottom floating dock, floating cosmos feel
               ========================================================================= */}
            <div
                aria-label="Orbital Action Beacons"
                className={cn(
                    "hidden lg:block absolute inset-0 pointer-events-none z-20 transition-all duration-1000 ease-out",
                    visibilityClasses
                )}
            >
                {/* 🛰️ BEACON 01: GITHUB RELAY (Left Flank) */}
                <div
                    className="absolute -left-12 xl:-left-24 top-[24%] -translate-y-1/2 pointer-events-auto animate-[orbitalFloat1_6s_ease-in-out_infinite]"
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

                {/* 🛰️ BEACON 02: LINKEDIN QUANTUM LINK (Right Flank) */}
                <div
                    className="absolute -right-12 xl:-right-24 top-[20%] -translate-y-1/2 pointer-events-auto animate-[orbitalFloat2_7.5s_ease-in-out_infinite]"
                    style={{ willChange: "transform" }}
                >
                    <a
                        href="https://www.linkedin.com/in/ali-haggag7/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Ali Haggag's LinkedIn Profile"
                        className={cn(
                            "group relative flex items-center gap-3.5 p-3 pr-4.5 rounded-2xl cursor-pointer select-none",
                            "bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-blue-500/30 dark:border-blue-500/40 text-foreground",
                            "shadow-[0_8px_30px_rgba(0,0,0,0.08),0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_18px_rgba(59,130,246,0.15)]",
                            "transition-all duration-300 ease-out",
                            "hover:border-blue-500 hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_30px_rgba(59,130,246,0.35)] hover:scale-105 active:scale-95",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        )}
                    >
                        {/* Ambient Azure Halo Glow */}
                        <div
                            aria-hidden="true"
                            className="absolute -inset-1 rounded-2xl bg-blue-500/15 dark:bg-blue-500/25 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                        />

                        {/* Icon Node with Live Ping Radar */}
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-100 dark:border-blue-500/40 group-hover:scale-110 transition-all duration-300 shadow-sm dark:shadow-[inset_0_0_12px_rgba(59,130,246,0.2)]">
                            <LinkedInSkillIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            {/* Live Radar Ping Wave */}
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

                {/* 🛰️ BEACON 03: QUANTUM DOSSIER / CV CRYSTAL (Lower-Right Flank) */}
                <div
                    className="absolute -right-6 xl:-right-16 bottom-[-10px] pointer-events-auto animate-[orbitalFloat3_5.5s_ease-in-out_infinite]"
                    style={{ willChange: "transform" }}
                >
                    <a
                        href="/Ali_Haggag_CV.pdf"
                        download="Ali_Haggag_FullStack_CV.pdf"
                        aria-label="Download Ali Haggag's Curriculum Vitae (PDF)"
                        className={cn(
                            "group relative inline-flex p-0.5 overflow-hidden rounded-2xl cursor-pointer select-none",
                            "shadow-[0_8px_30px_rgba(0,0,0,0.08),0_0_15px_rgba(168,85,247,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(168,85,247,0.25)]",
                            "transition-all duration-300 ease-out",
                            "hover:shadow-[0_8px_30px_rgba(168,85,247,0.3)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_35px_rgba(168,85,247,0.45)] hover:scale-105 active:scale-95",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-purple))]"
                        )}
                    >
                        {/* Spinning Conic Hologram Border */}
                        <span
                            aria-hidden="true"
                            className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--accent-blue))_0%,hsl(var(--accent-purple))_50%,hsl(var(--accent-blue))_100%)] opacity-75 group-hover:opacity-100 transition-opacity duration-300"
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

            {/* =========================================================================
                MOBILE & TABLET ORBITAL CLUSTER (< lg screens)
                Docked neatly below the terminal with generous breathing room
               ========================================================================= */}
            <nav
                aria-label="Hero Action Links"
                className={cn(
                    "flex lg:hidden flex-wrap justify-center items-center gap-3 relative z-20 mt-6 w-full max-w-lg px-2",
                    "transition-all duration-700 transform-gpu",
                    visibilityClasses
                )}
            >
                {/* Mobile GitHub Beacon */}
                <a
                    href="https://github.com/Ali-Haggag7"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Ali Haggag's GitHub Profile"
                    className={cn(
                        "group flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] rounded-xl cursor-pointer select-none",
                        "bg-card/90 dark:bg-card/80 backdrop-blur-md border border-emerald-500/30 dark:border-emerald-500/40",
                        "text-foreground text-xs font-bold shadow-sm",
                        "transition-all duration-200 hover:border-emerald-500 hover:scale-105 active:scale-95"
                    )}
                >
                    <GitHubSkillIcon className="w-4 h-4 shrink-0" />
                    <span>GitHub</span>
                    <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        40+
                    </span>
                </a>

                {/* Mobile LinkedIn Beacon */}
                <a
                    href="https://www.linkedin.com/in/ali-haggag7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Ali Haggag's LinkedIn Profile"
                    className={cn(
                        "group flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] rounded-xl cursor-pointer select-none",
                        "bg-card/90 dark:bg-card/80 backdrop-blur-md border border-blue-500/30 dark:border-blue-500/40",
                        "text-foreground text-xs font-bold shadow-sm",
                        "transition-all duration-200 hover:border-blue-500 hover:scale-105 active:scale-95"
                    )}
                >
                    <LinkedInSkillIcon className="w-4 h-4 shrink-0" />
                    <span>LinkedIn</span>
                </a>

                {/* Mobile CV Beacon */}
                <a
                    href="/Ali_Haggag_CV.pdf"
                    download="Ali_Haggag_FullStack_CV.pdf"
                    aria-label="Download Ali Haggag's Curriculum Vitae (PDF)"
                    className={cn(
                        "group relative inline-flex p-0.5 overflow-hidden rounded-xl cursor-pointer select-none",
                        "transition-all duration-200 hover:scale-105 active:scale-95"
                    )}
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--accent-blue))_0%,hsl(var(--accent-purple))_50%,hsl(var(--accent-blue))_100%)] opacity-80"
                    />
                    <span className="relative z-10 flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-card/95 dark:bg-card/90 backdrop-blur-md text-xs font-bold text-foreground">
                        <ResumeSkillIcon className="w-4 h-4 shrink-0" />
                        <span>Download CV</span>
                    </span>
                </a>
            </nav>
        </>
    );
});
