"use client";

import { motion } from "framer-motion";
import { servicesData } from "./services.data";
import { ServiceCard } from "./ServiceCard";

export default function Services() {
    return (
        <section id="services" className="py-24 relative overflow-hidden bg-background scroll-mt-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10 transform-gpu"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="transform-gpu will-change-[opacity,transform]"
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
                    {servicesData.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}