"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Custom Event Bus ────────────────────────────────────────────────────────
// Using a proper CustomEvent instead of spoofed KeyboardEvents so the trigger
// is reliable regardless of focus state or browser event filtering.
export const EASTER_EGG_EVENT = "portfolio:easter-egg";

export function triggerEasterEggDirect(effect: "matrix" | "party" | "nuke") {
    window.dispatchEvent(new CustomEvent(EASTER_EGG_EVENT, { detail: { effect } }));
}

// ─── Per-Effect Durations ────────────────────────────────────────────────────
const EFFECT_DURATION: Record<"matrix" | "party" | "nuke", number> = {
    matrix: 8000,
    party: 6000,
    nuke: 6000,
};

export default function CustomEffects() {
    const [activeEffect, setActiveEffect] = useState<"matrix" | "party" | "nuke" | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activateEffect = useCallback((effect: "matrix" | "party" | "nuke") => {
        // Clear any running timer first so retriggering resets the clock
        if (timerRef.current) clearTimeout(timerRef.current);
        setActiveEffect(effect);
        timerRef.current = setTimeout(() => setActiveEffect(null), EFFECT_DURATION[effect]);
    }, []);

    // ── Custom Event Listener (from buttons) ──────────────────────────────────
    useEffect(() => {
        const handler = (e: Event) => {
            const effect = (e as CustomEvent<{ effect: "matrix" | "party" | "nuke" }>).detail?.effect;
            if (effect) activateEffect(effect);
        };
        window.addEventListener(EASTER_EGG_EVENT, handler);
        return () => window.removeEventListener(EASTER_EGG_EVENT, handler);
    }, [activateEffect]);

    // ── Keyboard Cheat-Code Listener (the original hidden feature) ────────────
    useEffect(() => {
        let typedKeys = "";
        const maxBufferLength = 15;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName ?? "")) return;

            typedKeys += e.key.toLowerCase();
            if (typedKeys.length > maxBufferLength) {
                typedKeys = typedKeys.slice(-maxBufferLength);
            }

            if (typedKeys.endsWith("ali") || typedKeys.endsWith("matrix")) {
                activateEffect("matrix");
            } else if (typedKeys.endsWith("party")) {
                activateEffect("party");
            } else if (typedKeys.endsWith("nuke")) {
                activateEffect("nuke");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activateEffect]);

    // ── Developer Console Hint ────────────────────────────────────────────────
    useEffect(() => {
        console.log(
            "%c[ SYSTEM ALERT ] %cSecret keystroke monitor is ACTIVE. Try typing 'matrix', 'party', or 'nuke' blindly on your keyboard.",
            "color: #10B981; font-weight: bold; font-size: 14px;",
            "color: #9CA3AF; font-size: 13px;"
        );
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    // ── Matrix Rain Canvas ────────────────────────────────────────────────────
    useEffect(() => {
        if (activeEffect !== "matrix" || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Clear canvas to black immediately so there's no white flash
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>[]{}アイウエオカキクケコ";
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(columns).fill(1);

        let animationFrameId: number;
        let lastDrawTime = 0;

        const draw = (timestamp: number) => {
            if (timestamp - lastDrawTime > 20) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = letters.charAt(Math.floor(Math.random() * letters.length));
                    // Bright green for the leading character, dimmer for trail
                    ctx.fillStyle = drops[i] < 3 ? "#AAFFAA" : "#0F0";
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
                lastDrawTime = timestamp;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        animationFrameId = requestAnimationFrame(draw);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, [activeEffect]);

    // ── Nuke Page-Shake (applies to the whole document) ───────────────────────
    useEffect(() => {
        if (activeEffect !== "nuke") return;

        const SHAKE_CLASS = "nuke-shake";
        const STYLE_ID = "nuke-shake-style";

        // Inject keyframes if not already present
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement("style");
            style.id = STYLE_ID;
            style.textContent = `
                @keyframes nuke-shake {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    10% { transform: translate(-4px, 2px) rotate(-0.3deg); }
                    20% { transform: translate(5px, -3px) rotate(0.4deg); }
                    30% { transform: translate(-3px, 4px) rotate(-0.2deg); }
                    40% { transform: translate(4px, -2px) rotate(0.3deg); }
                    50% { transform: translate(-5px, 3px) rotate(-0.4deg); }
                    60% { transform: translate(3px, -4px) rotate(0.2deg); }
                    70% { transform: translate(-2px, 5px) rotate(-0.3deg); }
                    80% { transform: translate(4px, -3px) rotate(0.4deg); }
                    90% { transform: translate(-3px, 2px) rotate(-0.2deg); }
                }
                .${SHAKE_CLASS} {
                    animation: nuke-shake 0.12s ease-in-out infinite;
                    transform-origin: center center;
                }
            `;
            document.head.appendChild(style);
        }

        document.documentElement.classList.add(SHAKE_CLASS);

        return () => {
            document.documentElement.classList.remove(SHAKE_CLASS);
        };
    }, [activeEffect]);

    return (
        <AnimatePresence>
            {/* ── Matrix Overlay ─────────────────────────────────────────── */}
            {activeEffect === "matrix" && (
                <motion.canvas
                    ref={canvasRef}
                    key="matrix"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    aria-hidden="true"
                    className="fixed inset-0 z-[10000] pointer-events-none"
                />
            )}

            {/* ── Party Mode Overlay ─────────────────────────────────────── */}
            {activeEffect === "party" && (
                <motion.div
                    key="party"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        background: [
                            "radial-gradient(ellipse at top, rgba(255,0,128,0.35) 0%, transparent 70%)",
                            "radial-gradient(ellipse at bottom-right, rgba(0,200,255,0.35) 0%, transparent 70%)",
                            "radial-gradient(ellipse at top-left, rgba(255,220,0,0.35) 0%, transparent 70%)",
                            "radial-gradient(ellipse at center, rgba(180,0,255,0.35) 0%, transparent 70%)",
                            "radial-gradient(ellipse at bottom, rgba(0,255,128,0.35) 0%, transparent 70%)",
                            "radial-gradient(ellipse at top-right, rgba(255,100,0,0.35) 0%, transparent 70%)",
                            "radial-gradient(ellipse at top, rgba(255,0,128,0.35) 0%, transparent 70%)",
                        ],
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    transition={{
                        opacity: { duration: 0.4 },
                        background: { duration: 0.7, repeat: Infinity, ease: "linear" },
                    }}
                    aria-hidden="true"
                    className="fixed inset-0 z-[10000] pointer-events-none"
                />
            )}

            {/* Nuke uses a page-shake CSS class — no overlay needed */}
        </AnimatePresence>
    );
}