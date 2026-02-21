"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [showScrollButton, setShowScrollButton] = useState(false);

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
    });

    const isLoading = status === 'submitted' || status === 'streaming';
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [isOpen, messages.length]);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        const { scrollTop, clientHeight, scrollHeight } = scrollContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        sendMessage({ text: input });
        setInput("");
        setShowScrollButton(false);
    };

    return (
        <div className="fixed bottom-4 left-4 md:left-auto md:right-6 md:bottom-6 z-50 flex flex-col items-start md:items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative mb-4 w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl origin-bottom-left md:origin-bottom-right"
                    >
                        {/* Chat Header */}
                        <div className="flex items-center justify-between border-b border-border/50 bg-card/50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
                                    <Sparkles className="h-5 w-5" />
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500"></span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">Ask Ali AI</h3>
                                    <p className="text-xs text-muted-foreground">My personal AI assistant</p>
                                </div>
                            </div>
                            <button
                                aria-label="Close chat"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:scale-95"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                        >
                            {messages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center space-y-3 opacity-70">
                                    <Bot className="h-12 w-12 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground" dir="auto">
                                        Hi! I'm Ali's AI assistant. Ask me anything about his skills, experience, or projects.
                                    </p>
                                </div>
                            ) : (
                                messages.map((m) => (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-3 max-w-[85%]",
                                            m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm mt-1",
                                            m.role === "user" ? "bg-blue-600 text-white" : "bg-card border border-border text-foreground"
                                        )}>
                                            {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </div>

                                        <div
                                            dir="auto"
                                            className={cn(
                                                "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                                                m.role === "user"
                                                    ? "bg-blue-600 text-white rounded-tr-sm"
                                                    : "bg-card border border-border/50 text-foreground rounded-tl-sm"
                                            )}
                                        >
                                            {m.parts.map((part, index) =>
                                                part.type === 'text' ? (
                                                    <div
                                                        key={index}
                                                        className={cn(
                                                            "break-words text-sm",
                                                            "[&_strong]:font-bold [&_p:not(:last-child)]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-2 [&_li]:mb-1 [&_li]:mr-1",
                                                            m.role === "user" ? "text-white" : "[&_strong]:text-blue-600 dark:[&_strong]:text-blue-400"
                                                        )}
                                                    >
                                                        <ReactMarkdown>
                                                            {part.text}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : null
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {isLoading && (
                                <div className="flex gap-3 max-w-[85%] mr-auto">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card border border-border text-foreground shadow-sm mt-1">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="rounded-2xl px-4 py-4 bg-card border border-border/50 rounded-tl-sm flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"></span>
                                        <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce delay-75"></span>
                                        <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <AnimatePresence>
                            {showScrollButton && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                    onClick={scrollToBottom}
                                    className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-foreground/90 text-background rounded-full p-2 shadow-lg z-20 hover:bg-foreground hover:scale-110 active:scale-95 transition-all duration-200"
                                >
                                    <ArrowDown className="h-5 w-5" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Input Area */}
                        <form
                            onSubmit={handleFormSubmit}
                            className="border-t z-10 border-border/50 bg-background/50 p-3"
                        >
                            <div className="relative flex items-center">
                                <input
                                    dir="auto"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about Ali..."
                                    className="w-full rounded-full border border-border bg-card px-4 py-3 pr-12 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
                                />
                                <button
                                    aria-label="Send message"
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 active:scale-95"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-2xl transition-transform hover:scale-110 active:scale-95 focus:outline-none"
            >
                <div className="absolute inset-0 -z-10 rounded-full bg-blue-500/40 blur-md transition-opacity group-hover:opacity-100 opacity-0"></div>

                {isOpen ? (
                    <X className="h-6 w-6 transition-transform rotate-90 animate-in spin-in-12 duration-300" />
                ) : (
                    <MessageSquare className="h-6 w-6 transition-transform hover:rotate-12" />
                )}
            </button>
        </div>
    );
}