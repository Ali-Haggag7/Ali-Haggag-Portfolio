"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-12 w-12 rounded-full border border-transparent"></div>;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            type="button"
            aria-label="Toggle theme"
            className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full border overflow-hidden transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full" />

            {/* Sun Icon (Light Mode) - Controlled by pure React Logic now */}
            <Sun
                className={`absolute h-[1.3rem] w-[1.3rem] transition-all duration-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] group-hover:rotate-45 ${isDark ? "-rotate-180 scale-0" : "rotate-0 scale-100"
                    }`}
            />

            {/* Moon Icon (Dark Mode) - Controlled by pure React Logic now */}
            <Moon
                className={`absolute h-[1.3rem] w-[1.3rem] transition-all duration-500 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] group-hover:-rotate-12 ${isDark ? "rotate-0 scale-100" : "rotate-180 scale-0"
                    }`}
            />

            <div className="absolute inset-0 rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-black/5 dark:group-hover:ring-white/10 scale-100 group-active:scale-90" />

            <span className="sr-only">Toggle theme</span>
        </button>
    );
}