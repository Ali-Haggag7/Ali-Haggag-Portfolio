"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionValue, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { dockItems, handleSmoothScroll } from "./data";

export const FloatingDockDesktop = ({ className }: { className?: string }) => {
    const mouseX = useMotionValue(Infinity);
    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto hidden md:flex h-[72px] gap-4 items-end rounded-full bg-background/95 border border-border/50 px-6 pb-3 shadow-2xl dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]",
                className
            )}
        >
            {dockItems.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} {...item} />
            ))}
        </motion.div>
    );
};

function IconContainer({ mouseX, title, icon, href, glowColor }: { mouseX: MotionValue; title: string; icon: React.ReactNode; href: string; glowColor: string; }) {
    const ref = useRef<HTMLDivElement>(null);
    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
    const heightTransform = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
    const width = useSpring(widthTransform, { mass: 0.1, stiffness: 200, damping: 15 });
    const height = useSpring(heightTransform, { mass: 0.1, stiffness: 200, damping: 15 });
    const iconScale = useTransform(distance, [-150, 0, 150], [1, 1.4, 1]);
    const [hovered, setHovered] = useState(false);
    const isExternal = !href.startsWith("#");

    return (
        <Link href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} onClick={(e) => { if (!isExternal) handleSmoothScroll(e, href); }}>
            <motion.div
                ref={ref}
                style={{ width, height, "--glow-bg": `${glowColor}15`, "--glow-border": glowColor, "--glow-shadow": `0 10px 20px -5px ${glowColor}50` } as any} onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={cn(
                    "aspect-square rounded-full flex items-center justify-center relative transition-colors duration-300",
                    hovered ? "bg-[var(--glow-bg)] border border-[var(--glow-border)] shadow-[var(--glow-shadow)]" : "bg-card border border-transparent shadow-sm"
                )}
            >
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                            exit={{ opacity: 0, y: 10, x: "-50%", scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="px-3 py-1.5 whitespace-pre rounded-lg bg-foreground text-background border-border border absolute left-1/2 -top-12 w-fit text-sm font-semibold shadow-xl z-50 flex items-center gap-2"
                        >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: glowColor }}></span>
                            {title}
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div style={{ scale: iconScale }} className="flex items-center justify-center text-muted-foreground transition-colors duration-300">
                    {icon}
                </motion.div>
            </motion.div>
        </Link>
    );
}