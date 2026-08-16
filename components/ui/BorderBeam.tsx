"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  glow?: boolean;
}

export const BorderBeam = memo(function BorderBeam({
  className,
  duration = 6,
  borderWidth = 2,
  colorFrom = "hsl(var(--accent-blue))",
  colorTo = "hsl(var(--accent-purple))",
  delay = 0,
  glow = true,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-20",
        className
      )}
      style={{
        padding: `${borderWidth}px`,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    >
      <div
        className="absolute inset-[-100%] animate-[spin_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 260deg, ${colorFrom} 320deg, ${colorTo} 360deg)`,
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`,
          filter: glow ? `drop-shadow(0 0 8px ${colorFrom})` : undefined,
        }}
      />
    </div>
  );
});

export default BorderBeam;
