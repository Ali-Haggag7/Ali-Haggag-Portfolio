"use client";

import { motion, AnimatePresence } from "framer-motion";

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
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-16 right-0 md:bottom-2 md:right-[72px] mb-2 md:mb-0 bg-blue-600 text-white text-xs font-medium px-4 py-2.5 rounded-2xl md:rounded-tr-sm rounded-br-sm shadow-lg border border-blue-500 whitespace-nowrap z-40 cursor-pointer hover:bg-blue-700 transition-[background-color,transform] focus:outline-none focus:ring-2 focus:ring-blue-400 transform-gpu will-change-[opacity,transform]"
                    onClick={onClick}
                >
                    {message}
                </motion.button>
            )}
        </AnimatePresence>
    );
}