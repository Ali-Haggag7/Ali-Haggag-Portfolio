"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TimelineItem } from "./timeline.data";

export function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            tabIndex={0}
            className={cn(
                "group relative mb-16 flex items-center md:justify-between w-full focus:outline-none transform-gpu will-change-[opacity,transform]",
                index % 2 === 0 ? "md:flex-row-reverse" : "",
            )}
        >
            <div className={cn(
                "absolute left-8 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 z-10 transition-all duration-500 ease-out md:left-1/2 transform-gpu will-change-transform",
                "group-hover:scale-125 group-focus:scale-125 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] group-focus:shadow-[0_0_20px_rgba(0,0,0,0.2)]",
                "bg-background border-border",
                "dark:bg-neutral-950 dark:border-neutral-800",
                item.glowBg
            )}>
                {item.isActive && (
                    <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping transform-gpu", item.glowBg)}></span>
                )}
                <item.icon className={cn("h-5 w-5 transition-transform duration-500 group-hover:rotate-12 group-focus:rotate-12 transform-gpu will-change-transform", item.color)} />
            </div>

            <div className={cn(
                "ml-20 md:ml-0 w-full md:w-[45%] rounded-2xl p-6 transition-all duration-500 ease-out",
                "bg-card/60 backdrop-blur-md border border-border shadow-sm cursor-default relative z-10 transform-gpu will-change-transform",
                "group-hover:-translate-y-2 group-focus:-translate-y-2 group-hover:shadow-xl group-focus:shadow-xl dark:group-hover:shadow-black/50 dark:group-focus:shadow-black/50",
                item.hoverBorder
            )}>
                <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-sm font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-background border border-border dark:border-white/5", item.color)}>
                        {item.year}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-foreground mt-3 tracking-tight transition-colors group-hover:bg-clip-text group-focus:bg-clip-text group-hover:bg-gradient-to-r group-focus:bg-gradient-to-r group-hover:from-foreground group-focus:from-foreground group-hover:to-muted-foreground group-focus:to-muted-foreground">
                    {item.title}
                </h3>

                <p className="mt-3 text-muted-foreground text-base leading-relaxed">
                    {item.description}
                </p>
            </div>
        </motion.div>
    );
}