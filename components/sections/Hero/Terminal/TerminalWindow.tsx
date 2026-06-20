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

        const rawInput = terminal.userInput.trim();
        const parts = rawInput.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : "";
        let output: React.ReactNode = "";

        switch (cmd) {
            case "help":
                output = (
                    <div className="text-gray-400 font-mono space-y-1">
                        <div>Available commands:</div>
                        <div><span className="text-yellow-300">whoami</span>       - Display identity card</div>
                        <div><span className="text-yellow-300">skills</span>       - Show technical skills tree</div>
                        <div><span className="text-yellow-300">projects</span>     - List current projects</div>
                        <div><span className="text-yellow-300">cd &lt;project&gt;</span>  - Scroll to specific project section</div>
                        <div><span className="text-yellow-300">log</span>          - View engineering changelog</div>
                        <div><span className="text-yellow-300">neofetch</span>     - Show specifications and specs</div>
                        <div><span className="text-yellow-300">contact</span>      - Get contact coordinates</div>
                        <div><span className="text-yellow-300">sudo hire-me</span>  - Initialize recruiting protocol</div>
                        <div><span className="text-yellow-300">clear</span>        - Clear terminal screen</div>
                    </div>
                );
                break;
            case "whoami":
                output = (
                    <div className="text-blue-300 font-mono whitespace-pre-line leading-relaxed">
                        {`Identity ........ Ali Haggag
Role ............ Full-Stack Engineer / Systems Architect
Focus ........... Real-time systems, language design, performance engineering
Building now .... Logic Arena — competitive robot-programming platform
Notable ......... Designed & shipped AliScript — a custom language with a
                  full AST parser, from tokenizer to interpreter
Status .......... Available`}
                    </div>
                );
                break;
            case "skills":
                output = (
                    <div className="text-emerald-400 font-mono whitespace-pre leading-none text-xs md:text-sm">
{`┌─ FRONTEND ──────────────────────────────────
│ TypeScript         ████████████ Expert
│ Next.js 15         ███████████░ Advanced
│ React Three Fiber  ██████████░░ Advanced
│ Tailwind CSS       ████████████ Expert
├─ BACKEND ───────────────────────────────────
│ NestJS             ███████████░ Advanced
│ Socket.IO          ███████████░ Advanced
│ Prisma/PostgreSQL  ██████████░░ Advanced
│ Redis              █████████░░░ Proficient
├─ INFRA ─────────────────────────────────────
│ Docker             ██████████░░ Advanced
│ DigitalOcean       █████████░░░ Proficient
├─ LANGUAGE ENGINEERING ──────────────────────
│ AST Parsers        ██████████░░ Built AliScript from scratch
└─────────────────────────────────────────────`}
                    </div>
                );
                break;
            case "projects":
                output = (
                    <div className="text-gray-300 font-mono space-y-4">
                        <div>
                            <span className="text-purple-400 font-bold">[1] Logic Arena</span> — competitive robot-programming arena<br />
                            &nbsp;&nbsp;Stack: Next.js 15 · NestJS · React Three Fiber · Socket.IO · Prisma/PostgreSQL · Redis · Docker<br />
                            &nbsp;&nbsp;→ Custom language &quot;AliScript&quot; — full AST parser built from scratch<br />
                            &nbsp;&nbsp;→ 60-level campaign engine, audited &amp; fixed 7 AI logic mismatches<br />
                            &nbsp;&nbsp;→ Real-time server-authoritative pause (timestamp-safe across hitWall/shield/mine timers)<br />
                            &nbsp;&nbsp;→ Replay system — play / pause / seek / speed controls<br />
                            &nbsp;&nbsp;<span className="text-blue-300 font-bold">$ cd logic-arena</span>
                        </div>
                        <div>
                            <span className="text-purple-400 font-bold">[2] Portfolio</span> — this site<br />
                            &nbsp;&nbsp;Stack: Next.js 15 · Tailwind CSS · Framer Motion<br />
                            &nbsp;&nbsp;→ &quot;Battle Scars&quot; — 21 real production incidents, fully documented<br />
                            &nbsp;&nbsp;→ You&apos;re literally inside it right now (AliOS terminal)<br />
                            &nbsp;&nbsp;<span className="text-blue-300 font-bold">$ cd portfolio</span>
                        </div>
                    </div>
                );
                break;
            case "cd":
                if (arg === "logic-arena") {
                    output = <span className="text-emerald-400">Scrolling to Logic Arena...</span>;
                    setTimeout(() => {
                        document.getElementById("project-logic-arena")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                } else if (arg === "portfolio" || arg === "flurry-v2" || arg === "cybership" || arg === "cs-arena" || arg === "blog-pro" || arg === "gemini-clone") {
                    output = <span className="text-emerald-400">Scrolling to {arg === "portfolio" ? "Portfolio" : arg}...</span>;
                    setTimeout(() => {
                        const targetId = arg === "portfolio" ? "project-flurry-v2" : `project-${arg}`;
                        const target = document.getElementById(targetId) || document.getElementById("projects");
                        target?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                } else if (!arg) {
                    output = <span className="text-red-400">Usage: cd &lt;project-name&gt; (e.g., cd logic-arena)</span>;
                } else {
                    output = <span className="text-red-400">Directory not found: {arg}</span>;
                }
                break;
            case "log":
                output = (
                    <div className="text-gray-300 font-mono space-y-1">
                        <div><span className="text-red-400 font-bold">[FIXED]</span>   Docker build failure — missing engine/* wildcard in tsconfig.json</div>
                        <div><span className="text-red-400 font-bold">[FIXED]</span>   7 AI logic mismatches across 60-level campaign audit</div>
                        <div><span className="text-red-400 font-bold">[FIXED]</span>   Timing bug — tick thresholds assumed seconds, engine runs 10 ticks/sec (17 levels affected)</div>
                        <div><span className="text-emerald-400 font-bold">[SHIPPED]</span> Replay controls — play/pause/seek/speed</div>
                        <div><span className="text-emerald-400 font-bold">[SHIPPED]</span> Server-side pause w/ timestamp-safe state adjustment</div>
                        <div><span className="text-blue-400 font-bold">[PERF]</span>    Lighthouse optimization pass — lobby, campaign, black-market</div>
                    </div>
                );
                break;
            case "neofetch":
                {
                    const codingYears = new Date().getFullYear() - 2023;
                    output = (
                        <div className="flex gap-4 font-mono items-center">
                            <pre className="text-blue-400 text-xs hidden sm:block">
{`   /\\_/\\
  ( o.o )
   > ^ <
  /     \\
 (       )
`}
                            </pre>
                            <div className="text-gray-300 text-xs md:text-sm space-y-1">
                                <div><span className="text-blue-400 font-bold">OS</span> .............. AliOS v2.0</div>
                                <div><span className="text-blue-400 font-bold">Shell</span> ........... TypeScript</div>
                                <div><span className="text-blue-400 font-bold">Uptime</span> .......... {codingYears} years coding (since 2023)</div>
                                <div><span className="text-blue-400 font-bold">Packages</span> ........ pnpm (12) / npm (8)</div>
                                <div><span className="text-blue-400 font-bold">CPU</span> ............. Problem-Solving Core, 8 threads</div>
                                <div><span className="text-blue-400 font-bold">Memory</span> .......... Unlimited (caffeine-backed)</div>
                            </div>
                        </div>
                    );
                }
                break;
            case "contact":
                output = (
                    <div className="text-gray-300 font-mono space-y-1 text-xs md:text-sm">
                        <div>
                            <span className="text-blue-300">Email</span> ...........{" "}
                            <a
                                href="mailto:ali.haggag2005@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer text-emerald-400 hover:text-emerald-300 underline"
                            >
                                ali.haggag2005@gmail.com
                            </a>
                        </div>
                        <div>
                            <span className="text-blue-300">GitHub</span> ..........{" "}
                            <a
                                href="https://github.com/Ali-Haggag7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer text-emerald-400 hover:text-emerald-300 underline"
                            >
                                github.com/Ali-Haggag7
                            </a>
                        </div>
                        <div>
                            <span className="text-blue-300">LinkedIn</span> ........{" "}
                            <a
                                href="https://www.linkedin.com/in/ali-haggag7/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer text-emerald-400 hover:text-emerald-300 underline"
                            >
                                linkedin.com/in/ali-haggag7
                            </a>
                        </div>
                    </div>
                );
                break;
            case "sudo":
                if (arg === "hire-me") {
                    output = (
                        <div className="text-emerald-400 font-mono space-y-1">
                            <div>Initializing hiring protocol...</div>
                            <div>Decrypting CV package...</div>
                            <div>Target acquired: Ali Haggag</div>
                            <div>Generating contract payload...</div>
                            <div className="text-white font-bold animate-pulse">Downloading CV... Welcome aboard!</div>
                        </div>
                    );
                    setTimeout(() => {
                        const link = document.createElement("a");
                        link.href = "/Ali_Haggag_CV.pdf";
                        link.download = "Ali_Haggag_FullStack_CV.pdf";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }, 800);
                } else {
                    output = <span className="text-red-500 font-bold block break-words">Nice try, recruiter. Access Denied.</span>;
                }
                break;
            case "clear":
                terminal.setHistory([]);
                terminal.setUserInput("");
                return;
            case "":
                output = "";
                break;
            default:
                output = <span className="text-red-500 block break-words">command not found: zsh: did you mean &apos;help&apos;?</span>;
        }

        terminal.setHistory(prev => [...prev, { id: Date.now(), command: rawInput, output }]);
        terminal.setUserInput("");
        terminal.playKeystroke();
    }, [terminal]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        terminal.setUserInput(e.target.value);
        terminal.playKeystroke();
    }, [terminal]);

    const wrapperClasses = terminal.isFullScreen
        ? "fixed inset-0 z-[100] bg-[hsl(var(--terminal-bg-forced))] flex flex-col text-left m-0 rounded-none border-none terminal-scanlines"
        : cn(
            "w-full max-w-3xl mx-auto rounded-xl border border-[hsl(var(--terminal-border-forced))] mb-8 text-left flex flex-col terminal-scanlines relative overflow-hidden terminal-glow-container",
            "transition-[transform,opacity] duration-300 transform-gpu will-change-[transform,opacity]",
            terminal.isClosed
                ? "scale-95 opacity-0 pointer-events-none"
                : terminal.isMinimized
                    ? "scale-90 opacity-60 pointer-events-none"
                    : "scale-100 opacity-100"
        );

    const bodyClasses = terminal.isFullScreen
        ? "p-4 md:p-8 space-y-4 text-gray-300 flex-1 overflow-y-auto overflow-x-hidden break-words terminal-scrollbar text-lg flex flex-col items-start w-full"
        : "p-4 md:p-6 space-y-3 text-gray-300 h-[300px] overflow-y-auto overflow-x-hidden break-words terminal-scrollbar text-xs md:text-sm flex flex-col items-start w-full";

    return (
        <article className={wrapperClasses}>
            {/* Glassmorphism Background Layer (Separated to prevent Chrome box-shadow + backdrop-filter flicker bug) */}
            {!terminal.isFullScreen && (
                <div 
                    aria-hidden="true" 
                    className="absolute inset-0 -z-10 bg-[hsl(var(--terminal-bg-forced))] backdrop-blur-md rounded-xl pointer-events-none" 
                />
            )}

            <header className="flex items-center justify-between px-4 py-4 bg-[hsl(var(--terminal-bg-forced))] border-b border-[hsl(var(--terminal-border-forced))] shrink-0">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => terminal.setIsClosed(true)}
                        className="cursor-pointer p-1 rounded-full hover:bg-white/10 transition-colors group outline-none"
                    >
                        <div className="w-3 h-3 rounded-full bg-red-500 relative flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black leading-none">x</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => terminal.setIsMinimized(p => !p)}
                        className="cursor-pointer p-1 rounded-full hover:bg-white/10 transition-colors group outline-none"
                    >
                        <div className="w-3 h-3 rounded-full bg-yellow-500 relative flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black leading-none">-</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => { terminal.setIsFullScreen(p => !p); terminal.setIsMinimized(false); }}
                        className="cursor-pointer p-1 rounded-full hover:bg-white/10 transition-colors group outline-none"
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
                    type="button"
                    onClick={() => terminal.setIsMuted(p => !p)}
                    className="cursor-pointer p-2 -mr-2 text-gray-400 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded-sm"
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
                            className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-gray-500 focus:ring-0 caret-[var(--live-dot)]"
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