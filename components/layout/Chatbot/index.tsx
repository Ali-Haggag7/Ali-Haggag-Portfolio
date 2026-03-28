"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { MessageSquare, X, Send, Bot, ArrowDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChatBubble } from "./ChatBubble";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

// ─── Constants — allocated once ───────────────────────────────────────────────
const CHAT_SPRING = { type: "spring" as const, stiffness: 400, damping: 30 };

// Section → contextual content map. Outside component = zero re-allocation.
const SECTION_CONTENT: Record<string, { bubble: string; prompt: string; greeting: string }> = {
    projects: {
        bubble: "Ask about Ali's projects! 🚀",
        prompt: "Can you tell me more about Ali's projects and architecture?",
        greeting: "I see you're looking at Ali's projects! Want to know about the architecture of Flurry v2.0 or CS-Arena?",
    },
    "battle-scars": {
        bubble: "Curious about these challenges? 💡",
        prompt: "How did Ali solve the technical challenges mentioned in the Battle Scars?",
        greeting: "These were some tough technical challenges! Curious about how Ali solved the WebRTC latency or the caching issues?",
    },
    skills: {
        bubble: "Explore Ali's tech stack! ⚙️",
        prompt: "What are Ali's main skills and preferred technologies?",
        greeting: "Checking out the tech stack? Ali is highly proficient in Next.js, WebRTC, and real-time systems. Any specific questions?",
    },
    about: {
        bubble: "Summarize Ali's background! 🎓",
        prompt: "Can you give me a quick summary of Ali's background and education?",
        greeting: "Want to know more about Ali's background or education? I can give you a quick summary.",
    },
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

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

    const isLoading = status === "submitted" || status === "streaming";
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // rAF ref for throttling scroll handler — one pending frame at a time.
    const scrollRafRef = useRef<number | null>(null);

    // ── Scroll to bottom on new message ───────────────────────────────────────
    // rAF fires after paint — no arbitrary setTimeout guessing.
    useEffect(() => {
        if (!isOpen) return;
        const raf = requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
        return () => cancelAnimationFrame(raf);
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

    return (
        <section
            aria-label="AI Assistant"
            className="fixed bottom-4 left-4 md:left-auto md:right-6 md:bottom-6 z-50 flex flex-col items-start md:items-end"
        >
            {/* ── Chat window ─────────────────────────────────────────────────────
          Always mounted — visibility via opacity/transform/pointerEvents.
          Eliminates the expensive mount/unmount of the entire dialog tree
          (scroll state, refs, child components) on every open/close toggle.
      ──────────────────────────────────────────────────────────────────────── */}
            <motion.div
                role="dialog"
                aria-label="Chat window"
                aria-hidden={!isOpen}
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
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
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
                    <button
                        type="button"
                        aria-label="Close chat window"
                        onClick={closeChat}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <X className="h-5 w-5" aria-hidden />
                    </button>
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
                            className="flex h-full flex-col items-center justify-center text-center space-y-4 opacity-90"
                        >
                            <div className="p-4 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                                <Bot className="h-10 w-10 text-blue-600 dark:text-blue-400" aria-hidden />
                            </div>
                            <p className="text-sm text-foreground/80 max-w-[80%]" dir="auto">
                                {contextGreeting}
                            </p>
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

                    <div ref={messagesEndRef} aria-hidden />
                </div>

                {/* Scroll-to-bottom button — always mounted, Compositor-driven */}
                <motion.button
                    aria-label="Scroll to bottom"
                    animate={
                        showScrollBtn
                            ? { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" as const }
                            : { opacity: 0, scale: 0.8, y: 10, pointerEvents: "none" as const }
                    }
                    transition={{ duration: 0.15 }}
                    onClick={scrollToBottom}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute bottom-[80px] left-1/2 -translate-x-1/2 bg-foreground/90 text-background rounded-full p-2 shadow-lg z-20 hover:bg-foreground active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            dir="auto"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ask about Ali..."
                            className="w-full rounded-full border border-border bg-muted/50 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-colors"
                        />
                        <button
                            aria-label="Send message"
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
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
                onClick={handleBubbleClick}
            />

            {/* Toggle button — cross-fading icons, no conditional JSX branching */}
            <button
                type="button"
                aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
                aria-expanded={isOpen}
                onClick={toggleOpen}
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-2xl transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
                {/* Always-mounted layers cross-faded — zero reconciliation on toggle */}
                <motion.span
                    animate={{ opacity: isOpen ? 1 : 0, rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute"
                    aria-hidden
                >
                    <X className="h-6 w-6" />
                </motion.span>
                <motion.span
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