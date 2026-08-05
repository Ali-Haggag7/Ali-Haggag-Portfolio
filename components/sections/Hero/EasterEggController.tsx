"use client";

import { useEffect, useState, useRef, memo } from "react";
import { Terminal, X, ShieldAlert } from "lucide-react";

export const EasterEggController = memo(function EasterEggController() {
    const [isMatrixActive, setIsMatrixActive] = useState(false);
    const [isNukeActive, setIsNukeActive] = useState(false);
    const [isDevStatsOpen, setIsDevStatsOpen] = useState(false);

    const keyBuffer = useRef<string[]>([]);
    const konamiSequence = [
        "ArrowUp", "ArrowUp",
        "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight",
        "ArrowLeft", "ArrowRight",
        "b", "a"
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Buffer key presses
            keyBuffer.current.push(e.key);
            if (keyBuffer.current.length > 15) {
                keyBuffer.current.shift();
            }

            const joined = keyBuffer.current.join("").toLowerCase();

            // Check Konami Code
            const konamiJoined = konamiSequence.join("").toLowerCase();
            if (keyBuffer.current.slice(-10).join("").toLowerCase() === konamiJoined) {
                setIsDevStatsOpen(true);
                keyBuffer.current = [];
            }

            // Check "matrix"
            if (joined.endsWith("matrix")) {
                setIsMatrixActive(true);
                setTimeout(() => setIsMatrixActive(false), 5000);
                keyBuffer.current = [];
            }

            // Check "nuke"
            if (joined.endsWith("nuke")) {
                setIsNukeActive(true);
                setTimeout(() => setIsNukeActive(false), 3000);
                keyBuffer.current = [];
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            {/* Matrix Rain Effect */}
            {isMatrixActive && (
                <div className="fixed inset-0 z-[200] pointer-events-none bg-black/90 flex items-center justify-center font-mono text-emerald-400 text-2xl font-bold animate-pulse">
                    <div className="text-center space-y-2">
                        <div>[MATRIX MODE UNLOCKED]</div>
                        <div className="text-xs text-emerald-300">SYSTEM ARCHITECT: ALI HAGGAG</div>
                    </div>
                </div>
            )}

            {/* Nuke Red Alert Effect */}
            {isNukeActive && (
                <div className="fixed inset-0 z-[200] pointer-events-none bg-red-950/80 animate-ping flex items-center justify-center font-mono text-red-500 text-3xl font-extrabold">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-10 w-10" aria-hidden="true" />
                        <span>TACTICAL OVERRIDE ACTIVATED</span>
                    </div>
                </div>
            )}

            {/* Dev Stats Konami Modal */}
            {isDevStatsOpen && (
                <div
                    className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
                    onClick={() => setIsDevStatsOpen(false)}
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl border border-emerald-500/40 bg-card p-6 shadow-2xl font-mono text-xs text-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsDevStatsOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                            <Terminal className="h-5 w-5" aria-hidden="true" />
                            <span>KONAMI CODE UNLOCKED: DEV STATS</span>
                        </div>
                        <div className="space-y-2 text-muted-foreground">
                            <div>● Portfolio Version: 2.0.0 (Masterclass Edition)</div>
                            <div>● Compiler: Next.js 16 (Turbopack) / React 19</div>
                            <div>● CSS Engine: Vanilla CSS Variables + Tailwind v4</div>
                            <div>● Bundle JS Target: &lt; 180KB initial load</div>
                            <div>● Architect: Ali Haggag (CV August 2026)</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});
