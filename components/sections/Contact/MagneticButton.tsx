"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
    const ref = useRef<HTMLAnchorElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        x.set(middleX * 0.2);
        y.set(middleY * 0.2);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            ref={ref}
            href={href}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: springX, y: springY }}
            className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-base font-bold text-background transition-[box-shadow,background-color] duration-300 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform-gpu will-change-transform"
        >
            <span>{children}</span>
            <div className="h-2 w-2 rounded-full bg-blue-500 transition-transform duration-300 group-hover:scale-150 group-hover:bg-cyan-400 transform-gpu"></div>
        </motion.a>
    );
}