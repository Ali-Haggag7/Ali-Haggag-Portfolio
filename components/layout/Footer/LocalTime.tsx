"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

export function LocalTime() {
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

    if (!time) return <span className="w-20 h-5 bg-muted/50 animate-pulse rounded-full transform-gpu"></span>;

    return (
        <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm transform-gpu">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            Qena, EG • {time}
        </div>
    );
}