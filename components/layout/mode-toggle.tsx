"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

// Static classes computed once at module load — never re-allocated.
const WRAPPER_CLASS = "fixed top-4 right-4 md:top-6 md:right-6 z-[100] fixed-right-compensate";

const BUTTON_CLASS = cn(
    "group relative flex h-14 w-14 items-center justify-center rounded-full overflow-hidden",
    "bg-background/95 border border-border/50 shadow-md",
    "hover:shadow-lg active:scale-90 cursor-pointer",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
);

export const ModeToggle = memo(function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = resolvedTheme === "dark";

    const toggle = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            const nextTheme = isDark ? "light" : "dark";

            // Trigger instant theme change without any async blocking
            setTheme(nextTheme);

            // Create a lightweight, GPU-composited radial wave originating from the button
            try {
                const button = event.currentTarget;
                const rect = button?.getBoundingClientRect?.();
                const x = (event.clientX && event.clientX > 0) ? event.clientX : (rect ? rect.left + rect.width / 2 : window.innerWidth - 40);
                const y = (event.clientY && event.clientY > 0) ? event.clientY : (rect ? rect.top + rect.height / 2 : 40);

                const ripple = document.createElement("div");
                ripple.style.position = "fixed";
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.width = "12px";
                ripple.style.height = "12px";
                ripple.style.borderRadius = "50%";
                ripple.style.transform = "translate(-50%, -50%) scale(0)";
                ripple.style.background = isDark
                    ? "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 80%)"
                    : "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.15) 50%, transparent 80%)";
                ripple.style.pointerEvents = "none";
                ripple.style.zIndex = "99999";
                ripple.style.willChange = "transform, opacity";
                ripple.style.transition = "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out";
                document.body.appendChild(ripple);

                // Start expansion in next frame
                requestAnimationFrame(() => {
                    const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2.8;
                    ripple.style.transform = `translate(-50%, -50%) scale(${maxDim / 12})`;
                    ripple.style.opacity = "0";
                });

                // Clean up DOM element after animation ends
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 650);
            } catch {
                /* Graceful fallback */
            }
        },
        [isDark, setTheme]
    );

    return (
        <div className={WRAPPER_CLASS}>
            <button
                type="button"
                onClick={toggle}
                aria-label={!mounted ? "Toggle theme" : isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={mounted ? isDark : undefined}
                className={BUTTON_CLASS}
                style={{ willChange: "transform" }}
            >
                {/* Hover glow */}
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 dark:from-blue-500/20 dark:to-cyan-500/20"
                />

                <Sun
                    aria-hidden
                    className={cn(
                        "absolute h-6 w-6 text-amber-500 ease-out",
                        mounted && "transition-all duration-300",
                        !mounted || isDark
                            ? "rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100"
                    )}
                    style={{ willChange: "transform, opacity" }}
                />

                <Moon
                    aria-hidden
                    className={cn(
                        "absolute h-6 w-6 text-blue-400 ease-out",
                        mounted && "transition-all duration-300",
                        !mounted || !isDark
                            ? "-rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100"
                    )}
                    style={{ willChange: "transform, opacity" }}
                />

                <span className="sr-only">
                    {isDark ? "Switch to light mode" : "Switch to dark mode"}
                </span>
            </button>
        </div>
    );
});