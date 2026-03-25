"use client";

import { Code2, ExternalLink, RotateCcw } from "lucide-react";
import { useCallback } from "react";
import MagicButton from "@/components/sections/Hero/magic-button";
import { useTerminal } from "./useTerminal";
import { TerminalWindow } from "./TerminalWindow";

export default function HeroSection() {
    const terminal = useTerminal();

    const handleReboot = useCallback(() => {
        terminal.startBootSequence();
    }, [terminal]);

    if (terminal.isClosed) {
        return (
            <section
                aria-label="System Offline State"
                className="relative z-10 flex min-h-[90vh] w-full flex-col items-center justify-center pt-24 pb-12 text-center px-4 animate-fade-in transform-gpu will-change-[opacity,transform]"
            >
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/20 dark:bg-red-600/10 blur-[100px] rounded-full pointer-events-none -z-10 transform-gpu"
                    aria-hidden="true"
                />
                <h2
                    className="text-3xl md:text-5xl font-bold text-red-700 dark:text-red-500 mb-6 font-mono glitch-text"
                    data-text="SYSTEM OFFLINE"
                >
                    SYSTEM OFFLINE
                </h2>
                <button
                    type="button"
                    onClick={handleReboot}
                    aria-label="Reboot System"
                    className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-[transform,background-color] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)] transform-gpu will-change-transform"
                >
                    <RotateCcw className="w-5 h-5" aria-hidden="true" />
                    Reboot System
                </button>
            </section>
        );
    }

    return (
        <section aria-label="Hero Section Terminal" className="relative z-10 flex min-h-[90vh] w-full flex-col items-center justify-center pt-24 pb-12 px-4">

            {!terminal.isFullScreen && (
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[400px] bg-linear-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 blur-[100px] rounded-full pointer-events-none -z-10 transform-gpu"
                    aria-hidden="true"
                />
            )}

            {!terminal.isFullScreen && (
                <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-md px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-[background-color] hover:bg-muted/50 cursor-default animate-fade-in transform-gpu will-change-[opacity,transform]">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 transform-gpu" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500" />
                    </span>
                    System Online & Ready for Deployment
                </div>
            )}

            <TerminalWindow terminal={terminal} />

            {!terminal.isFullScreen && (
                <nav
                    aria-label="Hero Action Links"
                    className={`flex flex-wrap justify-center items-center gap-4 md:gap-5 relative z-20 transition-[opacity,transform] duration-1000 transform-gpu will-change-[opacity,transform] ${terminal.step >= 7
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                        }`}
                >
                    <a
                        href="https://github.com/Ali-Haggag7"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Ali Haggag's GitHub Profile"
                        className="group relative flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-foreground text-background rounded-full font-bold transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.6)] active:scale-95 transform-gpu will-change-transform"
                    >
                        <Code2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 transform-gpu" aria-hidden="true" />
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/ali-haggag7/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Ali Haggag's LinkedIn Profile"
                        className="group flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 border-2 border-border bg-card/50 backdrop-blur-sm text-foreground rounded-full font-bold transition-[transform,background-color,border-color,color] duration-300 hover:bg-blue-500/5 hover:border-blue-500/50 hover:text-blue-500 active:scale-95 shadow-sm transform-gpu will-change-transform"
                    >
                        <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 transform-gpu" aria-hidden="true" />
                        LinkedIn
                    </a>
                    <div className="active:scale-95 transition-transform duration-300 hover:scale-105 transform-gpu will-change-transform">
                        <MagicButton />
                    </div>
                </nav>
            )}
        </section>
    );
}