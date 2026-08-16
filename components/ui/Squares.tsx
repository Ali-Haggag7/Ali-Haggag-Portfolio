"use client";

import { useRef, useEffect } from "react";

interface SquaresProps {
  direction?: "right" | "left" | "up" | "down" | "diagonal";
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  className?: string;
}

export function Squares({
  direction = "right",
  speed = 0.4,
  borderColor = "rgba(59, 130, 246, 0.18)",
  squareSize = 40,
  hoverFillColor = "rgba(59, 130, 246, 0.28)",
  className = "",
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const mousePosition = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Pause rendering when offscreen
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    const draw = () => {
      if (!canvas || !ctx || !container) return;

      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const effectiveSpeed = Math.max(speed, 0.05);
      switch (direction) {
        case "right":
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
      }

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      // Draw hovered squares with proximity glow
      if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
        const mouseX = mousePosition.current.x;
        const mouseY = mousePosition.current.y;
        
        // Highlight active square and neighbor squares in a 2-square radius
        const radius = squareSize * 2.5;
        const minX = mouseX - radius;
        const maxX = mouseX + radius;
        const minY = mouseY - radius;
        const maxY = mouseY + radius;

        const alignedMinX = Math.floor((minX - (gridOffset.current.x % squareSize)) / squareSize) * squareSize + (gridOffset.current.x % squareSize);
        const alignedMaxX = Math.floor((maxX - (gridOffset.current.x % squareSize)) / squareSize) * squareSize + (gridOffset.current.x % squareSize);
        const alignedMinY = Math.floor((minY - (gridOffset.current.y % squareSize)) / squareSize) * squareSize + (gridOffset.current.y % squareSize);
        const alignedMaxY = Math.floor((maxY - (gridOffset.current.y % squareSize)) / squareSize) * squareSize + (gridOffset.current.y % squareSize);

        for (let gx = alignedMinX; gx <= alignedMaxX; gx += squareSize) {
          for (let gy = alignedMinY; gy <= alignedMaxY; gy += squareSize) {
            const centerX = gx + squareSize / 2;
            const centerY = gy + squareSize / 2;
            const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
            if (dist < radius) {
              const alpha = Math.max(0, 1 - dist / radius) * 0.35;
              ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
              ctx.fillRect(gx + 1, gy + 1, squareSize - 2, squareSize - 2);
            }
          }
        }
      }

      // Draw grid lines
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;

      for (let x = startX - squareSize; x < width + squareSize * 2; x += squareSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = startY - squareSize; y < height + squareSize * 2; y += squareSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Soft vignette mask around perimeter
      const isLight = typeof document !== "undefined" && document.documentElement.classList.contains("light");
      const vignetteColor = isLight ? "248, 250, 252" : "0, 0, 0";
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      gradient.addColorStop(0, `rgba(${vignetteColor}, 0)`);
      gradient.addColorStop(1, `rgba(${vignetteColor}, ${isLight ? 0.9 : 0.8})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleMouseMove = (event: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        mousePosition.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      } else {
        mousePosition.current = { x: null, y: null };
      }
    };

    const handleMouseLeave = () => {
      mousePosition.current = { x: null, y: null };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return (
    <div ref={containerRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export default Squares;
