// TypingIndicator.tsx
// Isolated so its mount/unmount does NOT trigger a re-render
// of the entire message list.
import { memo } from "react";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const TypingIndicator = memo(function TypingIndicator({
    visible,
}: {
    visible: boolean;
}) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex gap-3 max-w-[85%] mr-auto"
                    aria-label="AI is typing"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-foreground shadow-sm mt-1">
                        <Bot className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="rounded-2xl px-4 py-4 bg-muted/50 border border-border/50 rounded-tl-sm flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500   animate-bounce" />
                        <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-cyan-500   animate-bounce [animation-delay:300ms]" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});