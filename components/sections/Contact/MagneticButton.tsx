// MagneticButton.tsx
"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const BUTTON_CLASSES =
    "group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-base font-bold text-background transition-colors duration-300 hover:shadow-2xl focus:outline-none focus:ring-4";

const DOT_CLASSES =
    "h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-150";

export function MagneticButton({
    children,
    href,
}: {
    children: React.ReactNode;
    href: string;
}) {
    const isMobile = useIsMobile();
    const ref = useRef<HTMLAnchorElement>(null);

    // Cache the bounding rect — only invalidated by mouseleave, not mousemove.
    const rectCache = useRef<DOMRect | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    // Warm up the cache on enter — one layout read, not one per mousemove frame.
    const handleMouseEnter = useCallback(() => {
        if (ref.current) rectCache.current = ref.current.getBoundingClientRect();
    }, []);

    const handleMouse = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            const rect = rectCache.current;
            if (!rect) return;
            x.set((e.clientX - (rect.left + rect.width / 2)) * 0.2);
            y.set((e.clientY - (rect.top + rect.height / 2)) * 0.2);
        },
        [x, y]
    );

    const reset = useCallback(() => {
        x.set(0);
        y.set(0);
        rectCache.current = null;
    }, [x, y]);

    // On touch devices the magnetic mouse-follow is pointless — render a
    // static anchor with no motion wrapper at all.
    if (isMobile) {
        return (
            <a
                href={href}
                className={BUTTON_CLASSES}
                style={{
                    boxShadow: undefined,
                    // ring + shadow colors sourced from accent var
                    ["--tw-ring-color" as string]: "hsl(var(--accent-blue) / 0.3)",
                }}
            >
                <span>{children}</span>
                <div
                    className={DOT_CLASSES}
                    style={{ backgroundColor: "var(--color-accent)" }}
                />
            </a>
        );
    }

    return (
        <motion.a
            ref={ref}
            href={href}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{
                x: springX,
                y: springY,
                willChange: "transform",
                ["--tw-ring-color" as string]: "hsl(var(--accent-blue) / 0.3)",
                ["--tw-shadow-color" as string]: "hsl(var(--accent-blue) / 0.2)",
            }}
            className={BUTTON_CLASSES}
        >
            <span>{children}</span>
            <div
                className={`${DOT_CLASSES} group-hover:[background-color:var(--color-accent-secondary)]`}
                style={{ backgroundColor: "var(--color-accent)" }}
            />
        </motion.a>
    );
}
