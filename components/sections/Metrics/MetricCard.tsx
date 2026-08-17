"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import type { MetricItem } from "./metrics.data";

interface MetricCardProps {
    metric: MetricItem;
    isInView: boolean;
    onSelect?: (metric: MetricItem) => void;
}

export const MetricCard = memo(function MetricCard({
    metric,
    isInView,
    onSelect,
}: MetricCardProps) {
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isInView || hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 1500; // ms
        const target = metric.value;
        const startTime = performance.now();
        let rafId: number | null = null;

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic formula
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeProgress * target);

            setCount(currentCount);

            if (progress < 1) {
                rafId = requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        rafId = requestAnimationFrame(animate);
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [isInView, metric.value]);

    return (
        <div
            className="metric-card-rail group relative rounded-r-xl p-5 transition-all duration-300 hover:bg-muted/20"
            style={{ borderLeftColor: `color-mix(in srgb, ${metric.accentVar} 55%, transparent)` }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderLeftColor = metric.accentVar;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderLeftColor = `color-mix(in srgb, ${metric.accentVar} 55%, transparent)`;
            }}
        >
            {/* ── Mobile Trigger (< sm) ── */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(metric);
                }}
                aria-label={`Inspect ${metric.label} evidence`}
                className="sm:hidden absolute top-2 -right-4 z-10 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:text-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:scale-110"
            >
                <span
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-border/50 bg-background/60 backdrop-blur-md shadow-sm transition-all duration-200 hover:border-foreground/40 hover:bg-background/90"
                    style={{
                        borderColor: `color-mix(in srgb, ${metric.accentVar} 40%, transparent)`,
                    }}
                >
                    <Info
                        className="h-4 w-4 shrink-0"
                        style={{ color: metric.accentVar }}
                        aria-hidden="true"
                    />
                </span>
            </button>

            {/* ── Desktop Glass Capsule Pill Trigger (sm:) ── */}
            <div className="hidden sm:flex absolute top-3 right-3 z-10 items-center justify-center">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(metric);
                    }}
                    aria-label={`Inspect ${metric.label} evidence`}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-border/50 bg-background/60 px-2.5 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md shadow-sm transition-all duration-200 group-hover:border-foreground/30 group-hover:bg-background/90 group-hover:text-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{
                        borderColor: `color-mix(in srgb, ${metric.accentVar} 35%, transparent)`,
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                        style={{ backgroundColor: metric.accentVar }}
                    />
                    <span className="font-mono text-[10px] font-bold tracking-tight">INFO</span>
                    <Sparkles className="h-3 w-3 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: metric.accentVar }} aria-hidden="true" />
                </button>
            </div>

            {/* Category label — HUD tag */}
            <div className="mb-3 pr-10">
                <span
                    className="hud-tag inline-flex items-center gap-1.5 max-w-full truncate"
                    style={{
                        color: metric.accentVar,
                        borderColor: `color-mix(in srgb, ${metric.accentVar} 35%, transparent)`,
                        backgroundColor: `color-mix(in srgb, ${metric.accentVar} 10%, transparent)`,
                    }}
                >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: metric.accentVar }} />
                    <span className="truncate">{metric.category}</span>
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
            <p className="text-xs text-muted-foreground leading-snug font-medium font-display tracking-tight group-hover:text-foreground transition-colors">
                {metric.label}
            </p>
        </div>
    );
});
