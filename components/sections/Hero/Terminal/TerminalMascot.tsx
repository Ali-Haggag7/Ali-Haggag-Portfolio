"use client";

import { memo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalMascotProps {
    isFocused: boolean;
    isTyping: boolean;
}

export const TerminalMascot = memo(function TerminalMascot({
    isFocused,
    isTyping,
}: TerminalMascotProps) {
    const mascotRef = useRef<HTMLDivElement>(null);
    const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
    const [statusBubble, setStatusBubble] = useState<string | null>(null);

    // Active typing is ONLY valid when focused to prevent background timeout conflicts
    const activeTyping = isFocused && isTyping;

    // Track mouse position to move pupils toward cursor when awake
    useEffect(() => {
        if (!isFocused) {
            setPupilOffset({ x: 0, y: 0 });
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!mascotRef.current) return;
            const rect = mascotRef.current.getBoundingClientRect();
            const mascotCenterX = rect.left + rect.width / 2;
            const mascotCenterY = rect.top + rect.height / 2;

            const dx = e.clientX - mascotCenterX;
            const dy = e.clientY - mascotCenterY;
            const dist = Math.hypot(dx, dy) || 1;
            const maxRadius = 4.5;

            const x = (dx / dist) * Math.min(dist * 0.05, maxRadius);
            const y = (dy / dist) * Math.min(dist * 0.05, maxRadius);

            setPupilOffset({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isFocused]);

    // Show temporary status speech bubble when state changes
    useEffect(() => {
        if (activeTyping) {
            setStatusBubble("Coding...");
            const timer = setTimeout(() => setStatusBubble("Online!"), 1200);
            return () => clearTimeout(timer);
        } else if (isFocused) {
            setStatusBubble("Ready!");
        } else {
            setStatusBubble(null);
        }
    }, [isFocused, activeTyping]);

    return (
        <>
            {/* ── BACKGROUND LAYER (z-0: Head & Body Peeking from BEHIND Terminal Wall) ── */}
            <div
                ref={mascotRef}
                aria-label="Terminal Mascot Companion"
                className="absolute -top-[38px] sm:-top-[48px] left-4 sm:left-10 z-0 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none select-none"
            >
                {/* Status Speech Bubble */}
                <AnimatePresence>
                    {statusBubble && (
                        <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 z-30 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-extrabold bg-slate-900/95 text-emerald-400 border border-emerald-500/50 backdrop-blur-xl shadow-[0_4px_15px_rgba(16,185,129,0.35)] flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                            <span>{statusBubble}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Head & Visor Container */}
                <motion.div
                    animate={
                        activeTyping
                            ? { y: 0, rotate: 0 }
                            : isFocused
                            ? { y: 0, rotate: 0 } // Straightens up upright when focused
                            : { y: 5, rotate: -6 } // Tilts cheek down resting on paws when sleeping
                    }
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ originX: 0.5, originY: 0.7 }}
                    className="w-full h-full flex items-center justify-center filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                >
                    <svg
                        viewBox="0 0 80 80"
                        className="w-full h-full overflow-visible"
                        aria-hidden="true"
                    >
                        <defs>
                            {/* Metallic 3D Gradients */}
                            <linearGradient id="cyber-armor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#475569" />
                                <stop offset="50%" stopColor="#1e293b" />
                                <stop offset="100%" stopColor="#0f172a" />
                            </linearGradient>

                            <radialGradient id="head-3d-sphere" cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#334155" />
                                <stop offset="60%" stopColor="#1e293b" />
                                <stop offset="100%" stopColor="#020617" />
                            </radialGradient>

                            <radialGradient id="visor-deep-glass" cx="40%" cy="25%" r="75%">
                                <stop offset="0%" stopColor="#1e293b" />
                                <stop offset="60%" stopColor="#090d16" />
                                <stop offset="100%" stopColor="#020617" />
                            </radialGradient>

                            {/* Neon Glow Filter */}
                            <filter id="cyber-neon-glow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Torso & Fiber-Optic Cables (Sits BEHIND terminal wall) */}
                        <path
                            d="M 28 48 L 28 78 M 52 48 L 52 78"
                            stroke={isFocused ? "#10b981" : "#334155"}
                            strokeWidth="3"
                            strokeDasharray="3 3"
                            opacity="0.7"
                        />
                        <path
                            d="M 20 44 Q 40 54 60 44 L 64 80 L 16 80 Z"
                            fill="url(#cyber-armor-grad)"
                            stroke={isFocused ? "rgba(16,185,129,0.4)" : "#334155"}
                            strokeWidth="1.5"
                        />

                        {/* 3D Radar / Cyber Cat Ears */}
                        <motion.path
                            d="M 18 20 L 6 2 L 28 12 Z"
                            fill="url(#cyber-armor-grad)"
                            stroke={isFocused ? "#10b981" : "#475569"}
                            strokeWidth="2"
                            animate={activeTyping ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
                            transition={{ duration: 0.15, repeat: activeTyping ? Infinity : 0 }}
                            style={{ originX: "28px", originY: "12px" }}
                        />
                        <motion.path
                            d="M 62 20 L 74 2 L 52 12 Z"
                            fill="url(#cyber-armor-grad)"
                            stroke={isFocused ? "#10b981" : "#475569"}
                            strokeWidth="2"
                            animate={activeTyping ? { rotate: [4, -4, 4] } : { rotate: 0 }}
                            transition={{ duration: 0.15, repeat: activeTyping ? Infinity : 0 }}
                            style={{ originX: "52px", originY: "12px" }}
                        />

                        {/* Inner Ear Radar Grids & Signal Nodes */}
                        <circle cx="8" cy="4" r="3" fill={isFocused ? "#10b981" : "#475569"} filter={isFocused ? "url(#cyber-neon-glow)" : "none"} />
                        <circle cx="72" cy="4" r="3" fill={isFocused ? "#10b981" : "#475569"} filter={isFocused ? "url(#cyber-neon-glow)" : "none"} />
                        <path d="M 14 14 L 20 12 M 66 14 L 60 12" stroke={isFocused ? "#34d399" : "#64748b"} strokeWidth="1.5" />

                        {/* Antenna Mast & Orb */}
                        <line x1="40" y1="10" x2="40" y2="2" stroke={isFocused ? "#38bdf8" : "#475569"} strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="40" cy="2" r="3.5" fill={isFocused ? "#38bdf8" : "#475569"} filter={isFocused ? "url(#cyber-neon-glow)" : "none"} />

                        {/* 3D Helmet Head Shell */}
                        <rect
                            x="14"
                            y="10"
                            width="52"
                            height="38"
                            rx="19"
                            fill="url(#head-3d-sphere)"
                            stroke={isFocused ? "#10b981" : "#334155"}
                            strokeWidth="2.5"
                        />

                        {/* Helmet Side Rivets / Metallic Bolts */}
                        <circle cx="18" cy="30" r="1.8" fill="#64748b" />
                        <circle cx="62" cy="30" r="1.8" fill="#64748b" />

                        {/* Specular Highlight Arc (Top Gloss Effect) */}
                        <ellipse cx="40" cy="14" rx="18" ry="3" fill="#ffffff" opacity="0.15" />

                        {/* 3D Curved Visor Frame */}
                        <rect
                            x="18"
                            y="17"
                            width="44"
                            height="25"
                            rx="12"
                            fill="url(#visor-deep-glass)"
                            stroke={isFocused ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.12)"}
                            strokeWidth="1.5"
                        />

                        {/* Visor Glass Light Reflection Specular Arc */}
                        <path
                            d="M 22 19 C 32 17, 48 17, 58 19"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            opacity="0.3"
                            strokeLinecap="round"
                        />

                        {/* Dynamic Eyes & Expression */}
                        {isFocused ? (
                            /* AWAKE STATE: High-Tech Glowing Lenses with Pupil Cursor Tracking */
                            <g filter="url(#cyber-neon-glow)">
                                <circle cx="29" cy="29" r="6.5" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.5" />
                                <circle
                                    cx={29 + pupilOffset.x}
                                    cy={29 + pupilOffset.y}
                                    r="3.2"
                                    fill="#34d399"
                                />
                                <circle cx={27 + pupilOffset.x * 0.5} cy={27 + pupilOffset.y * 0.5} r="1.2" fill="#ffffff" />

                                <circle cx="51" cy="29" r="6.5" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.5" />
                                <circle
                                    cx={51 + pupilOffset.x}
                                    cy={29 + pupilOffset.y}
                                    r="3.2"
                                    fill="#34d399"
                                />
                                <circle cx={49 + pupilOffset.x * 0.5} cy={27 + pupilOffset.y * 0.5} r="1.2" fill="#ffffff" />

                                <path d="M 36 36 Q 40 38 44 36" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
                            </g>
                        ) : (
                            /* IDLE / SLEEPING STATE: Resting Cheek Eyes ( ^ ^ ) */
                            <g stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
                                <path d="M 24 30 Q 29 25 34 30" />
                                <path d="M 46 30 Q 51 25 56 30" />
                                <path d="M 37 37 Q 40 38.5 43 37" fill="none" opacity="0.5" />
                            </g>
                        )}
                    </svg>

                    {/* Floating Sleeping Zzz Particles when Idle */}
                    {!isFocused && (
                        <motion.span
                            animate={{ opacity: [0, 1, 0], y: [-2, -14], x: [0, 5] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                            className="absolute -top-3 right-0 text-[10px] font-mono font-extrabold text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                        >
                            zZ
                        </motion.span>
                    )}
                </motion.div>
            </div>

            {/* ── FOREGROUND LAYER (z-20 ON TOP of Terminal Header Border: 3D Paws Dangling Over Front Edge!) ── */}
            <div
                aria-hidden="true"
                className="absolute -top-1.5 sm:-top-2 left-4 sm:left-10 z-20 w-12 h-3 sm:w-16 sm:h-4 pointer-events-none select-none flex justify-between px-1.5 sm:px-2"
            >
                <svg viewBox="0 0 64 16" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="paw-metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#475569" />
                            <stop offset="50%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                    </defs>

                    {/* Left Paw Dangling Over Top Border */}
                    <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.8))">
                        <rect
                            x="10"
                            y="1"
                            width="14"
                            height="11"
                            rx="4.5"
                            fill="url(#paw-metal-grad)"
                            stroke={isFocused ? "#10b981" : "#475569"}
                            strokeWidth="1.5"
                        />
                        {/* Paw Finger Lines */}
                        <line x1="14.5" y1="4" x2="14.5" y2="9" stroke="#64748b" strokeWidth="1" />
                        <line x1="19.5" y1="4" x2="19.5" y2="9" stroke="#64748b" strokeWidth="1" />
                    </g>

                    {/* Right Paw Dangling Over Top Border */}
                    <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.8))">
                        <rect
                            x="40"
                            y="1"
                            width="14"
                            height="11"
                            rx="4.5"
                            fill="url(#paw-metal-grad)"
                            stroke={isFocused ? "#10b981" : "#475569"}
                            strokeWidth="1.5"
                        />
                        {/* Paw Finger Lines */}
                        <line x1="44.5" y1="4" x2="44.5" y2="9" stroke="#64748b" strokeWidth="1" />
                        <line x1="49.5" y1="4" x2="49.5" y2="9" stroke="#64748b" strokeWidth="1" />
                    </g>
                </svg>
            </div>
        </>
    );
});
