// MagneticButton.tsx
"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback } from "react";

export function MagneticButton({
    children,
    href,
}: {
    children: React.ReactNode;
    href: string;
}) {
    const ref = useRef<HTMLAnchorElement>(null);

    // Cache the bounding rect — only invalidated by ResizeObserver, not mousemove.
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

    return (
        <motion.a
            ref={ref}
            href={href}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: springX, y: springY, willChange: "transform" }}
            className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-base font-bold text-background transition-colors duration-300 hover:shadow-2xl hover:shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        >
            <span>{children}</span>
            <div className="h-2 w-2 rounded-full bg-blue-500 transition-transform duration-300 group-hover:scale-150 group-hover:bg-cyan-400" />
        </motion.a>
    );
}