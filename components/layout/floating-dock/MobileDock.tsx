"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { dockItems, handleSmoothScroll } from "./data";

export const FloatingDockMobile = ({ className }: { className?: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={cn("relative block md:hidden z-50", className)}>
            <AnimatePresence>
                {open && (
                    <motion.div className="absolute bottom-full mb-4 inset-x-0 flex flex-col gap-3 items-center">
                        {dockItems.map((item, idx) => {
                            const isExternal = !item.href.startsWith("#");
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.9, transition: { delay: idx * 0.05 } }}
                                    transition={{ delay: (dockItems.length - 1 - idx) * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <Link
                                        href={item.href}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        onClick={(e) => { if (!isExternal) handleSmoothScroll(e, item.href, () => setOpen(false)); }}
                                        className="h-12 w-12 rounded-full bg-background border border-border shadow-lg flex items-center justify-center transition-transform active:scale-90"
                                        style={{ boxShadow: `0 4px 20px -5px ${item.glowColor}40` }}
                                    >
                                        <div className="h-5 w-5">{item.icon}</div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                type="button"
                aria-label={open ? "Close mobile menu" : "Open mobile menu"}
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="h-14 w-14 rounded-full bg-foreground text-background shadow-2xl flex items-center justify-center transition-transform active:scale-90 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            >
                <motion.div
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex flex-col gap-1 items-center justify-center"
                >
                    {open ? (
                        <div className="h-6 w-6 text-xl leading-none flex items-center justify-center -translate-y-0.5">×</div>
                    ) : (
                        <>
                            <div className="h-0.5 w-5 bg-current rounded-full" />
                            <div className="h-0.5 w-5 bg-current rounded-full" />
                            <div className="h-0.5 w-5 bg-current rounded-full" />
                        </>
                    )}
                </motion.div>
            </button>
        </div>
    );
};