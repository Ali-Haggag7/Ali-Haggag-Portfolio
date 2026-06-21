"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ChatBubbleProps {
    show: boolean;
    message: string;
    icon?: LucideIcon;
    onClick: () => void;
}

// Static classes never change — computed once at module load, never re-allocated.
const BUBBLE_CLASS = cn(
    "absolute z-40 cursor-pointer whitespace-nowrap shadow-md border text-white text-xs font-medium px-4 py-2.5 hover:opacity-90 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    "bottom-[65px] left-0 rounded-2xl rounded-bl-sm",
    "md:bottom-2 md:left-auto md:right-[72px] md:rounded-bl-2xl md:rounded-r-sm",
);

// Cubic bezier replaces the "easeOut" string — no runtime string lookup.
const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];

const BUBBLE_TRANSITION = { duration: 0.2, ease: EASE_OUT };

// memo — parent Chatbot has many state variables (input, showScrollBtn, etc.).
// Without memo, every keystroke in the input would re-render this component.
export const ChatBubble = memo(function ChatBubble({
    show,
    message,
    icon: Icon,
    onClick,
}: ChatBubbleProps) {
    return (
        // Always mounted — visibility driven by opacity/scale/transform.
        // Eliminates DOM insertion/removal on every section scroll trigger.
        // pointerEvents:none when hidden prevents invisible hit-testing.
        <motion.button
            aria-label="Open chat with suggested question"
            aria-hidden={!show}
            tabIndex={show ? 0 : -1}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={
                show
                    ? { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" as const }
                    : { opacity: 0, y: 10, scale: 0.95, pointerEvents: "none" as const }
            }
            transition={BUBBLE_TRANSITION}
            style={{
                willChange: "transform, opacity",
                originX: 0,
                originY: 1,
                backgroundColor: "hsl(var(--accent-blue))",
                borderColor: "hsl(var(--accent-blue) / 0.8)",
            }}
            className={BUBBLE_CLASS}
            onClick={onClick}
        >
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                <span>{message}</span>
            </div>
        </motion.button>
    );
});