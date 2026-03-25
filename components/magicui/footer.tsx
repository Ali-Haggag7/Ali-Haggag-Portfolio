"use client";

import { Github, Linkedin, Mail, Send, ArrowRight, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Hydration-safe Live Clock Component
const LocalTime = () => {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Africa/Cairo',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            setTime(formatter.format(now));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return <span className="w-20 h-5 bg-muted/50 animate-pulse rounded-full"></span>;

    return (
        <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            Qena, EG • {time}
        </div>
    );
};

export default function Footer() {
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
        <footer className="w-full relative bg-background pt-20 pb-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* 1. Brand Section */}
                    <div className="lg:col-span-5">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-3xl font-extrabold text-foreground mb-4 tracking-tighter"
                        >
                            Ali <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Haggag</span>
                        </motion.h2>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-8">
                            Full-Stack Developer crafting scalable web experiences.
                            Turning complex problems into elegant, high-performance solutions.
                        </p>

                        <div className="flex gap-4">
                            {[
                                { icon: Github, href: "https://github.com/Ali-Haggag7", label: "GitHub Profile", hoverClass: "hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:text-white dark:hover:text-black hover:border-transparent" },
                                { icon: Linkedin, href: "https://www.linkedin.com/in/ali-haggag7/", label: "LinkedIn Profile", hoverClass: "hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 hover:text-[#0A66C2]" },
                                { icon: Mail, href: "mailto:ali.haggag2005@gmail.com", label: "Email Me", hoverClass: "hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-500" }
                            ].map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className={cn(
                                        "group p-3 rounded-full bg-card border border-border text-muted-foreground transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                        social.hoverClass
                                    )}
                                >
                                    <social.icon className="w-5 h-5 transition-colors" aria-hidden="true" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div className="lg:col-span-3">
                        <h3 className="text-foreground font-bold mb-6 text-lg">Explore</h3>
                        <ul className="space-y-4 text-muted-foreground text-sm font-medium">
                            {links.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} onClick={(e) => handleSmoothScroll(e, link.href)} className="group flex items-center gap-2 hover:text-blue-500 transition-colors w-fit cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm">
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-focus:opacity-100 group-focus:translate-x-0 text-blue-500" aria-hidden="true" />
                                        <span className="transition-transform duration-300 group-hover:translate-x-1 group-focus:translate-x-1">{link.name}</span>
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

                        <div className="relative h-14">
                            {status === "success" ? (
                                <div className="absolute inset-0 flex items-center gap-2 text-emerald-500 font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                                    <span>Thanks for subscribing!</span>
                                </div>
                            ) : (
                                <form
                                    className="absolute inset-0 flex items-center bg-card/50 backdrop-blur-sm border border-border rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all duration-300 shadow-sm hover:border-border/80"
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
                                        className="flex items-center justify-center min-w-[44px] h-full bg-foreground text-background rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-70 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
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
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
                    <p className="font-medium order-2 md:order-1">© {new Date().getFullYear()} Ali Haggag. All rights reserved.</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 font-medium order-1 md:order-2">
                        {/* The Live Local Time Badge */}
                        <LocalTime />

                        <span className="flex items-center gap-1.5 hidden sm:flex">
                            Built with <span className="text-blue-500 font-semibold">Next.js</span> & <span className="text-cyan-500 font-semibold">Tailwind</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}