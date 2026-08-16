"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export const GlitchText = memo(function GlitchText({
  text,
  className = "",
}: GlitchTextProps) {
  return (
    <span
      data-text={text}
      className={cn(
        "relative inline-block font-bold tracking-wider glitch-text select-none",
        className
      )}
    >
      {text}
    </span>
  );
});

export default GlitchText;
