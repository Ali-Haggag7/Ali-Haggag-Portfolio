"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hydration Skeleton: Shows a pulsing blurred circle until the theme loads
    if (!mounted) {
        return (
            <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100]">
                <div className="h-14 w-14 rounded-full bg-muted/50 animate-pulse border border-transparent backdrop-blur-xl"></div>
            </div>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100]">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className={cn(
                    "group relative flex h-14 w-14 items-center justify-center rounded-full overflow-hidden transition-colors duration-300",
                    "bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
            >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 dark:from-blue-500/20 dark:to-cyan-500/20" />

                {/* Framer Motion Icon Swap */}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isDark ? "dark" : "light"}
                        initial={{ y: -30, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 30, opacity: 0, rotate: 90 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute flex items-center justify-center"
                    >
                        {isDark ? (
                            <Moon className="h-6 w-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" aria-hidden="true" />
                        ) : (
                            <Sun className="h-6 w-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" aria-hidden="true" />
                        )}
                    </motion.div>
                </AnimatePresence>

                <span className="sr-only">Toggle theme</span>
            </motion.button>
        </div>
    );
}