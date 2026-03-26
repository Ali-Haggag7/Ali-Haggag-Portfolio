"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

export function LocalTime() {
    const [time, setTime] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;

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

        // PERF: Only start the clock when the footer is visible on screen!
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    updateTime();
                    interval = setInterval(updateTime, 1000);
                } else {
                    clearInterval(interval);
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    if (!time) {
        return (
            <div ref={containerRef} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border/50">
                <span className="w-20 h-4 bg-muted-foreground/20 animate-pulse rounded-md" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            Qena, EG • {time}
        </div>
    );
}