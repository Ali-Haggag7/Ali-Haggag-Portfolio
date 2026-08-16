"use client";

import { useEffect, useState, useRef, memo } from "react";
import { cn } from "@/lib/utils";

const CHAR_SET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*-_+";

interface SplitFlapCharProps {
  char: string;
  delay?: number;
  speed?: number;
  className?: string;
}

const SplitFlapChar = memo(function SplitFlapChar({
  char,
  delay = 0,
  speed = 45,
  className = "",
}: SplitFlapCharProps) {
  const targetChar = char.toUpperCase();
  const [currentChar, setCurrentChar] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      let currentIndex = 0;
      const targetIndex = CHAR_SET.indexOf(targetChar) !== -1 ? CHAR_SET.indexOf(targetChar) : 0;
      const totalSteps = 6 + (targetIndex % 8);
      let step = 0;

      intervalId = setInterval(() => {
        setIsFlipping(true);
        if (step >= totalSteps) {
          setCurrentChar(targetChar);
          setIsFlipping(false);
          clearInterval(intervalId);
        } else {
          currentIndex = (currentIndex + 3) % CHAR_SET.length;
          setCurrentChar(CHAR_SET[currentIndex]);
          step++;
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [targetChar, delay, speed]);

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center font-mono font-black select-none",
        "h-[1.25em] min-w-[0.75em] px-1 mx-0.5 rounded-md",
        "bg-slate-900/90 text-slate-100 border border-slate-700/80 shadow-md",
        "perspective-[400px]",
        className
      )}
      style={{
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 10px rgba(0,0,0,0.5)",
      }}
    >
      <span
        className={cn(
          "inline-block transform-gpu transition-transform duration-100",
          isFlipping ? "scale-y-75 text-[hsl(var(--accent-blue))]" : "scale-y-100"
        )}
      >
        {currentChar}
      </span>
      {/* Horizontal split line across center */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px bg-slate-950/80 pointer-events-none shadow-[0_1px_0_rgba(255,255,255,0.08)]"
      />
    </span>
  );
});

interface SplitFlapTextProps {
  text: string;
  speed?: number;
  stagger?: number;
  className?: string;
  charClassName?: string;
}

export const SplitFlapText = memo(function SplitFlapText({
  text,
  speed = 40,
  stagger = 60,
  className = "",
  charClassName = "",
}: SplitFlapTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={containerRef} className={cn("inline-flex flex-wrap items-center", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap items-center">
        {isInView &&
          text.split("").map((char, index) => (
            <SplitFlapChar
              key={`${index}-${char}`}
              char={char}
              delay={index * stagger}
              speed={speed}
              className={charClassName}
            />
          ))}
      </span>
    </span>
  );
});

export default SplitFlapText;
