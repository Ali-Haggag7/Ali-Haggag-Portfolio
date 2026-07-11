"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { ContributionDay } from "@/lib/github";
import { useIsMobile } from "@/hooks/useIsMobile";

const COLS = 12;
const ROWS = 7;

// Map a contribution count to one of 5 intensity steps (CSS vars).
function intensityVar(count: number, max: number): string {
    if (count <= 0) return "var(--heatmap-0)";
    if (max <= 0) return "var(--heatmap-0)";
    const ratio = count / max;
    if (ratio > 0.75) return "var(--heatmap-4)";
    if (ratio > 0.5) return "var(--heatmap-3)";
    if (ratio > 0.25) return "var(--heatmap-2)";
    return "var(--heatmap-1)";
}

const relFmt = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function formatRelative(iso: string): string {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return "";
    const diffSec = Math.round((then - Date.now()) / 1000);
    const abs = Math.abs(diffSec);
    if (abs < 60) return relFmt.format(Math.round(diffSec), "second");
    if (abs < 3600) return relFmt.format(Math.round(diffSec / 60), "minute");
    if (abs < 86400) return relFmt.format(Math.round(diffSec / 3600), "hour");
    return relFmt.format(Math.round(diffSec / 86400), "day");
}

function formatDate(dateStr: string): string {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthName = months[monthIndex] || parts[1];
    return `${monthName} ${day}, ${year}`;
}

function LastSynced({ lastSynced }: { lastSynced: string }) {
    const [label, setLabel] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        const update = () => setLabel(formatRelative(lastSynced));

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    update();
                    interval = setInterval(update, 30000);
                } else {
                    clearInterval(interval);
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, [lastSynced]);

    return (
        <div ref={containerRef} className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: "var(--color-live-light)" }}
                />
                <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ backgroundColor: "var(--color-live)" }}
                />
            </span>
            <span className="text-[11px] text-muted-foreground">
                {label ? `Synced ${label}` : "Syncing…"}
            </span>
        </div>
    );
}

interface Props {
    recentDays: ContributionDay[];
    lastSynced: string;
}

export function ContributionHeatmap({ recentDays, lastSynced }: Props) {
    const isMobile = useIsMobile();
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    const { cells, total, max, mostActive } = useMemo(() => {
        const slice = recentDays.slice(-(COLS * ROWS));
        const totalCount = slice.reduce((acc, d) => acc + d.count, 0);
        const maxCount = slice.reduce((acc, d) => Math.max(acc, d.count), 0);
        const peak = slice.reduce<ContributionDay | null>(
            (best, d) => (best === null || d.count > best.count ? d : best),
            null
        );
        return {
            cells: slice,
            total: totalCount,
            max: maxCount,
            mostActive: peak,
        };
    }, [recentDays]);

    const ariaLabel = `Contribution activity over the last 12 weeks, totaling ${total} contributions${
        mostActive && mostActive.count > 0
            ? `, most active day ${mostActive.date} with ${mostActive.count} contributions`
            : ""
    }.`;

    return (
        <div
            className={`rounded-xl p-4 bg-foreground/3 dark:bg-white/3 border !border-foreground/6 dark:border-white/6 card-glow${
                isMobile ? "" : " animate-fade-in"
            }`}
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    Contribution Activity
                </p>
                <LastSynced lastSynced={lastSynced} />
            </div>

            <div
                role="img"
                aria-label={ariaLabel}
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            >
                {cells.map((day, idx) => {
                    const isTooltipActive = activeTooltip === day.date;
                    const colIndex = idx % COLS;
                    return (
                        <div
                            key={day.date}
                            onClick={() => {
                                setActiveTooltip(activeTooltip === day.date ? null : day.date);
                            }}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="relative group aspect-square rounded-[2px]"
                            style={{ backgroundColor: intensityVar(day.count, max) }}
                        >
                            {/* Custom Tooltip Arrow */}
                            <div
                                data-active={isTooltipActive}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-1.5 h-1.5 bg-popover border-r border-b border-border rotate-45 pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 data-[active=true]:opacity-100 data-[active=true]:scale-100 transition-all duration-150 ease-out origin-bottom z-50"
                            />

                            {/* Custom Tooltip Bubble */}
                            <div
                                data-active={isTooltipActive}
                                className={`absolute bottom-full mb-2.5 pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 data-[active=true]:opacity-100 data-[active=true]:scale-100 transition-all duration-150 ease-out z-50 bg-popover/95 border border-border text-popover-foreground text-[10px] font-semibold px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-xl flex items-center gap-1.5 backdrop-blur-sm ${
                                    colIndex < 2
                                        ? "left-0 origin-bottom-left"
                                        : colIndex >= COLS - 2
                                        ? "right-0 origin-bottom-right"
                                        : "left-1/2 -translate-x-1/2 origin-bottom"
                                }`}
                            >
                                <span
                                    className="w-2 h-2 rounded-full aspect-square shrink-0"
                                    style={{ backgroundColor: intensityVar(day.count, max) }}
                                />
                                <span>
                                    {day.count} {day.count === 1 ? "contribution" : "contributions"} on {formatDate(day.date)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
