"use client";

import { useState, useEffect, useRef } from "react";
import { Code2, ExternalLink, Terminal, Volume2, VolumeX, RotateCcw } from "lucide-react";
import MagicButton from "./magic-button";

type HistoryItem = { id: number; command: string; output: React.ReactNode };

export default function HeroSection() {
    const [step, setStep] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const [isClosed, setIsClosed] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const terminalContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new output or step change
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

    // Start boot sequence on mount
    useEffect(() => {
        const timers = startBootSequence();
        return () => timers.forEach(clearTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const cmd = userInput.trim().toLowerCase();
            let output: React.ReactNode = "";

            switch (cmd) {
                case "help":
                    output = (
                        <div className="text-gray-400 text-left">
                            Available commands: <br />
                            <span className="text-yellow-300">whoami</span>   - Display identity <br />
                            <span className="text-yellow-300">projects</span> - List current missions <br />
                            <span className="text-yellow-300">skills</span>   - Show technical arsenal <br />
                            <span className="text-yellow-300">clear</span>    - Clear terminal
                        </div>
                    );
                    break;
                case "whoami":
                    output = <span className="text-blue-400 text-left block break-words">Ali Haggag | Full-Stack Software Engineer & Real-time Architect</span>;
                    break;
                case "projects":
                    output = (
                        <div className="text-gray-300 text-left break-words">
                            <span className="text-purple-400">1. CS-Arena:</span> Developer Ecosystem (Next.js 16) <br />
                            <span className="text-purple-400">2. Flurry v2.0:</span> Real-time Social Super App (WebRTC/Socket.io) <br />
                            <span className="text-purple-400">3. Cybership:</span> Integration API (DDD/TypeScript)
                        </div>
                    );
                    break;
                case "skills":
                    output = <span className="text-emerald-400 text-left block break-words">Next.js, TypeScript, WebRTC, Socket.io, Node.js, Prisma, GraphQL, PWA</span>;
                    break;
                case "sudo":
                    output = <span className="text-red-600 dark:text-red-500 glitch-text text-left block break-words" data-text="Nice try, recruiter. Access Denied.">Nice try, recruiter. Access Denied.</span>;
                    break;
                case "clear":
                    setHistory([]);
                    setUserInput("");
                    return;
                case "":
                    output = "";
                    break;
                default:
                    output = <span className="text-red-500 text-left block break-words">Command not found: {cmd}. Type 'help' for available commands.</span>;
            }

            setHistory(prev => [...prev, { id: Date.now(), command: userInput, output }]);
            setUserInput("");
            playKeystroke();
        }
    };

    if (isClosed) {
        return (
            <section aria-label="System Offline State" className="relative z-10 flex min-h-[90vh] w-full flex-col items-center justify-center pt-24 pb-12 text-center px-4 animate-fade-in">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/20 dark:bg-red-600/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
                <h2 className="text-3xl md:text-5xl font-bold text-red-700 dark:text-red-500 mb-6 font-mono glitch-text" data-text="SYSTEM OFFLINE">SYSTEM OFFLINE</h2>
                <button
                    type="button"
                    onClick={() => { startBootSequence(); }}
                    aria-label="Reboot System"
                    className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                    <RotateCcw className="w-5 h-5" aria-hidden="true" /> Reboot System
                </button>
            </section>
        );
    }

    const terminalWrapperClasses = isFullScreen
        ? "fixed inset-0 z-50 w-full h-full rounded-none bg-[#0D1117] flex flex-col text-left"
        : `w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-border/50 bg-[#0D1117]/95 backdrop-blur-xl shadow-2xl dark:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] mb-8 transition-all duration-500 text-left ${isMinimized ? "scale-90 opacity-50 grayscale" : "scale-100 opacity-100"}`;

    const terminalBodyClasses = isFullScreen
        ? "p-4 md:p-8 space-y-4 text-gray-300 flex-1 overflow-y-auto overflow-x-hidden break-words scroll-smooth terminal-scrollbar text-lg flex flex-col items-start w-full"
        : "p-4 md:p-6 space-y-3 text-gray-300 h-[300px] overflow-y-auto overflow-x-hidden break-words scroll-smooth terminal-scrollbar text-xs md:text-sm flex flex-col items-start w-full";

    return (
        <section aria-label="Hero Section Terminal" className="relative z-10 flex min-h-[90vh] w-full flex-col items-center justify-center pt-24 pb-12 px-4">

            {!isFullScreen && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[400px] bg-linear-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
            )}

            {!isFullScreen && (
                <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-md px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted/50 cursor-default animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500"></span>
                    </span>
                    System Online & Ready for Deployment
                </div>
            )}

            <article className={terminalWrapperClasses}>

                <header className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-gray-800">
                    <div className="flex gap-1">
                        {/* Close Button */}
                        <button type="button" aria-label="Close Terminal" onClick={() => setIsClosed(true)} className="relative flex items-center justify-center p-2 hover:bg-white/5 rounded-md group outline-none">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-400 transition-colors flex items-center justify-center group-focus:ring-2 group-focus:ring-red-400">
                                <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black" aria-hidden="true">x</span>
                            </div>
                        </button>

                        {/* Minimize Button */}
                        <button type="button" aria-label="Minimize Terminal" onClick={() => setIsMinimized(!isMinimized)} className="relative flex items-center justify-center p-2 hover:bg-white/5 rounded-md group outline-none">
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-400 transition-colors flex items-center justify-center group-focus:ring-2 group-focus:ring-yellow-400">
                                <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black" aria-hidden="true">-</span>
                            </div>
                        </button>

                        {/* Maximize Button */}
                        <button type="button" aria-label="Maximize Terminal" onClick={() => { setIsFullScreen(!isFullScreen); setIsMinimized(false); }} className="relative flex items-center justify-center p-2 hover:bg-white/5 rounded-md group outline-none">
                            <div className="w-3 h-3 rounded-full bg-green-500/80 group-hover:bg-green-400 transition-colors flex items-center justify-center group-focus:ring-2 group-focus:ring-green-400">
                                <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black" aria-hidden="true">+</span>
                            </div>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-sans select-none" aria-hidden="true">
                        <Terminal className="w-4 h-4" /> ali-os — bash
                    </div>
                    <button type="button" aria-label={isMuted ? "Unmute Terminal" : "Mute Terminal"} onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white transition-colors border-none outline-none focus:ring-2 focus:ring-gray-400 rounded-sm">
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                </header>

                <div ref={terminalContainerRef} className={terminalBodyClasses} role="log" aria-live="polite">

                    {step >= 1 && (
                        <div className="flex items-start gap-2 w-full text-left">
                            <span className="text-green-500 dark:text-green-400 font-bold shrink-0">root@ali-haggag:~$</span>
                            <span className="text-white">whoami</span>
                        </div>
                    )}
                    {step >= 2 && (
                        <div className="pl-4 border-l-2 border-blue-500/30 ml-2 animate-fade-in w-full text-left break-words">
                            <span className="text-white font-bold text-lg glitch-text" data-text="Ali Haggag">Ali Haggag</span> <br />
                            <span className="text-blue-300">Full-Stack Software Engineer | Real-time Systems Architect</span>
                        </div>
                    )}

                    {step >= 3 && (
                        <div className="flex items-start gap-2 mt-4 w-full text-left">
                            <span className="text-green-500 dark:text-green-400 font-bold shrink-0">root@ali-haggag:~$</span>
                            <span className="text-white">npm run start:prod</span>
                        </div>
                    )}
                    {step >= 4 && (
                        <div className="text-emerald-300 pl-4 border-l-2 border-emerald-500/30 ml-2 animate-fade-in space-y-1 w-full text-left break-words">
                            <div>{`> alihaggag-portfolio@2.0.0 start:prod`}</div>
                            <div>{`> node dist/server.js`}</div>
                            <div className="text-blue-300">[Server] Running on port 3000...</div>
                            <div className="text-green-400">[MongoDB] Connected successfully to Cluster0</div>
                        </div>
                    )}

                    {step >= 5 && (
                        <div className="flex items-start gap-2 mt-4 w-full text-left">
                            <span className="text-green-500 dark:text-green-400 font-bold shrink-0">root@ali-haggag:~$</span>
                            <span className="text-white">ping db.alihaggag.com -c 1</span>
                        </div>
                    )}
                    {step >= 6 && (
                        <div className="text-yellow-300 pl-4 border-l-2 border-yellow-500/30 ml-2 animate-fade-in w-full text-left break-words">
                            PING db.alihaggag.com (104.21.2.22): 56 data bytes <br />
                            64 bytes from 104.21.2.22: icmp_seq=0 ttl=58 time=<span className="text-emerald-400 font-bold">1.02 ms</span> <br />
                            <span className="text-gray-400 text-xs">--- Database Connection Verified ---</span>
                        </div>
                    )}

                    {history.map((item) => (
                        <div key={item.id} className="mt-4 w-full text-left">
                            <div className="flex items-start gap-2">
                                <span className="text-green-500 dark:text-green-400 font-bold shrink-0">guest@ali-haggag:~$</span>
                                <span className="text-white break-all">{item.command}</span>
                            </div>
                            {item.output && (
                                <div className="pl-4 mt-1 border-l-2 border-gray-600/30 ml-2 animate-fade-in w-full break-words">
                                    {item.output}
                                </div>
                            )}
                        </div>
                    ))}

                    {step >= 7 && !isMinimized && (
                        <div className="flex items-center gap-2 mt-4 animate-fade-in w-full text-left">
                            <label htmlFor="terminal-input" className="sr-only">Terminal command input</label>
                            <span className="text-green-500 dark:text-green-400 font-bold shrink-0" aria-hidden="true">guest@ali-haggag:~$</span>
                            <input
                                id="terminal-input"
                                type="text"
                                value={userInput}
                                onChange={(e) => {
                                    setUserInput(e.target.value);
                                    playKeystroke();
                                }}
                                onKeyDown={handleCommand}
                                className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-gray-600"
                                placeholder="Type 'help' to see available commands..."
                                spellCheck="false"
                            />
                        </div>
                    )}
                </div>
            </article>

            {!isFullScreen && (
                <nav aria-label="Hero Action Links" className={`flex flex-wrap justify-center items-center gap-4 md:gap-5 relative z-20 transition-all duration-1000 ${step >= 7 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                    <a
                        href="https://github.com/Ali-Haggag7"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Ali Haggag's GitHub Profile"
                        className="group relative flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-foreground text-background rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.6)] active:scale-95"
                    >
                        <Code2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/ali-haggag7/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Ali Haggag's LinkedIn Profile"
                        className="group flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 border-2 border-border bg-card/50 backdrop-blur-sm text-foreground rounded-full font-bold transition-all duration-300 hover:bg-blue-500/5 hover:border-blue-500/50 hover:text-blue-500 active:scale-95 shadow-sm"
                    >
                        <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                        LinkedIn
                    </a>
                    <div className="active:scale-95 transition-transform duration-300 hover:scale-105">
                        <MagicButton />
                    </div>
                </nav>
            )}
        </section>
    );
}