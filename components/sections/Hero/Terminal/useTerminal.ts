"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type TerminalState = {
    step: number;
    isMuted: boolean;
    setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
    isClosed: boolean;
    setIsClosed: React.Dispatch<React.SetStateAction<boolean>>;
    isFullScreen: boolean;
    setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
    isMinimized: boolean;
    setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
    playKeystroke: () => void;
    startBootSequence: () => void;
    skipBootSequence: () => void;
};

const BOOT_DELAYS = [50, 150, 400, 650, 900, 1150, 1400] as const;

export function useTerminal(): TerminalState {
    const [step, setStep] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    // UI States
    const [isClosed, setIsClosed] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const bootTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    // Stable ref to prevent layout thrashing and stale closures
    const isMutedRef = useRef(isMuted);
    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    const playKeystroke = useCallback(() => {
        if (isMutedRef.current) return;

        try {
            if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                if (!AudioCtx) return;
                audioCtxRef.current = new AudioCtx();
            }

            const ctx = audioCtxRef.current;
            if (ctx.state === "suspended") ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(300 + Math.random() * 100, ctx.currentTime);

            gain.gain.setValueAtTime(0.02, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);

            osc.onended = () => {
                osc.disconnect();
                gain.disconnect();
            };
        } catch {
            // Fail silently if browser blocks audio context
        }
    }, []);

    const startBootSequence = useCallback(() => {
        bootTimersRef.current.forEach(clearTimeout);
        bootTimersRef.current = [];

        setStep(0);
        setIsClosed(false);
        setIsFullScreen(false);
        setIsMinimized(false);

        bootTimersRef.current = BOOT_DELAYS.map((delay, i) =>
            setTimeout(() => {
                setStep(i + 1);
                playKeystroke();
            }, delay)
        );
    }, [playKeystroke]);

    const skipBootSequence = useCallback(() => {
        bootTimersRef.current.forEach(clearTimeout);
        bootTimersRef.current = [];
        setStep(7);
    }, []);

    useEffect(() => {
        return () => {
            bootTimersRef.current.forEach(clearTimeout);
            if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
                audioCtxRef.current.close();
            }
        };
    }, []);

    return {
        step,
        isMuted,
        setIsMuted,
        isClosed,
        setIsClosed,
        isFullScreen,
        setIsFullScreen,
        isMinimized,
        setIsMinimized,
        playKeystroke,
        startBootSequence,
        skipBootSequence,
    };
}