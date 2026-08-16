"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuroraBackground = memo(function AuroraBackground({
  children,
  className = "",
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-transparent transition-bg",
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className={cn(
            "filter blur-[60px] md:blur-[100px] pointer-events-none absolute -inset-[10px] opacity-30 dark:opacity-40",
            "[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]",
            "[--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]",
            "[--aurora:repeating-linear-gradient(100deg,hsl(var(--accent-blue))_10%,hsl(var(--accent-purple))_15%,hsl(var(--accent-cyan,199_89%_48%))_20%,hsl(var(--accent-purple))_25%,hsl(var(--accent-blue))_30%)]",
            "[background-image:var(--dark-gradient),var(--aurora)] [background-size:300%,_200%]",
            "[background-position:50%_50%,50%_50%]",
            "after:content-[''] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)]",
            "after:[background-size:200%,_100%] after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference"
          )}
        />
      </div>
      {children}
    </div>
  );
});

export default AuroraBackground;
