"use client";

import { useRef, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
}

export const SpotlightCard = memo(function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(59, 130, 246, 0.15)",
  spotlightSize = 350,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);
  const lastRectTimeRef = useRef<number>(0);

  const handlePointerEnter = useCallback(() => {
    if (divRef.current) {
      cachedRectRef.current = divRef.current.getBoundingClientRect();
      lastRectTimeRef.current = performance.now();
      divRef.current.style.setProperty("--spotlight-opacity", "1");
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!divRef.current) return;

      const now = performance.now();
      if (!cachedRectRef.current || now - lastRectTimeRef.current > 300) {
        cachedRectRef.current = divRef.current.getBoundingClientRect();
        lastRectTimeRef.current = now;
      }

      const rect = cachedRectRef.current;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      divRef.current.style.setProperty("--spotlight-x", `${x}px`);
      divRef.current.style.setProperty("--spotlight-y", `${y}px`);
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    cachedRectRef.current = null;
    if (divRef.current) {
      divRef.current.style.setProperty("--spotlight-opacity", "0");
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (divRef.current) {
      divRef.current.style.setProperty("--spotlight-opacity", "0.6");
    }
  }, []);

  const handleBlur = useCallback(() => {
    if (divRef.current) {
      divRef.current.style.setProperty("--spotlight-opacity", "0");
    }
  }, []);

  return (
    <div
      ref={divRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        "relative rounded-2xl border border-border/70 bg-card overflow-hidden transition-all duration-300",
        className
      )}
      style={{
        // Initialize default CSS vars for the spotlight
        ["--spotlight-x" as any]: "0px",
        ["--spotlight-y" as any]: "0px",
        ["--spotlight-opacity" as any]: "0",
      }}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer — purely GPU-driven via CSS variables */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 -z-0"
        style={{
          opacity: "var(--spotlight-opacity, 0)",
          background: `radial-gradient(${spotlightSize}px circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), ${spotlightColor}, transparent 80%)`,
        }}
      />
      {/* Glowing border highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10"
        style={{
          opacity: "var(--spotlight-opacity, 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1.5px",
          background: `radial-gradient(${spotlightSize * 0.8}px circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), ${spotlightColor.replace("0.15", "0.6").replace("0.2", "0.7")}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
});

export default SpotlightCard;
