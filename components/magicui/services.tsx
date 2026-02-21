"use client";

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

export default function Services() {
    return (
        <section id="about" className="py-24 relative overflow-hidden bg-background scroll-mt-10">
            {/* Ambient Background Glow for extra depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    {/* Enhanced Typography with a sleek Gradient */}
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter mb-4">
                        What I <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Offer</span>
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                        Technical solutions designed to scale with your business needs.
                        Turning complex ideas into elegant, high-performance applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "0px 0px 200px 0px", amount: 0 }}
                            tabIndex={0}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500",
                                "hover:shadow-2xl hover:-translate-y-2 focus:shadow-2xl focus:-translate-y-2 dark:hover:shadow-blue-900/20 dark:focus:shadow-blue-900/20 cursor-default focus:outline-none"
                            )}
                        >
                            {/* Animated Gradient Border Wrapper */}
                            <div className="absolute inset-0 bg-border group-hover:bg-gradient-to-br group-focus:bg-gradient-to-br group-hover:from-blue-500 group-focus:from-blue-500 group-hover:to-cyan-500 group-focus:to-cyan-500 transition-colors duration-500"></div>

                            {/* Main Card Content */}
                            <div className="relative h-full bg-card rounded-2xl p-8 transition-all duration-500 flex flex-col z-10">

                                {/* Icon Pop Animation */}
                                <div className={cn(
                                    "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl",
                                    "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
                                    "transition-all duration-500",
                                    "group-hover:bg-gradient-to-br group-focus:bg-gradient-to-br group-hover:from-blue-500 group-focus:from-blue-500 group-hover:to-cyan-500 group-focus:to-cyan-500 group-hover:text-white group-focus:text-white",
                                    "group-hover:scale-110 group-focus:scale-110 group-hover:shadow-lg group-focus:shadow-lg group-hover:shadow-blue-500/30 group-focus:shadow-blue-500/30 group-hover:-rotate-3 group-focus:-rotate-3"
                                )}>
                                    <service.icon className="h-7 w-7 transition-transform duration-500" />
                                </div>

                                {/* Title with subtle color shift on hover/focus */}
                                <h3 className="mb-3 text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-blue-600 group-focus:text-blue-600 dark:group-hover:text-blue-400 dark:group-focus:text-blue-400">
                                    {service.title}
                                </h3>

                                <p className="text-muted-foreground text-base leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Expanding Accent Line at the bottom on hover/focus */}
                                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 group-hover:w-full group-focus:w-full"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}