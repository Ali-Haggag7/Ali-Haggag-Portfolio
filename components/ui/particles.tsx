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

        // Tweak 1: Optimize context rendering
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const currentTheme = theme === "system" ? resolvedTheme : theme;
        const isLight = currentTheme === "light";

        const particleColor = isLight ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)";
        const lineColor = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)";

        const particles: Particle[] = [];
        // Tweak 2: Responsive particle count (save mobile CPU)
        const particleCount = window.innerWidth < 768 ? 30 : 60;

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

            draw() {
                if (!ctx) return;
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                // Tweak 3: index + 1 to avoid duplicate/self drawing
                for (let j = index + 1; j < particles.length; j++) {
                    const dx = particle.x - particles[j].x;
                    const dy = particle.y - particles[j].y;

                    // Tweak 4: Avoid heavy Math.sqrt() calculation
                    const distanceSq = dx * dx + dy * dy;

                    // 100 * 100 = 10000
                    if (distanceSq < 10000) {
                        ctx.beginPath();
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
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
            // Tweak 5: Force GPU acceleration for the canvas
            className="fixed inset-0 -z-10 h-full w-full pointer-events-none transform-gpu will-change-transform"
        />
    );
}