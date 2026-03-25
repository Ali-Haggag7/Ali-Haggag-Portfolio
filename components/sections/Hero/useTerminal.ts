"use client";

import { useState, useEffect, useRef } from "react";

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

    useEffect(() => {
        if (terminalContainerRef.current) {
            terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
        }
    }, [step, history]);

    const playKeystroke = () => {
        if (isMuted) return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300 + Math.random() * 100, ctx.currentTime);
            gain.gain.setValueAtTime(0.02, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            console.log("Audio not supported");
        }
    };

    const startBootSequence = () => {
        setStep(0);
        setHistory([]);
        setIsClosed(false);
        setIsFullScreen(false);
        setIsMinimized(false);

        const timers = [
            setTimeout(() => { setStep(1); playKeystroke(); }, 100),
            setTimeout(() => { setStep(2); playKeystroke(); }, 300),
            setTimeout(() => { setStep(3); playKeystroke(); }, 1000),
            setTimeout(() => { setStep(4); playKeystroke(); }, 1500),
            setTimeout(() => { setStep(5); playKeystroke(); }, 2200),
            setTimeout(() => { setStep(6); playKeystroke(); }, 2800),
            setTimeout(() => { setStep(7); playKeystroke(); }, 3300),
        ];
        return timers;
    };

    useEffect(() => {
        const timers = startBootSequence();
        return () => timers.forEach(clearTimeout);
    }, []);

    return {
        step, isMuted, setIsMuted, userInput, setUserInput,
        history, setHistory, isClosed, setIsClosed,
        isFullScreen, setIsFullScreen, isMinimized, setIsMinimized,
        terminalContainerRef, playKeystroke, startBootSequence
    };
}