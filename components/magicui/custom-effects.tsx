"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomEffects() {
    const [activeEffect, setActiveEffect] = useState<"matrix" | "party" | "nuke" | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Keystroke Monitor for Easter Eggs
    useEffect(() => {
        let typedKeys = "";
        const maxBufferLength = 15;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

            typedKeys += e.key.toLowerCase();
            if (typedKeys.length > maxBufferLength) {
                typedKeys = typedKeys.slice(-maxBufferLength);
            }

            if (typedKeys.endsWith("ali") || typedKeys.endsWith("matrix")) {
                setActiveEffect("matrix");
                setTimeout(() => setActiveEffect(null), 8000);
            } else if (typedKeys.endsWith("party")) {
                setActiveEffect("party");
                setTimeout(() => setActiveEffect(null), 5000);
            } else if (typedKeys.endsWith("nuke")) {
                setActiveEffect("nuke");
                setTimeout(() => setActiveEffect(null), 4000);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Developer Console Hint
    useEffect(() => {
        console.log(
            "%c[ SYSTEM ALERT ] %cSecret keystroke monitor is ACTIVE. Try typing 'matrix', 'party', or 'nuke' blindly on your keyboard.",
            "color: #10B981; font-weight: bold; font-size: 14px;",
            "color: #9CA3AF; font-size: 13px;"
        );
    }, []);

    // Matrix Rain Canvas Rendering
    useEffect(() => {
        if (activeEffect !== "matrix" || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>[]{}";
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let x = 0; x < columns; x++) drops[x] = 1;

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#0F0";
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, [activeEffect]);

    return (
        <AnimatePresence>
            {/* Matrix Overlay */}
            {activeEffect === "matrix" && (
                <motion.canvas
                    ref={canvasRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    aria-hidden="true"
                    className="fixed inset-0 z-[10000] pointer-events-none"
                />
            )}

            {/* Party Mode Overlay */}
            {activeEffect === "party" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3, 0.8, 0.4],
                        backgroundColor: [
                            "rgba(255, 0, 0, 0.2)",
                            "rgba(0, 255, 0, 0.2)",
                            "rgba(0, 0, 255, 0.2)",
                            "rgba(255, 0, 255, 0.2)"
                        ]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    aria-hidden="true"
                    className="fixed inset-0 z-[10000] pointer-events-none mix-blend-color"
                />
            )}

            {/* Nuke Mode Overlay */}
            {activeEffect === "nuke" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.8, 0.4, 0.9, 0.5],
                        x: [-10, 10, -10, 10, 0],
                        y: [10, -10, 10, -10, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    aria-hidden="true"
                    className="fixed inset-0 z-[10000] pointer-events-none bg-red-600/30 mix-blend-multiply backdrop-blur-[2px]"
                />
            )}
        </AnimatePresence>
    );
}