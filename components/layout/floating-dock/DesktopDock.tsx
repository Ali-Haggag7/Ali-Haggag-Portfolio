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
                "mx-auto hidden md:flex h-[72px] gap-4 items-end rounded-full bg-background/50 backdrop-blur-2xl saturate-150 border border-border/50 px-6 pb-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] transform-gpu",
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
                style={{ width, height, "--glow-bg": `${glowColor}15`, "--glow-border": glowColor, "--glow-shadow": `0 10px 20px -5px ${glowColor}50` } as any}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={cn(
                    "aspect-square rounded-full flex items-center justify-center relative transition-[background-color,border-color,box-shadow] duration-300 transform-gpu will-change-[width,height,transform]",
                    hovered ? "bg-[var(--glow-bg)] border-[var(--glow-border)] shadow-[var(--glow-shadow)]" : "bg-card/90 border-border shadow-sm"
                )}
            >
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 15, x: "-50%", scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                            exit={{ opacity: 0, y: 5, x: "-50%", scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="px-3 py-1.5 whitespace-pre rounded-lg bg-foreground text-background border-border border absolute left-1/2 -translate-x-1/2 -top-12 w-fit text-sm font-semibold shadow-xl z-50 flex items-center gap-2 transform-gpu will-change-[transform,opacity]"
                        >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: glowColor }}></span>
                            {title}
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div style={{ scale: iconScale }} className="flex items-center justify-center text-muted-foreground transition-colors duration-300 transform-gpu will-change-transform">
                    {icon}
                </motion.div>
            </motion.div>
        </Link>
    );
}