"use client";

import { Terminal, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export function TerminalWindow({ terminal }: { terminal: any }) {
    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const cmd = terminal.userInput.trim().toLowerCase();
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
                    terminal.setHistory([]);
                    terminal.setUserInput("");
                    return;
                case "":
                    output = "";
                    break;
                default:
                    output = <span className="text-red-500 text-left block break-words">Command not found: {cmd}. Type 'help' for available commands.</span>;
            }

            terminal.setHistory((prev: any) => [...prev, { id: Date.now(), command: terminal.userInput, output }]);
            terminal.setUserInput("");
            terminal.playKeystroke();
        }
    };

    const wrapperClasses = terminal.isFullScreen
        ? "fixed inset-0 z-50 w-full h-full rounded-none bg-[#0D1117] flex flex-col text-left transform-gpu"
        : cn(
            "w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-border/50 bg-[#0D1117]/95 backdrop-blur-xl shadow-2xl dark:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] mb-8 text-left transition-[transform,opacity,filter] duration-500 transform-gpu will-change-[transform,opacity,filter]",
            terminal.isMinimized ? "scale-90 opacity-50 grayscale" : "scale-100 opacity-100 grayscale-0"
        );

    const bodyClasses = terminal.isFullScreen
        ? "p-4 md:p-8 space-y-4 text-gray-300 flex-1 overflow-y-auto overflow-x-hidden break-words scroll-smooth terminal-scrollbar text-lg flex flex-col items-start w-full transform-gpu"
        : "p-4 md:p-6 space-y-3 text-gray-300 h-[300px] overflow-y-auto overflow-x-hidden break-words scroll-smooth terminal-scrollbar text-xs md:text-sm flex flex-col items-start w-full transform-gpu";

    return (
        <article className={wrapperClasses}>
            <header className="flex items-center justify-between px-4 py-3 bg-[#161B22] border-b border-gray-800">
                <div className="flex gap-1">
                    <button type="button" aria-label="Close Terminal" onClick={() => terminal.setIsClosed(true)} className="relative flex items-center justify-center p-2 hover:bg-white/5 rounded-md group outline-none transform-gpu">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-400 transition-colors flex items-center justify-center group-focus:ring-2 group-focus:ring-red-400">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black" aria-hidden="true">x</span>
                        </div>
                    </button>
                    <button type="button" aria-label="Minimize Terminal" onClick={() => terminal.setIsMinimized(!terminal.isMinimized)} className="relative flex items-center justify-center p-2 hover:bg-white/5 rounded-md group outline-none transform-gpu">
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-400 transition-colors flex items-center justify-center group-focus:ring-2 group-focus:ring-yellow-400">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black" aria-hidden="true">-</span>
                        </div>
                    </button>
                    <button type="button" aria-label="Maximize Terminal" onClick={() => { terminal.setIsFullScreen(!terminal.isFullScreen); terminal.setIsMinimized(false); }} className="relative flex items-center justify-center p-2 hover:bg-white/5 rounded-md group outline-none transform-gpu">
                        <div className="w-3 h-3 rounded-full bg-green-500/80 group-hover:bg-green-400 transition-colors flex items-center justify-center group-focus:ring-2 group-focus:ring-green-400">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black" aria-hidden="true">+</span>
                        </div>
                    </button>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-sans select-none" aria-hidden="true">
                    <Terminal className="w-4 h-4" /> ali-os — bash
                </div>
                <button type="button" aria-label={terminal.isMuted ? "Unmute Terminal" : "Mute Terminal"} onClick={() => terminal.setIsMuted(!terminal.isMuted)} className="text-gray-400 hover:text-white transition-colors border-none outline-none focus:ring-2 focus:ring-gray-400 rounded-sm transform-gpu">
                    {terminal.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
            </header>

            <div ref={terminal.terminalContainerRef} className={bodyClasses} role="log" aria-live="polite">
                {terminal.step >= 1 && (
                    <div className="flex items-start gap-2 w-full text-left">
                        <span className="text-green-500 dark:text-green-400 font-bold shrink-0">root@ali-haggag:~$</span>
                        <span className="text-white">whoami</span>
                    </div>
                )}
                {terminal.step >= 2 && (
                    <div className="pl-4 border-l-2 border-blue-500/30 ml-2 animate-fade-in w-full text-left break-words transform-gpu will-change-[opacity,transform]">
                        <span className="text-white font-bold text-lg glitch-text" data-text="Ali Haggag">Ali Haggag</span> <br />
                        <span className="text-blue-300">Full-Stack Software Engineer | Real-time Systems Architect</span>
                    </div>
                )}
                {terminal.step >= 3 && (
                    <div className="flex items-start gap-2 mt-4 w-full text-left">
                        <span className="text-green-500 dark:text-green-400 font-bold shrink-0">root@ali-haggag:~$</span>
                        <span className="text-white">npm run start:prod</span>
                    </div>
                )}
                {terminal.step >= 4 && (
                    <div className="text-emerald-300 pl-4 border-l-2 border-emerald-500/30 ml-2 animate-fade-in space-y-1 w-full text-left break-words transform-gpu will-change-[opacity,transform]">
                        <div>{`> alihaggag-portfolio@2.0.0 start:prod`}</div>
                        <div>{`> node dist/server.js`}</div>
                        <div className="text-blue-300">[Server] Running on port 3000...</div>
                        <div className="text-green-400">[MongoDB] Connected successfully to Cluster0</div>
                    </div>
                )}
                {terminal.step >= 5 && (
                    <div className="flex items-start gap-2 mt-4 w-full text-left">
                        <span className="text-green-500 dark:text-green-400 font-bold shrink-0">root@ali-haggag:~$</span>
                        <span className="text-white">ping db.alihaggag.com -c 1</span>
                    </div>
                )}
                {terminal.step >= 6 && (
                    <div className="text-yellow-300 pl-4 border-l-2 border-yellow-500/30 ml-2 animate-fade-in w-full text-left break-words transform-gpu will-change-[opacity,transform]">
                        PING db.alihaggag.com (104.21.2.22): 56 data bytes <br />
                        64 bytes from 104.21.2.22: icmp_seq=0 ttl=58 time=<span className="text-emerald-400 font-bold">1.02 ms</span> <br />
                        <span className="text-gray-400 text-xs">--- Database Connection Verified ---</span>
                    </div>
                )}
                {terminal.history.map((item: any) => (
                    <div key={item.id} className="mt-4 w-full text-left">
                        <div className="flex items-start gap-2">
                            <span className="text-green-500 dark:text-green-400 font-bold shrink-0">guest@ali-haggag:~$</span>
                            <span className="text-white break-all">{item.command}</span>
                        </div>
                        {item.output && (
                            <div className="pl-4 mt-1 border-l-2 border-gray-600/30 ml-2 animate-fade-in w-full break-words transform-gpu will-change-[opacity,transform]">
                                {item.output}
                            </div>
                        )}
                    </div>
                ))}
                {terminal.step >= 7 && !terminal.isMinimized && (
                    <div className="flex items-center gap-2 mt-4 animate-fade-in w-full text-left transform-gpu will-change-[opacity,transform]">
                        <label htmlFor="terminal-input" className="sr-only">Terminal command input</label>
                        <span className="text-green-500 dark:text-green-400 font-bold shrink-0" aria-hidden="true">guest@ali-haggag:~$</span>
                        <input
                            id="terminal-input"
                            type="text"
                            value={terminal.userInput}
                            onChange={(e) => {
                                terminal.setUserInput(e.target.value);
                                terminal.playKeystroke();
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
    );
}