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
    const [activeSection, setActiveSection] = useState("hero");

    const [showBubble, setShowBubble] = useState(false);
    const [bubbleMessage, setBubbleMessage] = useState("");
    const [bubblePrompt, setBubblePrompt] = useState("");

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

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id || "hero");
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const sections = document.querySelectorAll("section[id], div[id]");
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isOpen || activeSection === "hero") {
            setShowBubble(false);
            return;
        }

        let shortMessage = "";
        let promptToFill = "";

        switch (activeSection) {
            case "projects":
                shortMessage = "Ask about Ali's projects! 🚀";
                promptToFill = "Can you tell me more about Ali's projects and architecture?";
                break;
            case "battle-scars":
                shortMessage = "Curious about these challenges? 💡";
                promptToFill = "How did Ali solve the technical challenges mentioned in the Battle Scars?";
                break;
            case "skills":
                shortMessage = "Explore Ali's tech stack! ⚙️";
                promptToFill = "What are Ali's main skills and preferred technologies?";
                break;
            case "about":
                shortMessage = "Summarize Ali's background! 🎓";
                promptToFill = "Can you give me a quick summary of Ali's background and education?";
                break;
        }

        if (shortMessage) {
            setBubbleMessage(shortMessage);
            setBubblePrompt(promptToFill);
            setShowBubble(true);

            const timer = setTimeout(() => {
                setShowBubble(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [activeSection, isOpen]);

    const getContextGreeting = () => {
        switch (activeSection) {
            case "projects":
                return "I see you're looking at Ali's projects! Want to know about the architecture of Flurry v2.0 or CS-Arena?";
            case "battle-scars":
                return "These were some tough technical challenges! Curious about how Ali solved the WebRTC latency or the caching issues?";
            case "skills":
                return "Checking out the tech stack? Ali is highly proficient in Next.js, WebRTC, and real-time systems. Any specific questions?";
            case "about":
                return "Want to know more about Ali's background or education? I can give you a quick summary.";
            default:
                return "Hi! I'm Ali's AI assistant. Ask me anything about his skills, experience, or projects.";
        }
    };

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

    const handleBubbleClick = () => {
        setIsOpen(true);
        setInput(bubblePrompt);
        setShowBubble(false);
    };

    return (
        <section aria-label="AI Assistant" className="fixed bottom-4 left-4 md:left-auto md:right-6 md:bottom-6 z-50 flex flex-col items-start md:items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="dialog"
                        aria-label="Chat window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="relative mb-4 w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl origin-bottom-left md:origin-bottom-right transform-gpu will-change-[opacity,transform]"
                    >
                        <header className="flex items-center justify-between border-b border-border/50 bg-muted/30 p-4">
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md transform-gpu">
                                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" aria-label="Online status indicator"></span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">Ask Ali AI</h3>
                                    <p className="text-xs text-muted-foreground">Context-Aware Assistant</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                aria-label="Close chat window"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-2 text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground transition-[background-color,color] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 transform-gpu will-change-transform"
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </header>

                        <div
                            role="log"
                            aria-live="polite"
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] transform-gpu"
                        >
                            {messages.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex h-full flex-col items-center justify-center text-center space-y-4 opacity-90 transform-gpu will-change-[opacity,transform]"
                                >
                                    <div className="p-4 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                                        <Bot className="h-10 w-10 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                    </div>
                                    <p className="text-sm text-foreground/80 max-w-[80%]" dir="auto">
                                        {getContextGreeting()}
                                    </p>
                                </motion.div>
                            ) : (
                                messages.map((m) => (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex gap-3 max-w-[85%] transform-gpu will-change-[opacity,transform]",
                                            m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm mt-1 transform-gpu",
                                            m.role === "user" ? "bg-blue-600 text-white" : "bg-muted border border-border text-foreground"
                                        )}>
                                            {m.role === "user" ? <User className="h-4 w-4" aria-hidden="true" /> : <Bot className="h-4 w-4" aria-hidden="true" />}
                                        </div>

                                        <div
                                            dir="auto"
                                            className={cn(
                                                "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm break-words transform-gpu",
                                                m.role === "user"
                                                    ? "bg-blue-600 text-white rounded-tr-sm"
                                                    : "bg-muted/50 border border-border/50 text-foreground rounded-tl-sm"
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
                                <div className="flex gap-3 max-w-[85%] mr-auto transform-gpu" aria-label="AI is typing">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-foreground shadow-sm mt-1">
                                        <Bot className="h-4 w-4" aria-hidden="true" />
                                    </div>
                                    <div className="rounded-2xl px-4 py-4 bg-muted/50 border border-border/50 rounded-tl-sm flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce transform-gpu"></span>
                                        <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce delay-75 transform-gpu"></span>
                                        <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce delay-150 transform-gpu"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} aria-hidden="true" />
                        </div>

                        <AnimatePresence>
                            {showScrollButton && (
                                <motion.button
                                    aria-label="Scroll to bottom"
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                    onClick={scrollToBottom}
                                    className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-foreground/90 text-background rounded-full p-2 shadow-lg z-20 hover:bg-foreground active:scale-95 transition-[background-color,transform] duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transform-gpu will-change-[opacity,transform]"
                                >
                                    <ArrowDown className="h-5 w-5" aria-hidden="true" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <form
                            onSubmit={handleFormSubmit}
                            className="border-t z-10 border-border/50 bg-background/80 p-3 transform-gpu"
                        >
                            <div className="relative flex items-center">
                                <label htmlFor="chat-input" className="sr-only">Type your message to AI assistant</label>
                                <input
                                    id="chat-input"
                                    dir="auto"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about Ali..."
                                    className="w-full rounded-full border border-border bg-muted/50 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-[border-color,box-shadow]"
                                />
                                <button
                                    aria-label="Send message"
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-[background-color,transform] hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background transform-gpu will-change-transform"
                                >
                                    <Send className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isOpen && showBubble && (
                    <motion.button
                        aria-label="Open chat with suggested question"
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-16 right-0 md:bottom-2 md:right-[72px] mb-2 md:mb-0 bg-blue-600 text-white text-xs font-medium px-4 py-2.5 rounded-2xl md:rounded-tr-sm rounded-br-sm shadow-lg border border-blue-500 whitespace-nowrap z-40 cursor-pointer hover:bg-blue-700 transition-[background-color,transform] focus:outline-none focus:ring-2 focus:ring-blue-400 transform-gpu will-change-[opacity,transform]"
                        onClick={handleBubbleClick}
                    >
                        {bubbleMessage}
                    </motion.button>
                )}
            </AnimatePresence>

            <button
                type="button"
                aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-2xl transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform-gpu will-change-transform"
            >
                <div className="absolute inset-0 -z-10 rounded-full bg-blue-500/40 blur-md transition-opacity group-hover:opacity-100 opacity-0 transform-gpu" aria-hidden="true"></div>

                {isOpen ? (
                    <X className="h-6 w-6 transition-transform rotate-90 animate-in spin-in-12 duration-300 transform-gpu" aria-hidden="true" />
                ) : (
                    <MessageSquare className="h-6 w-6 transition-transform group-hover:rotate-12 transform-gpu" aria-hidden="true" />
                )}
            </button>
        </section>
    );
}