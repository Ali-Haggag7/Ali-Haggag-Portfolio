"use client";

import { Github, Linkedin, Mail, Send, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Footer() {
    // Masterclass UX: Added states for the Newsletter form
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const links = [
        { name: 'Home', href: '#' },
        { name: 'Projects', href: '#projects' },
        { name: 'My Journey', href: '#timeline' },
        { name: 'Contact', href: '#contact' },
    ];

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
        e.preventDefault();
        if (href === "#") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const targetId = href.replace("#", "");
            const elem = document.getElementById(targetId);
            if (elem) {
                elem.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    // The logic to handle the subscription
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        // Simulate an API call (Replace this setTimeout with your actual Formspree/Mailchimp fetch logic later)
        setTimeout(() => {
            setStatus("success");
            setEmail("");

            // Optional: Reset back to idle after a few seconds
            setTimeout(() => setStatus("idle"), 5000);
        }, 1500);
    };

    return (
        <footer className="w-full relative bg-background pt-20 pb-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* 1. Brand Section */}
                    <div className="lg:col-span-5">
                        <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tighter">
                            Ali <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Haggag</span>
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-8">
                            Full-Stack Developer crafting scalable web experiences.
                            Turning complex problems into elegant, high-performance solutions.
                        </p>

                        <div className="flex gap-3">
                            <a href="https://github.com/Ali-Haggag7" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="group p-2.5 rounded-full bg-card border border-border transition-all duration-300 hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:border-transparent">
                                <Github className="w-5 h-5 text-muted-foreground group-hover:text-white dark:group-hover:text-black transition-colors" />
                            </a>
                            <a href="https://www.linkedin.com/in/ali-haggag7/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="group p-2.5 rounded-full bg-card border border-border transition-all duration-300 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30">
                                <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-[#0A66C2] transition-colors" />
                            </a>
                            <a href="mailto:ali.haggag2005@gmail.com" aria-label="Email Me" className="group p-2.5 rounded-full bg-card border border-border transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/30">
                                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div className="lg:col-span-3">
                        <h3 className="text-foreground font-bold mb-6 text-lg">Explore</h3>
                        <ul className="space-y-4 text-muted-foreground text-sm font-medium">
                            {links.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} onClick={(e) => handleSmoothScroll(e, link.href)} className="group flex items-center gap-2 hover:text-blue-500 transition-colors w-fit cursor-pointer">
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-blue-500" />
                                        <span className="transition-transform duration-300 group-hover:translate-x-1">{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Newsletter Section */}
                    <div className="lg:col-span-4">
                        <h3 className="text-foreground font-bold mb-6 text-lg">Stay Updated</h3>
                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                            Subscribe to get the latest updates on my projects, freelance journey, and tech articles.
                        </p>

                        {/* Dynamic Interactive Form */}
                        <div className="relative h-14">
                            {status === "success" ? (
                                <div className="absolute inset-0 flex items-center gap-2 text-emerald-500 font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Thanks for subscribing!</span>
                                </div>
                            ) : (
                                <form
                                    className="absolute inset-0 flex items-center bg-card/50 backdrop-blur-sm border border-border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all duration-300 shadow-sm"
                                    onSubmit={handleSubscribe}
                                >
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email..."
                                        disabled={status === "loading"}
                                        className="bg-transparent border-none text-sm text-foreground px-4 py-2.5 focus:outline-none w-full placeholder:text-muted-foreground/70 disabled:opacity-50"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        aria-label="Subscribe"
                                        className="flex items-center justify-center min-w-[44px] h-full bg-foreground text-background rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                                    >
                                        {status === "loading" ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
                    <p className="font-medium">© {new Date().getFullYear()} Ali Haggag. All rights reserved.</p>
                    <div className="flex items-center gap-6 font-medium">
                        <span className="flex items-center gap-1.5">
                            Built with <span className="text-blue-500 font-semibold">Next.js</span> & <span className="text-cyan-500 font-semibold">Tailwind</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}