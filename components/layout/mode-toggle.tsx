"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100]">
                <div className="h-14 w-14 rounded-full bg-muted border border-border/50"></div>
            </div>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100]">
            <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className={cn(
                    "group relative flex h-14 w-14 items-center justify-center rounded-full overflow-hidden transition-all duration-200 ease-out cursor-pointer",
                    "bg-background/95 border border-border/50 shadow-md hover:shadow-lg active:scale-90",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
            >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 dark:from-blue-500/20 dark:to-cyan-500/20" />

                <Sun
                    className={cn(
                        "absolute h-6 w-6 text-amber-500 transition-all duration-300 ease-out",
                        isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                    )}
                    aria-hidden="true"
                />

                <Moon
                    className={cn(
                        "absolute h-6 w-6 text-blue-400 transition-all duration-300 ease-out",
                        isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                    )}
                    aria-hidden="true"
                />

                <span className="sr-only">Toggle theme</span>
            </button>
        </div>
    );
}