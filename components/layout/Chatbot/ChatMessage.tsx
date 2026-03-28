// ChatMessage.tsx
// Extracted so that new messages animate in without re-running
// initial/animate on every previously rendered message.
import { memo } from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface MessagePart {
    type: string;
    text?: string;
}

interface ChatMessageProps {
    id: string;
    role: "user" | "assistant";
    parts: MessagePart[];
}

// Defined outside — never re-allocated.
const USER_BUBBLE = "bg-blue-600 text-white rounded-tr-sm";
const ASSIST_BUBBLE = "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm";
const USER_AVATAR = "bg-blue-600 text-white";
const ASSIST_AVATAR = "bg-muted border border-border text-foreground";
const USER_MD = "text-white";
const ASSIST_MD = "[&_strong]:text-blue-600 dark:[&_strong]:text-blue-400";

export const ChatMessage = memo(function ChatMessage({
    id,
    role,
    parts,
}: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <motion.div
            // Only animates on mount — stable thereafter.
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex gap-3 max-w-[85%]",
                isUser ? "ml-auto flex-row-reverse" : "mr-auto",
            )}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm mt-1",
                    isUser ? USER_AVATAR : ASSIST_AVATAR,
                )}
            >
                {isUser
                    ? <User className="h-4 w-4" aria-hidden />
                    : <Bot className="h-4 w-4" aria-hidden />}
            </div>

            <div
                dir="auto"
                className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm break-words",
                    isUser ? USER_BUBBLE : ASSIST_BUBBLE,
                )}
            >
                {parts.map((part, i) =>
                    part.type === "text" && part.text ? (
                        <div
                            key={i}
                            className={cn(
                                "break-words text-sm",
                                "[&_strong]:font-bold [&_p:not(:last-child)]:mb-2",
                                "[&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-2 [&_li]:mb-1 [&_li]:mr-1",
                                isUser ? USER_MD : ASSIST_MD,
                            )}
                        >
                            <ReactMarkdown>{part.text}</ReactMarkdown>
                        </div>
                    ) : null,
                )}
            </div>
        </motion.div>
    );
});