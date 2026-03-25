"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Globe, Terminal, Database, Layout, Smartphone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const services = [
    {
        title: "Full-Stack Web Dev",
        description: "Building scalable, high-performance web applications from scratch using the MERN Stack and Next.js.",
        icon: Globe,
    },
    {
        title: "Real-Time & Streaming",
        description: "Developing zero-latency live chats and P2P video calling systems using Socket.io and WebRTC.",
        icon: Terminal,
    },
    {
        title: "AI Integration",
        description: "Integrating Generative AI models (like Google Gemini) to build smart features, summaries, and chatbots.",
        icon: Sparkles,
    },
    {
        title: "Robust API Architecture",
        description: "Designing secure RESTful APIs with MVC architecture, JWT authentication, and optimized MongoDB aggregations.",
        icon: Database,
    },
    {
        title: "PWA & Offline-First",
        description: "Architecting Progressive Web Apps with Service Workers for seamless offline functionality and background syncing.",
        icon: Smartphone,
    },
    {
        title: "Modern UI/UX & Motion",
        description: "Crafting pixel-perfect, bilingual (RTL/LTR), and highly animated interfaces with Tailwind CSS and Framer Motion.",
        icon: Layout,
    },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <motion.div
            ref={divRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={0}
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all duration-500 focus:outline-none cursor-default",
                "hover:-translate-y-2 focus:-translate-y-2 hover:shadow-2xl focus:shadow-2xl hover:border-blue-500/30 focus:border-blue-500/30 dark:hover:shadow-blue-900/20 dark:focus:shadow-blue-900/20"
            )}
        >
            {/* Spotlight Interactive Glow */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.15), transparent 40%)`,
                }}
            />

            <div className="relative z-10 flex flex-col h-full">
                {/* Icon Animation */}
                <div className={cn(
                    "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl",
                    "bg-muted text-muted-foreground border border-border",
                    "transition-all duration-500",
                    "group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white",
                    "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/40 group-hover:-rotate-6 group-hover:border-transparent"
                )}>
                    <service.icon className="h-7 w-7 transition-transform duration-500" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-blue-600 group-focus:text-blue-600 dark:group-hover:text-blue-400 dark:group-focus:text-blue-400">
                    {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-base leading-relaxed">
                    {service.description}
                </p>

            </div>
            {/* **Animated Bottom Line - نقلناه هنا ولزقناه في القاع بالمللي** */}
            <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 group-hover:w-full z-20"></div>
        </motion.div>
    );
}

export default function Services() {
    return (
        <section id="services" className="py-24 relative overflow-hidden bg-background scroll-mt-10">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter mb-4">
                            What I <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Offer</span>
                        </h2>
                        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                            Technical solutions designed to scale with your business needs.
                            Turning complex ideas into elegant, high-performance applications.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}