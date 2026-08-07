"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { metricsData, type MetricItem } from "./metrics.data";
import { MetricCard } from "./MetricCard";
import { MetricDetailModal } from "./MetricDetailModal";

export default function EngineeringMetrics() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState<MetricItem | null>(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleClose = useCallback(() => {
        setSelectedMetric(null);
    }, []);

    return (
        <section
            ref={sectionRef}
            id="metrics"
            className="relative w-full py-20 bg-transparent overflow-hidden"
        >
            <div className="container mx-auto px-4 md:px-6">
                {/* Header — centered, clean typography */}
                <div className="flex flex-col items-center text-center mb-12 max-w-3xl mx-auto">
                    <p className="section-eyebrow mb-3">Verifiable Evidence</p>
                    <h2 className="section-title text-4xl md:text-5xl mb-3">
                        Engineering{" "}
                        <span className="accent-word-emerald">By The Numbers</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                        Real performance metrics, test counts, and system scale extracted from production deployments. Click any card to inspect system evidence.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
                    {metricsData.map((metric) => (
                        <MetricCard
                            key={metric.id}
                            metric={metric}
                            isInView={isInView}
                            onSelect={setSelectedMetric}
                        />
                    ))}
                </div>
            </div>

            {/* Interactive Technical Dossier Modal */}
            <AnimatePresence>
                {selectedMetric && (
                    <MetricDetailModal metric={selectedMetric} onClose={handleClose} />
                )}
            </AnimatePresence>
        </section>
    );
}
