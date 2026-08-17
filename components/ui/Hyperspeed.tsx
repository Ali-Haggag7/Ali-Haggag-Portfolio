"use client";

import { useEffect, useRef, memo } from "react";

interface HyperspeedProps {
  className?: string;
  speed?: number;
  starCount?: number;
  starColor?: string;
}

export const Hyperspeed = memo(function Hyperspeed({
  className = "",
  speed = 1.2,
  starCount = 120,
  starColor = "rgba(147, 51, 234, 0.8)",
}: HyperspeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number | null = null;
    let isRunning = false;
    let cachedWidth = 0;
    let cachedHeight = 0;
    let cachedRect: DOMRect | null = null;

    const handleResize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      cachedRect = rect;
      cachedWidth = rect.width;
      cachedHeight = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Initialize 3D starfield particles
    interface Star {
      x: number;
      y: number;
      z: number;
      pz: number;
      color: string;
      length: number;
    }

    const colors = [
      "rgba(147, 51, 234, 0.85)", // purple
      "rgba(59, 130, 246, 0.85)",  // blue
      "rgba(6, 182, 212, 0.85)",   // cyan
      "rgba(236, 72, 153, 0.85)",  // pink
    ];

    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1000,
      pz: 1000,
      color: colors[Math.floor(Math.random() * colors.length)],
      length: 15 + Math.random() * 25,
    }));

    const draw = () => {
      if (!canvas || !ctx || !container) return;
      if (!isVisibleRef.current) {
        isRunning = false;
        animId = null;
        return; // Fully pause loop when off-screen to save GPU/CPU cycles
      }

      const width = cachedWidth;
      const height = cachedHeight;

      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const isLight = typeof document !== "undefined" && document.documentElement.classList.contains("light");
      if (isLight) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = "rgba(9, 13, 22, 0.35)";
        ctx.fillRect(0, 0, width, height);
      }

      const cx = width / 2 + mouseRef.current.x * 60;
      const cy = height / 2 + mouseRef.current.y * 60;

      for (const star of stars) {
        star.pz = star.z;
        star.z -= speed * 14;

        if (star.z <= 0) {
          star.z = 1000;
          star.pz = 1000;
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
        }

        const k = 250 / star.z;
        const pk = 250 / star.pz;

        const sx = star.x * k + cx;
        const sy = star.y * k + cy;

        const px = star.x * pk + cx;
        const py = star.y * pk + cy;

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          const alpha = (1 - star.z / 1000);
          ctx.strokeStyle = star.color.replace("0.85", alpha.toFixed(2));
          ctx.lineWidth = Math.max(1, (1 - star.z / 1000) * 2.5);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (!isRunning && isVisibleRef.current) {
        isRunning = true;
        animId = requestAnimationFrame(draw);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        startLoop();
      }
    }, { threshold: 0 });
    observer.observe(container);

    startLoop();

    let lastMouseTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!container || !isVisibleRef.current) return;
      const now = performance.now();
      if (now - lastMouseTime < 32) return; // ~30fps throttle for background tilt
      lastMouseTime = now;

      if (cachedWidth > 0 && cachedHeight > 0) {
        const rect = cachedRect || container.getBoundingClientRect();
        if (!cachedRect) cachedRect = rect;
        mouseRef.current = {
          x: (e.clientX - rect.left) / cachedWidth - 0.5,
          y: (e.clientY - rect.top) / cachedHeight - 0.5,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [speed, starCount, starColor]);

  return (
    <div ref={containerRef} className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" aria-hidden="true" />
    </div>
  );
});

export default Hyperspeed;
