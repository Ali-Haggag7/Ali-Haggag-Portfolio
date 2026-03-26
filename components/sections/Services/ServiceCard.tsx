"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

type ServiceProps = {
    title: string;
    description: string;
    icon: any;
};

export function ServiceCard({ service, index }: { service: ServiceProps; index: number }) {
    const divRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="h-full"
        >
            <div
                ref={divRef}
                onMouseMove={handleMouseMove}
                tabIndex={0}
                className={cn(
                    "group relative overflow-hidden h-full rounded-3xl border border-border/50 bg-card p-8 focus:outline-none cursor-default",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-2 focus:-translate-y-2 hover:shadow-2xl focus:shadow-2xl hover:border-blue-500/30 focus:border-blue-500/30 dark:hover:shadow-blue-900/20 dark:focus:shadow-blue-900/20"
                )}
            >
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus:opacity-100"
                    style={{ background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(59,130,246,0.12), transparent 40%)` }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    <div className={cn(
                        "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground border border-border",
                        "transition-all duration-300 ease-out",
                        "group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/40 group-hover:-rotate-6 group-hover:border-transparent"
                    )}>
                        <service.icon className="h-7 w-7 transition-transform duration-300 ease-out" aria-hidden="true" />
                    </div>

                    <h3 className="mb-3 text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-blue-600 group-focus:text-blue-600 dark:group-hover:text-blue-400 dark:group-focus:text-blue-400">
                        {service.title}
                    </h3>

                    <p className="text-muted-foreground text-base leading-relaxed">
                        {service.description}
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 h-1.5 w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-cyan-400 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus:scale-x-100 z-20" />
            </div>
        </motion.div>
    );
}