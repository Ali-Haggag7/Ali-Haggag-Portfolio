"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        setTimeout(() => {
            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus("idle"), 5000);
        }, 1500);
    };

    return (
        <div className="relative h-14">
            {status === "success" ? (
                <div className="absolute inset-0 flex items-center gap-2 text-emerald-500 font-medium animate-in fade-in slide-in-from-bottom-2 duration-500 transform-gpu">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                    <span>Thanks for subscribing!</span>
                </div>
            ) : (
                <form
                    className="absolute inset-0 flex items-center bg-card/50 backdrop-blur-sm border border-border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all duration-300 shadow-sm hover:border-border/80 transform-gpu"
                    onSubmit={handleSubscribe}
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email..."
                        disabled={status === "loading"}
                        aria-label="Email address for newsletter"
                        className="bg-transparent border-none text-sm text-foreground px-4 py-2.5 focus:outline-none w-full placeholder:text-muted-foreground/70 disabled:opacity-50"
                        required
                    />
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        aria-label="Subscribe"
                        className="flex items-center justify-center min-w-[44px] h-full bg-foreground text-background rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-70 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background transform-gpu will-change-transform"
                    >
                        {status === "loading" ? (
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <Send className="w-4 h-4" aria-hidden="true" />
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}