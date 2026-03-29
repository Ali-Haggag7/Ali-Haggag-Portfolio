"use client";

import { Terminal, Volume2, VolumeX } from "lucide-react";
import { useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import type { TerminalState } from "./useTerminal";

const BootSequence = memo(function BootSequence({ step }: { step: number }) {
    return (
        <>
            {step >= 1 && (
                <div className="flex items-start gap-2 w-full">
                    <span className="text-green-500 font-bold shrink-0">root@ali-haggag:~$</span>
                    <span className="text-white">whoami</span>
                </div>
            )}
            {step >= 2 && (
                <div className="pl-4 border-l-2 border-blue-500/30 ml-2 w-full break-words">
                    <span className="text-white font-bold text-lg">Ali Haggag</span><br />
                    <span className="text-blue-300">Full-Stack Software Engineer | Real-time Systems Architect</span>
                </div>
            )}
            {step >= 3 && (
                <div className="flex items-start gap-2 mt-4 w-full">
                    <span className="text-green-500 font-bold shrink-0">root@ali-haggag:~$</span>
                    <span className="text-white">npm run start:prod</span>
                </div>
            )}
            {step >= 4 && (
                <div className="text-emerald-300 pl-4 border-l-2 border-emerald-500/30 ml-2 space-y-1 w-full break-words">
                    <div>{`> alihaggag-portfolio@2.0.0 start:prod`}</div>
                    <div>{`> node dist/server.js`}</div>
                    <div className="text-blue-300">[Server] Running on port 3000...</div>
                    <div className="text-green-400">[MongoDB] Connected successfully to Cluster0</div>
                </div>
            )}
            {step >= 5 && (
                <div className="flex items-start gap-2 mt-4 w-full">
                    <span className="text-green-500 font-bold shrink-0">root@ali-haggag:~$</span>
                    <span className="text-white">ping db.alihaggag.com -c 1</span>
                </div>
            )}
            {step >= 6 && (
                <div className="text-yellow-300 pl-4 border-l-2 border-yellow-500/30 ml-2 w-full break-words">
                    PING db.alihaggag.com (104.21.2.22): 56 data bytes<br />
                    64 bytes from 104.21.2.22: icmp_seq=0 ttl=58 time=<span className="text-emerald-400 font-bold">1.02 ms</span><br />
                    <span className="text-gray-400 text-xs">--- Database Connection Verified ---</span>
                </div>
            )}
        </>
    );
});

export const TerminalWindow = memo(function TerminalWindow({ terminal }: { terminal: TerminalState }) {
    const handleCommand = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;

        const cmd = terminal.userInput.trim().toLowerCase();
        let output: React.ReactNode = "";

        switch (cmd) {
            case "help":
                output = (
                    <div className="text-gray-400">
                        Available commands:<br />
                        <span className="text-yellow-300">whoami</span>   — Display identity<br />
                        <span className="text-yellow-300">projects</span> — List current missions<br />
                        <span className="text-yellow-300">skills</span>   — Show technical arsenal<br />
                        <span className="text-yellow-300">clear</span>    — Clear terminal
                    </div>
                );
                break;
            case "whoami":
                output = <span className="text-blue-400 block break-words">Ali Haggag | Full-Stack Software Engineer &amp; Real-time Architect</span>;
                break;
            case "projects":
                output = (
                    <div className="text-gray-300 break-words">
                        <span className="text-purple-400">1. CS-Arena:</span> Developer Ecosystem (Next.js 16)<br />
                        <span className="text-purple-400">2. Flurry v2.0:</span> Real-time Social Super App (WebRTC/Socket.io)<br />
                        <span className="text-purple-400">3. Cybership:</span> Integration API (DDD/TypeScript)
                    </div>
                );
                break;
            case "skills":
                output = <span className="text-emerald-400 block break-words">Next.js, TypeScript, WebRTC, Socket.io, Node.js, Prisma, GraphQL, PWA</span>;
                break;
            case "sudo":
                output = <span className="text-red-500 font-bold block break-words">Nice try, recruiter. Access Denied.</span>;
                break;
            case "clear":
                terminal.setHistory([]);
                terminal.setUserInput("");
                return;
            case "":
                output = "";
                break;
            default:
                output = <span className="text-red-500 block break-words">Command not found: {cmd}. Type &apos;help&apos; for available commands.</span>;
        }

        terminal.setHistory(prev => [...prev, { id: Date.now(), command: terminal.userInput, output }]);
        terminal.setUserInput("");
        terminal.playKeystroke();
    }, [terminal]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        terminal.setUserInput(e.target.value);
        terminal.playKeystroke();
    }, [terminal]);

    // Fixed architecture: Fullscreen escapes the parent container completely
    const wrapperClasses = terminal.isFullScreen
        ? "fixed inset-0 z-[100] bg-[#0D1117] flex flex-col text-left m-0 rounded-none border-none"
        : cn(
            "w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-border/50 bg-[#0D1117] shadow-xl mb-8 text-left flex flex-col",
            "transition-all duration-300 transform-gpu will-change-transform",
            // Priority: Close > Minimize > Normal
            terminal.isClosed
                ? "scale-95 opacity-0 pointer-events-none"
                : terminal.isMinimized
                    ? "scale-90 opacity-60 pointer-events-none" // Removed 'absolute' to maintain layout stability
                    : "scale-100 opacity-100 relative"
        );

    const bodyClasses = terminal.isFullScreen
        ? "p-4 md:p-8 space-y-4 text-gray-300 flex-1 overflow-y-auto overflow-x-hidden break-words terminal-scrollbar text-lg flex flex-col items-start w-full"
        : "p-4 md:p-6 space-y-3 text-gray-300 h-[300px] overflow-y-auto overflow-x-hidden break-words terminal-scrollbar text-xs md:text-sm flex flex-col items-start w-full";

    return (
        <article className={wrapperClasses}>
            <header className="flex items-center justify-between px-4 py-4 bg-[#161B22] border-b border-gray-800 shrink-0">
                <div className="flex gap-2">
                    <button
                        onClick={() => terminal.setIsClosed(true)}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors group outline-none"
                    >
                        <div className="w-3 h-3 rounded-full bg-red-500 relative flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black leading-none">x</span>
                        </div>
                    </button>
                    <button
                        onClick={() => terminal.setIsMinimized(p => !p)}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors group outline-none"
                    >
                        <div className="w-3 h-3 rounded-full bg-yellow-500 relative flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black leading-none">-</span>
                        </div>
                    </button>
                    <button
                        onClick={() => { terminal.setIsFullScreen(p => !p); terminal.setIsMinimized(false); }}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors group outline-none"
                    >
                        <div className="w-3 h-3 rounded-full bg-green-500 relative flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black leading-none">+</span>
                        </div>
                    </button>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-xs font-mono select-none">
                    <Terminal className="w-4 h-4" /> ali-os — bash
                </div>

                <button
                    onClick={() => terminal.setIsMuted(p => !p)}
                    className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded-sm"
                >
                    {terminal.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
            </header>

            <div ref={terminal.terminalContainerRef} className={bodyClasses}>
                <BootSequence step={terminal.step} />

                {terminal.history.map((item) => (
                    <div key={item.id} className="mt-4 w-full">
                        <div className="flex items-start gap-2">
                            <span className="text-green-500 font-bold shrink-0">guest@ali-haggag:~$</span>
                            <span className="text-white break-all">{item.command}</span>
                        </div>
                        {item.output && (
                            <div className="pl-4 mt-1 border-l-2 border-gray-600/30 ml-2 w-full break-words">
                                {item.output}
                            </div>
                        )}
                    </div>
                ))}

                {terminal.step >= 7 && (
                    <div className="flex items-center gap-2 mt-4 w-full">
                        <span className="text-green-500 font-bold shrink-0">guest@ali-haggag:~$</span>
                        <input
                            type="text"
                            value={terminal.userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleCommand}
                            className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-gray-500 focus:ring-0"
                            placeholder="Type 'help' to see available commands..."
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>
                )}
            </div>
        </article>
    );
});