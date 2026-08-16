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

    let animId: number;

    const handleResize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(container);

    const draw = () => {
      if (!canvas || !ctx || !container) return;
      if (!isVisibleRef.current) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

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

    animId = requestAnimationFrame(draw);

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
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
