"use client";

import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { TimelineItem } from "./timeline.data";

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const VIEWPORT = { once: true, margin: "-50px" } as const;

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
            viewport={VIEWPORT}
            className={cn(
                "group relative mb-16 flex items-center md:justify-between w-full",
                isEven && "md:flex-row-reverse"
            )}
        >
            <div className={cn(
                "absolute left-8 md:left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 z-10",
                "bg-background border-border dark:bg-neutral-950 dark:border-neutral-800",
                "transition-transform duration-300 ease-out group-hover:scale-110 will-change-transform",
                item.glowBg,
            )}>
                {item.isActive && (
                    <span
                        aria-hidden="true"
                        className={cn("absolute inset-0 rounded-full opacity-50 animate-ping", item.glowBg)}
                    />
                )}
                <Icon
                    className={cn("h-5 w-5 transition-transform duration-300 ease-out group-hover:rotate-12", item.color)}
                    aria-hidden="true"
                />
            </div>

            <motion.div
                whileHover={{
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                className={cn(
                    "ml-20 md:ml-0 w-full md:w-[45%] rounded-2xl p-6 cursor-default relative z-10",
                    "bg-card/80 border border-border shadow-sm transition-colors duration-300",
                    "hover:shadow-xl hover:bg-card",
                    item.hoverBorder,
                )}
            >
                <span className={cn(
                    "text-sm font-mono font-bold tracking-wider px-3 py-1 rounded-full",
                    "bg-background border border-border dark:border-white/5",
                    item.color,
                )}>
                    {item.year}
                </span>

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