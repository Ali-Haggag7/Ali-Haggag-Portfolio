"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
    show: boolean;
    message: string;
    onClick: () => void;
}

export function ChatBubble({ show, message, onClick }: ChatBubbleProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    aria-label="Open chat with suggested question"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={cn(
                        "absolute z-40 cursor-pointer whitespace-nowrap shadow-md border border-blue-500",
                        "bg-blue-600 text-white text-xs font-medium px-4 py-2.5 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400",
                        "bottom-[65px] left-0 rounded-2xl rounded-bl-sm origin-bottom-left",
                        "md:bottom-2 md:left-auto md:right-[72px] md:rounded-bl-2xl md:rounded-r-sm md:origin-right"
                    )}
                    onClick={onClick}
                >
                    {message}
                </motion.button>
            )}
        </AnimatePresence>
    );
}