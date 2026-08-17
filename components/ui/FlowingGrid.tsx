"use client";

import { useEffect, useRef, memo } from "react";

interface FlowingGridProps {
  className?: string;
  gridColor?: string;
  speed?: number;
  horizon?: number;
}

export const FlowingGrid = memo(function FlowingGrid({
  className = "",
  gridColor = "rgba(59, 130, 246, 0.25)",
  speed = 0.6,
  horizon = 0.35,
}: FlowingGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
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

    const draw = () => {
      if (!canvas || !ctx || !container) return;
      if (!isVisibleRef.current) {
        isRunning = false;
        animId = null;
        return; // Fully pause loop when off-screen
      }

      const width = cachedWidth;
      const height = cachedHeight;

      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const horizonY = height * horizon;
      const gridHeight = height - horizonY;
      const numPerspectiveLines = 24;
      const numHorizontalLines = 14;

      offsetRef.current = (offsetRef.current + speed * 0.005) % 1;

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1.2;

      // Draw vanishing perspective lines radiating from horizon center
      const vanishingX = width * (0.4 + mouseRef.current.x * 0.2);

      for (let i = -numPerspectiveLines / 2; i <= numPerspectiveLines / 2; i++) {
        const spread = (i / (numPerspectiveLines / 2));
        const bottomX = vanishingX + spread * width * 1.2;

        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Draw horizontal lines with exponential perspective spacing
      for (let j = 0; j < numHorizontalLines; j++) {
        const p = ((j + offsetRef.current) / numHorizontalLines) % 1;
        // Exponential depth scaling
        const depth = Math.pow(p, 2.5);
        const lineY = horizonY + depth * gridHeight;
        const alpha = Math.min(depth * 1.5, 1);

        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.35})`;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }

      // Gradient fade to horizon
      const isLight = typeof document !== "undefined" && document.documentElement.classList.contains("light");
      const fadeColor = isLight ? "248, 250, 252" : "9, 13, 22";
      const topFade = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 80);
      topFade.addColorStop(0, `rgba(${fadeColor}, 1)`);
      topFade.addColorStop(1, `rgba(${fadeColor}, 0)`);
      ctx.fillStyle = topFade;
      ctx.fillRect(0, horizonY - 40, width, 120);

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
      if (now - lastMouseTime < 32) return;
      lastMouseTime = now;

      if (cachedWidth > 0 && cachedHeight > 0) {
        const rect = cachedRect || container.getBoundingClientRect();
        if (!cachedRect) cachedRect = rect;
        mouseRef.current = {
          x: (e.clientX - rect.left) / cachedWidth,
          y: (e.clientY - rect.top) / cachedHeight,
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
  }, [gridColor, speed, horizon]);

  return (
    <div ref={containerRef} className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" aria-hidden="true" />
    </div>
  );
});

export default FlowingGrid;
