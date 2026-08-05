"use client";

import { memo, useEffect, useRef, useState } from "react";
import type { MetricItem } from "./metrics.data";

interface MetricCardProps {
    metric: MetricItem;
    isInView: boolean;
}

export const MetricCard = memo(function MetricCard({ metric, isInView }: MetricCardProps) {
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);
    const Icon = metric.icon;

    useEffect(() => {
        if (!isInView || hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 1500; // ms
        const target = metric.value;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic formula
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeProgress * target);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, metric.value]);

    return (
        <div
            className="metric-card-rail group rounded-r-xl p-5 transition-all duration-300 hover:bg-muted/20"
            style={{ borderLeftColor: `color-mix(in srgb, ${metric.accentVar} 55%, transparent)` }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderLeftColor = metric.accentVar;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderLeftColor = `color-mix(in srgb, ${metric.accentVar} 55%, transparent)`;
            }}
        >
            {/* Category label — HUD tag */}
            <div className="mb-3">
                <span
                    className="hud-tag"
                    style={{
                        color: metric.accentVar,
                        borderColor: `color-mix(in srgb, ${metric.accentVar} 35%, transparent)`,
                        backgroundColor: `color-mix(in srgb, ${metric.accentVar} 10%, transparent)`,
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metric.accentVar }} />
                    {metric.category}
                </span>
            </div>

            {/* Oversized counter — the hero of the card */}
            <div className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-none mb-2 flex items-baseline gap-0.5">
                {metric.prefix && (
                    <span className="text-2xl md:text-3xl font-display font-bold" style={{ color: metric.accentVar }}>
                        {metric.prefix}
                    </span>
                )}
                <span className="text-foreground font-display font-extrabold">{isInView ? count : 0}</span>
                {metric.suffix && (
                    <span className="text-xl md:text-2xl font-display font-bold" style={{ color: metric.accentVar }}>
                        {metric.suffix}
                    </span>
                )}
            </div>

            {/* Label */}
            <p className="text-xs text-muted-foreground leading-snug font-medium font-display tracking-tight">
                {metric.label}
            </p>
        </div>
    );
});
