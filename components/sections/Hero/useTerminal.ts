"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type HistoryItem = { id: number; command: string; output: React.ReactNode };

const BOOT_DELAYS = [100, 300, 1000, 1500, 2200, 2800, 3300] as const;

export function useTerminal() {
    const [step, setStep] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isClosed, setIsClosed] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const terminalContainerRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    // Ref mirror of isMuted so playKeystroke never stales over closure.
    const isMutedRef = useRef(isMuted);
    const bootTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

    const playKeystroke = useCallback(() => {
        if (isMutedRef.current) return;
        try {
            if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
                const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                audioCtxRef.current = new AudioCtx();
            }
            if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();

            const ctx = audioCtxRef.current;
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
            // Disconnect nodes after they've finished to avoid memory accumulation.
            osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        } catch {
            // Audio not available — fail silently.
        }
    }, []);

    const startBootSequence = useCallback(() => {
        // Clear any in-flight timers before re-booting (e.g. user spams reboot).
        bootTimersRef.current.forEach(clearTimeout);
        bootTimersRef.current = [];

        setStep(0);
        setHistory([]);
        setIsClosed(false);
        setIsFullScreen(false);
        setIsMinimized(false);

        bootTimersRef.current = BOOT_DELAYS.map((delay, i) =>
            setTimeout(() => { setStep(i + 1); playKeystroke(); }, delay)
        );
    }, [playKeystroke]);

    // RAF-based auto-scroll — skips a paint cycle to let DOM update first.
    useEffect(() => {
        const el = terminalContainerRef.current;
        if (!el) return;
        const raf = requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
        return () => cancelAnimationFrame(raf);
    }, [step, history]);

    useEffect(() => {
        startBootSequence();
        return () => {
            bootTimersRef.current.forEach(clearTimeout);
            if (audioCtxRef.current?.state !== "closed") audioCtxRef.current?.close();
        };
    }, [startBootSequence]);

    return {
        step, isMuted, setIsMuted,
        userInput, setUserInput,
        history, setHistory,
        isClosed, setIsClosed,
        isFullScreen, setIsFullScreen,
        isMinimized, setIsMinimized,
        terminalContainerRef,
        playKeystroke,
        startBootSequence,
    };
}