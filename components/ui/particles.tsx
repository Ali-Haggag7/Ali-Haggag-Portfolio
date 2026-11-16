"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.size = Math.random() * 2 + 0.5;
    }

    update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
}

export default function Particles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme, resolvedTheme } = useTheme();

    // Keep theme state in a stable ref so RAF loop can read it without recreating particles
    const isLightRef = useRef(false);
    useEffect(() => {
        const currentTheme = theme === "system" ? resolvedTheme : theme;
        isLightRef.current = currentTheme === "light";
    }, [theme, resolvedTheme]);

    useEffect(() => {
        // Skip particle calculation completely if user prefers reduced motion
        if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 35 : 70;

        const particles: Particle[] = Array.from(
            { length: particleCount },
            () => new Particle(width, height)
        );

        let animationFrameId: number | null = null;
        let isRunning = true;
        let isScrolling = false;
        let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

        const animate = () => {
            if (!isRunning || isScrolling) {
                animationFrameId = null;
                return;
            }

            ctx.clearRect(0, 0, width, height);

            const isLight = isLightRef.current;
            const particleColor = isLight ? "rgba(37, 99, 235, 0.5)" : "rgba(255, 255, 255, 0.55)";
            const lineColor = isLight ? "rgba(37, 99, 235, 0.12)" : "rgba(255, 255, 255, 0.14)";

            // Update positions
            for (let i = 0; i < particleCount; i++) {
                particles[i].update(width, height);
            }

            // Draw all particles in one batch
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                ctx.moveTo(p.x + p.size, p.y);
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
            ctx.fill();

            // Draw connecting constellation lines
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let i = 0; i < particleCount; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particleCount; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;

                    // 10000 is distance squared (100px threshold)
                    if (dx * dx + dy * dy < 10000) {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                    }
                }
            }
            ctx.stroke();

            animationFrameId = requestAnimationFrame(animate);
        };

        const resumeIfEligible = () => {
            if (isRunning && !isScrolling && !document.hidden && animationFrameId === null) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        // Pause canvas repaints during active scroll to eliminate mobile compositor contention
        const handleScroll = () => {
            isScrolling = true;
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                resumeIfEligible();
            }, 150);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isRunning = false;
                if (animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            } else {
                isRunning = true;
                resumeIfEligible();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Debounced resize handler
        let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
        const handleResize = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (!canvas) return;
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }, 150);
        };

        window.addEventListener("resize", handleResize, { passive: true });

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            if (scrollTimeout) clearTimeout(scrollTimeout);
            if (resizeTimeout) clearTimeout(resizeTimeout);
            if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 h-full w-full pointer-events-none opacity-80"
        />
    );
}
