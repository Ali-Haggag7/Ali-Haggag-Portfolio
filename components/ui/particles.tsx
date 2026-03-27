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

        // PERF: Prevent context state resets
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const currentTheme = theme === "system" ? resolvedTheme : theme;
        const isLight = currentTheme === "light";

        const particleColor = isLight ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)";
        const lineColor = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)";

        const particleCount = window.innerWidth < 768 ? 30 : 60;
        
        // Define particle class directly inside to capture width/height automatically
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

        const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle());

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update positions
            for (let i = 0; i < particleCount; i++) {
                particles[i].update();
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

            // Draw all connecting lines in one batch
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

        animate();

        // PERF: Debounced resize handler to prevent CPU spiking when resizing window
        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }, 100); // Wait 100ms after resizing stops before recalculating
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimeout);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme, resolvedTheme, mounted]);

    if (!mounted) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 h-full w-full pointer-events-none opacity-80"
        />
    );
}