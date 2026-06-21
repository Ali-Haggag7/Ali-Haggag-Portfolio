"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { MessageSquare, X, Send, Bot, ArrowDown, Sparkles, Trash2, Terminal, Cpu, PhoneCall, Rocket, Lightbulb, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChatBubble } from "./ChatBubble";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

// ─── Constants — allocated once ───────────────────────────────────────────────
const CHAT_SPRING = { type: "spring" as const, stiffness: 400, damping: 30 };

const SUGGESTED_QUESTIONS = [
    {
        text: "Tell me about Logic Arena's custom compiler & sandbox.",
        icon: Terminal,
        color: "text-purple-400"
    },
    {
        text: "What heavy-duty real-time systems have you built?",
        icon: Cpu,
        color: "text-amber-400"
    },
    {
        text: "How did you solve the WebRTC P2P latency issues?",
        icon: PhoneCall,
        color: "text-pink-400"
    }
];

// Section → contextual content map. Outside component = zero re-allocation.
const SECTION_CONTENT: Record<string, { bubble: string; prompt: string; greeting: string }> = {
    projects: {
        bubble: "Ask about Ali's projects!",
        prompt: "Can you tell me more about Ali's projects and architecture?",
        greeting: "I see you're looking at Ali's projects! Want to know about the architecture of Flurry v2.0 or CS-Arena?",
    },
    "battle-scars": {
        bubble: "Curious about these challenges?",
        prompt: "How did Ali solve the technical challenges mentioned in the Battle Scars?",
        greeting: "These were some tough technical challenges! Curious about how Ali solved the WebRTC latency or the caching issues?",
    },
    skills: {
        bubble: "Explore Ali's tech stack!",
        prompt: "What are Ali's main skills and preferred technologies?",
        greeting: "Checking out the tech stack? Ali is highly proficient in Next.js, WebRTC, and real-time systems. Any specific questions?",
    },
    about: {
        bubble: "Summarize Ali's background!",
        prompt: "Can you give me a quick summary of Ali's background and education?",
        greeting: "Want to know more about Ali's background or education? I can give you a quick summary.",
    },
};

const SECTION_ICONS: Record<string, typeof Rocket> = {
    projects: Rocket,
    "battle-scars": Lightbulb,
    skills: Cpu,
    about: GraduationCap,
};

const DEFAULT_GREETING = "Hi! I'm Ali's AI assistant. Ask me anything about his skills, experience, or projects.";
const BUBBLE_TIMEOUT_MS = 6000;

// ─── Chatbot ──────────────────────────────────────────────────────────────────
export default memo(function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleMessage, setBubbleMessage] = useState("");
    const [bubblePrompt, setBubblePrompt] = useState("");

    const dialogRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { messages, sendMessage, status, error, setMessages } = useChat({
        transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

    const isLoading = status === "submitted" || status === "streaming";
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // rAF ref for throttling scroll handler — one pending frame at a time.
    const scrollRafRef = useRef<number | null>(null);

    // ── Scroll to bottom ONLY when the user sends a new message ─────────────────────
    useEffect(() => {
        if (!isOpen || messages.length === 0) return;
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === "user") {
            const raf = requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            });
            return () => cancelAnimationFrame(raf);
        }
    }, [isOpen, messages.length]);

    // ── IntersectionObserver for active section ────────────────────────────────
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActiveSection(e.target.id || "hero");
                });
            },
            { threshold: 0.5 },
        );

        document.querySelectorAll("section[id], div[id]").forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []); // runs once — sections are static

    // ── Context bubble logic ───────────────────────────────────────────────────
    useEffect(() => {
        if (isOpen || activeSection === "hero") {
            setShowBubble(false);
            return;
        }

        const content = SECTION_CONTENT[activeSection];
        if (!content) return;

        setBubbleMessage(content.bubble);
        setBubblePrompt(content.prompt);
        setShowBubble(true);

        const t = setTimeout(() => setShowBubble(false), BUBBLE_TIMEOUT_MS);
        return () => clearTimeout(t);
    }, [activeSection, isOpen]);

    // ── Greeting — memoised, recomputes only when activeSection changes ────────
    const contextGreeting = useMemo(
        () => SECTION_CONTENT[activeSection]?.greeting ?? DEFAULT_GREETING,
        [activeSection],
    );

    const bubbleIcon = useMemo(() => {
        return SECTION_ICONS[activeSection] || Sparkles;
    }, [activeSection]);

    // ── Scroll handler — rAF throttled to avoid forced sync layouts ───────────
    const handleScroll = useCallback(() => {
        if (scrollRafRef.current !== null) return; // already a frame pending
        scrollRafRef.current = requestAnimationFrame(() => {
            scrollRafRef.current = null;
            if (!scrollRef.current) return;
            const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
            setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
        });
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!input.trim() || isLoading) return;
            sendMessage({ text: input });
            setInput("");
            setShowScrollBtn(false);
        },
        [input, isLoading, sendMessage],
    );

    const handleBubbleClick = useCallback(() => {
        setIsOpen(true);
        setInput(bubblePrompt);
        setShowBubble(false);
    }, [bubblePrompt]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
        [],
    );

    const toggleOpen = useCallback(() => setIsOpen((o) => !o), []);
    const closeChat = useCallback(() => setIsOpen(false), []);

    // ── Escape Key Listener ───────────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeChat();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeChat]);

    // ── Auto-Focus Input on Open ──────────────────────────────────────────────
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // ── Focus Trap inside Dialog ──────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen || !dialogRef.current) return;

        const dialog = dialogRef.current;
        const handleFocusTrap = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            const focusableElements = dialog.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        dialog.addEventListener("keydown", handleFocusTrap);
        return () => dialog.removeEventListener("keydown", handleFocusTrap);
    }, [isOpen]);

    return (
        <section
            aria-label="AI Assistant"
            className="fixed bottom-4 left-4 md:left-auto md:right-6 md:bottom-6 z-40 flex flex-col items-start md:items-end pointer-events-none"
        >
            {/* ── Chat window ─────────────────────────────────────────────────────
          Always mounted — visibility via opacity/transform/pointerEvents.
          Eliminates the expensive mount/unmount of the entire dialog tree
          (scroll state, refs, child components) on every open/close toggle.
      ──────────────────────────────────────────────────────────────────────── */}
            <motion.div
                ref={dialogRef}
                role="dialog"
                aria-label="Chat window"
                aria-hidden={!isOpen}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={
                    isOpen
                        ? { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" as const }
                        : { opacity: 0, y: 20, scale: 0.95, pointerEvents: "none" as const }
                }
                transition={CHAT_SPRING}
                style={{ willChange: "transform, opacity", originX: 0, originY: 1 }}
                className="relative mb-4 w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/95 backdrop-blur-sm shadow-2xl"
            >
                {/* Header */}
                <header className="flex items-center justify-between border-b border-border/50 bg-muted/50 p-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div
                            style={{
                                background: "linear-gradient(135deg, hsl(var(--accent-blue)), #a855f7)",
                            }}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md"
                        >
                            <Sparkles className="h-5 w-5" aria-hidden />
                            <span
                                className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500"
                                aria-label="Online"
                            />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-foreground">Ask Ali AI</h3>
                            <p className="text-xs text-muted-foreground">Context-Aware Assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {messages.length > 0 && (
                            <button
                                type="button"
                                aria-label="Clear chat history"
                                onClick={() => setMessages([])}
                                className="w-11 h-11 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted-foreground/20 hover:text-destructive cursor-pointer transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-destructive"
                            >
                                <Trash2 className="h-5 w-5" aria-hidden />
                            </button>
                        )}
                        <button
                            type="button"
                            aria-label="Close chat window"
                            onClick={closeChat}
                            className="w-11 h-11 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground cursor-pointer transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))]"
                        >
                            <X className="h-5 w-5" aria-hidden />
                        </button>
                    </div>
                </header>

                {/* Message list */}
                <div
                    role="log"
                    aria-live="polite"
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                >
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex min-h-full flex-col items-center justify-center text-center space-y-4 py-4 opacity-90"
                        >
                            <div
                                style={{ backgroundColor: "hsl(var(--accent-blue) / 0.15)" }}
                                className="p-4 rounded-full"
                            >
                                <Bot
                                    style={{ color: "hsl(var(--accent-blue))" }}
                                    className="h-10 w-10"
                                    aria-hidden
                                />
                            </div>
                            <p className="text-sm text-foreground/80 max-w-[80%]" dir="auto">
                                {contextGreeting}
                            </p>

                            <div className="flex flex-col gap-2 w-full max-w-[85%] mt-2">
                                {SUGGESTED_QUESTIONS.map((q, idx) => {
                                    const Icon = q.icon;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => sendMessage({ text: q.text })}
                                            className="flex items-center gap-3 text-left w-full px-4 py-3 min-h-11 text-xs border border-border/60 bg-muted/30 hover:bg-[hsl(var(--accent-blue))]/10 hover:border-[hsl(var(--accent-blue))] text-foreground/90 hover:text-[hsl(var(--accent-blue))] cursor-pointer rounded-xl active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-blue))]"
                                        >
                                            <Icon className={cn("h-4 w-4 shrink-0", q.color)} aria-hidden />
                                            <span>{q.text}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        messages.map((m) => (
                            <ChatMessage
                                key={m.id}
                                id={m.id}
                                role={m.role as "user" | "assistant"}
                                parts={m.parts as { type: string; text?: string }[]}
                            />
                        ))
                    )}

                    {/* Isolated memo — its mount/unmount won't re-render the message list */}
                    <TypingIndicator visible={isLoading} />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3 max-w-[85%] mr-auto"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm mt-1 bg-red-500/10 border border-red-500/30 text-red-500">
                                <Bot className="h-4 w-4" aria-hidden />
                            </div>
                            <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-medium">
                                ⚠️ Connection error: Unable to reach the AI assistant. Please try again.
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} aria-hidden />
                </div>

                {/* Scroll-to-bottom button — always mounted, Compositor-driven */}
                <motion.button
                    aria-label="Scroll to bottom"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={
                        showScrollBtn
                            ? { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" as const }
                            : { opacity: 0, scale: 0.8, y: 10, pointerEvents: "none" as const }
                    }
                    transition={{ duration: 0.15 }}
                    onClick={scrollToBottom}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-foreground/90 text-background rounded-full p-2 shadow-lg z-20 hover:bg-foreground hover:scale-105 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))]"
                >
                    <ArrowDown className="h-5 w-5" aria-hidden />
                </motion.button>

                {/* Input form */}
                <form
                    onSubmit={handleSubmit}
                    className="border-t z-10 border-border/50 bg-background p-3 shrink-0"
                >
                    <div className="relative flex items-center">
                        <label htmlFor="chat-input" className="sr-only">
                            Type your message to AI assistant
                        </label>
                        <input
                            id="chat-input"
                            ref={inputRef}
                            dir="auto"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ask about Ali..."
                            className="w-full rounded-full border border-border bg-muted/50 px-4 py-[13px] pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))]/50 shadow-sm transition-colors"
                        />
                        <button
                            aria-label="Send message"
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            style={{ backgroundColor: "hsl(var(--accent-blue))" }}
                            className="absolute right-[2px] top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:opacity-90 cursor-pointer disabled:opacity-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))] focus:ring-offset-2 focus:ring-offset-background"
                        >
                            <Send className="h-4 w-4" aria-hidden />
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Context bubble */}
            <ChatBubble
                show={!isOpen && showBubble}
                message={bubbleMessage}
                icon={bubbleIcon}
                onClick={handleBubbleClick}
            />

            {/* Toggle button — cross-fading icons, no conditional JSX branching */}
            <button
                type="button"
                aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
                aria-expanded={isOpen}
                onClick={toggleOpen}
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-2xl transition-transform hover:scale-110 cursor-pointer active:scale-95 focus:outline-none focus:ring-4 focus:ring-[hsl(var(--accent-blue))]/50 pointer-events-auto"
            >
                {/* Always-mounted layers cross-faded — zero reconciliation on toggle */}
                <motion.span
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: isOpen ? 1 : 0, rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute"
                    aria-hidden
                >
                    <X className="h-6 w-6" />
                </motion.span>
                <motion.span
                    initial={{ opacity: 1, rotate: 0 }}
                    animate={{ opacity: isOpen ? 0 : 1, rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute"
                    aria-hidden
                >
                    <MessageSquare className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                </motion.span>
            </button>
        </section>
    );
});