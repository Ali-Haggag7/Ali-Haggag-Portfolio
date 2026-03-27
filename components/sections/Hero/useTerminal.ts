"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type HistoryItem = { id: number; command: string; output: React.ReactNode };

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
    const isMutedRef = useRef(isMuted);

    // PERF: Reference to track active timeouts and prevent memory leaks
    const bootTimersRef = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    const playKeystroke = useCallback(() => {
        if (isMutedRef.current) return;
        try {
            if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                audioCtxRef.current = new AudioCtx();
            }

            // Handle browser auto-mute policies smoothly
            if (audioCtxRef.current.state === "suspended") {
                audioCtxRef.current.resume();
            }

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

            osc.onended = () => {
                osc.disconnect();
                gain.disconnect();
            };
        } catch {
            // Audio not supported - silent fail
        }
    }, []);

    const startBootSequence = useCallback(() => {
        // BUG FIX: Clear any existing timeouts before starting a new boot sequence
        // This prevents chaotic state updates if the user spams the "Reboot" button
        bootTimersRef.current.forEach(clearTimeout);
        bootTimersRef.current = [];

        setStep(0);
        setHistory([]);
        setIsClosed(false);
        setIsFullScreen(false);
        setIsMinimized(false);

        const delays = [100, 300, 1000, 1500, 2200, 2800, 3300];
        delays.forEach((delay, i) => {
            const timer = setTimeout(() => {
                setStep(i + 1);
                playKeystroke();
            }, delay);
            bootTimersRef.current.push(timer);
        });
    }, [playKeystroke]);

    // High performance auto-scroll
    useEffect(() => {
        const el = terminalContainerRef.current;
        if (!el) return;
        const raf = requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
        });
        return () => cancelAnimationFrame(raf);
    }, [step, history]);

    // Component Mount/Unmount lifecycle
    useEffect(() => {
        startBootSequence();

        // Cleanup all memory resources when leaving the page
        return () => {
            bootTimersRef.current.forEach(clearTimeout);
            if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
                audioCtxRef.current.close();
            }
        };
    }, [startBootSequence]);

    return {
        step,
        isMuted,
        setIsMuted,
        userInput,
        setUserInput,
        history,
        setHistory,
        isClosed,
        setIsClosed,
        isFullScreen,
        setIsFullScreen,
        isMinimized,
        setIsMinimized,
        terminalContainerRef,
        playKeystroke,
        startBootSequence,
    };
}