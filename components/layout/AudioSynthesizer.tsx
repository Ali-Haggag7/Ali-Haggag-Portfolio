"use client";

import { useState, useCallback, useRef, memo } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const AudioSynthesizer = memo(function AudioSynthesizer() {
    const [audioEnabled, setAudioEnabled] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (!audioCtxRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AudioContextClass();
        }
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }
    }, []);

    const playClickSound = useCallback(() => {
        if (!audioEnabled || !audioCtxRef.current) return;

        try {
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.045, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch {
            // Web Audio fallback
        }
    }, [audioEnabled]);

    const toggleAudio = useCallback(() => {
        initAudio();
        setAudioEnabled((prev) => {
            const next = !prev;
            if (next) playClickSound();
            return next;
        });
    }, [initAudio, playClickSound]);

    return (
        <button
            type="button"
            onClick={toggleAudio}
            title={audioEnabled ? "Disable Web Audio Spatial Effects" : "Enable Web Audio Spatial Effects"}
            aria-label="Toggle Web Audio"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/80 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {audioEnabled ? (
                <Volume2 className="h-4 w-4 text-[hsl(var(--accent-emerald))] animate-pulse" aria-hidden="true" />
            ) : (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
            )}
        </button>
    );
});
