"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { cn } from "@/lib/utils";

// Static classes computed once at module load — never re-allocated.
const WRAPPER_CLASS = "fixed top-4 right-4 md:top-6 md:right-6 z-[100]";

const BUTTON_CLASS = cn(
    "group relative flex h-14 w-14 items-center justify-center rounded-full overflow-hidden",
    "bg-background/95 border border-border/50 shadow-md",
    "hover:shadow-lg active:scale-90 cursor-pointer",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
);

export const ModeToggle = memo(function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();

    // mounted guard — prevents hydration mismatch between SSR (no theme)
    // and client (resolved theme). We render the shell immediately to
    // avoid layout shift; icons are hidden via opacity until mounted.
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);

    // Stable toggle — never recreated unless isDark changes.
    const toggle = useCallback(
        () => setTheme(isDark ? "light" : "dark"),
        [isDark, setTheme],
    );

    return (
        <div className={WRAPPER_CLASS}>
            <button
                type="button"
                onClick={toggle}
                // aria-label reflects current state, not the action — screen readers
                // announce what IS active, not what clicking will do.
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={isDark}
                className={BUTTON_CLASS}
                // willChange declared on the element itself — promotes to GPU layer
                // before the first interaction instead of lazily on first animation.
                style={{ willChange: "transform" }}
            >
                {/* Hover glow — opacity transition is Compositor-only */}
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 dark:from-blue-500/20 dark:to-cyan-500/20"
                />

                {/* Icons hidden until mounted to prevent SSR theme flash.
            Once mounted, transition-all handles the rotation/scale swap.
            GPU path: transform + opacity = Compositor only, zero Layout/Paint. */}
                <Sun
                    aria-hidden
                    className={cn(
                        "absolute h-6 w-6 text-amber-500 transition-all duration-300 ease-out",
                        // willChange on individual icons so each has its own GPU layer.
                        !mounted || isDark
                            ? "rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100",
                    )}
                    style={{ willChange: "transform, opacity" }}
                />

                <Moon
                    aria-hidden
                    className={cn(
                        "absolute h-6 w-6 text-blue-400 transition-all duration-300 ease-out",
                        !mounted || !isDark
                            ? "-rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100",
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