"use client";

import { memo } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { TimelineItem } from "./timeline.data";

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

const dotVariants: Variants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.25,
        transition: { type: "spring", stiffness: 400, damping: 20 },
    },
};

const iconVariants: Variants = {
    rest: { rotate: 0 },
    hover: {
        rotate: 12,
        transition: { type: "spring", stiffness: 400, damping: 20 },
    },
};

const liftVariants: Variants = {
    rest: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
    hover: {
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    },
};

interface TimelineCardProps {
    item: TimelineItem;
    index: number;
}

export const TimelineCard = memo(function TimelineCard({ item, index }: TimelineCardProps) {
    const isEven = index % 2 === 0;
    const Icon = item.icon;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            whileHover="hover"
            whileFocus="hover"
            tabIndex={0}
            className={cn(
                "group relative mb-16 flex items-center md:justify-between w-full focus:outline-none",
                isEven ? "md:flex-row-reverse" : "",
            )}
        >
            <motion.div
                variants={dotVariants}
                initial="rest"
                style={{ willChange: "transform" }}
                className={cn(
                    "absolute left-8 md:left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 z-10",
                    "bg-background border-border dark:bg-neutral-950 dark:border-neutral-800",
                    item.glowBg,
                )}
            >
                {item.isActive && (
                    <span
                        className={cn(
                            "absolute inset-0 rounded-full opacity-50 animate-ping",
                            item.glowBg,
                        )}
                    />
                )}
                <motion.div
                    variants={iconVariants}
                    initial="rest"
                    style={{ willChange: "transform" }}
                >
                    <Icon className={cn("h-5 w-5", item.color)} />
                </motion.div>
            </motion.div>

            <motion.div
                variants={liftVariants}
                initial="rest"
                style={{ willChange: "transform, box-shadow" }}
                className={cn(
                    "ml-20 md:ml-0 w-full md:w-[45%] rounded-2xl p-6 cursor-default relative z-10",
                    "bg-card/80 border border-border shadow-sm",
                    item.hoverBorder,
                )}
            >
                <div className="flex items-center justify-between mb-2">
                    <span
                        className={cn(
                            "text-sm font-mono font-bold tracking-wider px-3 py-1 rounded-full",
                            "bg-background border border-border dark:border-white/5",
                            item.color,
                        )}
                    >
                        {item.year}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-foreground mt-3 tracking-tight">
                    {item.title}
                </h3>

                <p className="mt-3 text-muted-foreground text-base leading-relaxed">
                    {item.description}
                </p>
            </motion.div>
        </motion.div>
    );
});