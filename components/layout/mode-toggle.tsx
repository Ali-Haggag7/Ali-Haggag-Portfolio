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

    const toggle = useCallback(() => {
        const nextTheme = isDark ? "light" : "dark";
        setTheme(nextTheme);
    }, [isDark, setTheme]);

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