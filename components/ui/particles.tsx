"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export default function Particles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const currentTheme = theme === "system" ? resolvedTheme : theme;
        const isLight = currentTheme === "light";

        const particleColor = isLight ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)";
        const lineColor = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)";

        const particleCount = window.innerWidth < 768 ? 30 : 60;
        const particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // PERF HACK 1: Update all particles first
            for (let i = 0; i < particleCount; i++) {
                particles[i].update();
            }

            // PERF HACK 2: Batch draw all particles in ONE path
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                ctx.moveTo(p.x + p.size, p.y); // Move to edge to prevent stray lines
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
            ctx.fill();

            // PERF HACK 3: Batch draw all lines in ONE path
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let i = 0; i < particleCount; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particleCount; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;

                    if (dx * dx + dy * dy < 10000) {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                    }
                }
            }
            ctx.stroke();

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme, resolvedTheme, mounted]);

    if (!mounted) return null;

    return (
        <canvas
            ref={canvasRef}
            // Removed will-change-transform. Using it on a full-screen fixed element consumes too much VRAM
            className="fixed inset-0 -z-10 h-full w-full pointer-events-none opacity-80"
        />
    );
}