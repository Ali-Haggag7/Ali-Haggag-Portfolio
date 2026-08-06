"use client";

import { Terminal, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import type { TerminalState } from "./useTerminal";

export type HistoryItem = { id: number; command: string; output: React.ReactNode };

const BootSequence = memo(function BootSequence({ step }: { step: number }) {
    return (
        <>
            {step >= 1 && (
                <div className="flex items-start gap-2 w-full">
                    <span className="text-green-500 font-bold shrink-0">root@ali-haggag:~$</span>
                    <span className="text-white font-bold">whoami</span>
                </div>
            )}
            {step >= 2 && (
                <div className="pl-4 border-l-2 border-blue-500/30 ml-2 w-full break-words">
                    <span className="text-white font-bold text-lg">Ali Haggag</span><br />
                    <span className="text-blue-300 font-semibold">Full-Stack Software Engineer | Real-time Systems Architect</span>
                </div>
            )}
            {step >= 3 && (
                <div className="flex items-start gap-2 mt-4 w-full">
                    <span className="text-green-500 font-bold shrink-0">root@ali-haggag:~$</span>
                    <span className="text-white font-bold">npm run start:prod</span>
                </div>
            )}
            {step >= 4 && (
                <div className="text-emerald-300 pl-4 border-l-2 border-emerald-500/30 ml-2 space-y-1 w-full break-words font-medium">
                    <div>{`> alihaggag-portfolio@2.0.0 start:prod`}</div>
                    <div>{`> node dist/server.js`}</div>
                    <div className="text-blue-300 font-semibold">[Server] Running on port 3000...</div>
                    <div className="text-green-400 font-semibold">[MongoDB] Connected successfully to Cluster0</div>
                </div>
            )}
            {step >= 5 && (
                <div className="flex items-start gap-2 mt-4 w-full">
                    <span className="text-green-500 font-bold shrink-0">root@ali-haggag:~$</span>
                    <span className="text-white font-bold">ping db.alihaggag.com -c 1</span>
                </div>
            )}
            {step >= 6 && (
                <div className="text-yellow-300 pl-4 border-l-2 border-yellow-500/30 ml-2 w-full break-words font-medium">
                    PING db.alihaggag.com (104.21.2.22): 56 data bytes<br />
                    64 bytes from 104.21.2.22: icmp_seq=0 ttl=58 time=<span className="text-emerald-400 font-bold">1.02 ms</span><br />
                    <span className="text-gray-400 text-xs">--- Database Connection Verified ---</span>
                </div>
            )}
        </>
    );
});

type TerminalInputProps = {
    onSubmit: (value: string) => void;
    playKeystroke: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
};

const TerminalInput = memo(function TerminalInput({ onSubmit, playKeystroke, inputRef }: TerminalInputProps) {
    const [value, setValue] = useState("");

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        playKeystroke();
    }, [playKeystroke]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(value);
        setValue("");
    }, [onSubmit, value]);

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4 w-full">
            <span className="text-green-500 font-bold shrink-0">guest@ali-haggag:~$</span>
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleChange}
                aria-label="Terminal Command"
                className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-emerald-500/30 focus:ring-0 caret-[var(--live-dot)]"
                placeholder="Type 'help' to see available commands..."
                autoComplete="off"
                spellCheck={false}
            />
        </form>
    );
});

const AVAILABLE_COMMANDS = [
    "help",
    "whoami",
    "skills",
    "projects",
    "cd",
    "log",
    "neofetch",
    "contact",
    "sudo",
    "clear",
    "experience",
    "stats",
    "scout",
    "arena",
    "stack",
    "scars",
    "aliscript",
    "certs",
];

function getLevenshteinDistance(s1: string, s2: string): number {
    if (s1.length < s2.length) return getLevenshteinDistance(s2, s1);
    if (s2.length === 0) return s1.length;

    let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
    for (let i = 0; i < s1.length; i++) {
        const currentRow = [i + 1];
        for (let j = 0; j < s2.length; j++) {
            const insertions = previousRow[j + 1] + 1;
            const deletions = currentRow[j] + 1;
            const substitutions = previousRow[j] + (s1[i] === s2[j] ? 0 : 1);
            currentRow.push(Math.min(insertions, deletions, substitutions));
        }
        previousRow = currentRow;
    }
    return previousRow[s2.length];
}

function getClosestCommand(cmd: string): string {
    let bestCmd = "help";
    let minDistance = Infinity;
    for (const available of AVAILABLE_COMMANDS) {
        const dist = getLevenshteinDistance(cmd, available);
        if (dist < minDistance) {
            minDistance = dist;
            bestCmd = available;
        }
    }
    return bestCmd;
}

export const TerminalWindow = memo(function TerminalWindow({ terminal }: { terminal: TerminalState }) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const terminalContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync boot resets with internal history state
    useEffect(() => {
        if (terminal.step === 0) {
            setHistory([]);
        }
    }, [terminal.step]);

    // Handle internal scrolling
    useEffect(() => {
        const el = terminalContainerRef.current;
        if (!el) return;
        const raf = requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
        return () => cancelAnimationFrame(raf);
    }, [terminal.step, history]);

    // Auto-focus input when boot finishes
    useEffect(() => {
        if (terminal.step >= 7) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [terminal.step]);

    const handleTerminalClick = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        
        if (terminal.step < 7) {
            terminal.skipBootSequence();
        } else {
            inputRef.current?.focus();
        }
    }, [terminal]);

    const handleCommand = useCallback((rawInput: string) => {
        const trimmedInput = rawInput.trim();
        const parts = trimmedInput.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : "";
        let output: React.ReactNode = "";

        switch (cmd) {
            case "help":
                output = (
                    <div className="text-gray-400 font-mono space-y-1 text-xs md:text-sm">
                        <div>Available commands:</div>
                        <div><span className="text-yellow-300">whoami</span>       - Display identity card</div>
                        <div><span className="text-yellow-300">experience</span>   - Show work history &amp; leadership roles</div>
                        <div><span className="text-yellow-300">stats</span>        - Engineering metrics by the numbers</div>
                        <div><span className="text-yellow-300">scout</span>        - Autonomous AI agent architecture</div>
                        <div><span className="text-yellow-300">arena</span>        - Logic Arena flagship engine overview</div>
                        <div><span className="text-yellow-300">aliscript</span>    - Custom DSL compiler specification</div>
                        <div><span className="text-yellow-300">skills</span>       - Show technical skills tree</div>
                        <div><span className="text-yellow-300">projects</span>     - List current projects</div>
                        <div><span className="text-yellow-300">scars</span>        - Production incident autopsy reports</div>
                        <div><span className="text-yellow-300">certs</span>        - Certifications &amp; diplomas</div>
                        <div><span className="text-yellow-300">cd &lt;project&gt;</span>  - Scroll to specific project section</div>
                        <div><span className="text-yellow-300">log</span>          - View engineering changelog</div>
                        <div><span className="text-yellow-300">neofetch</span>     - Show specifications and specs</div>
                        <div><span className="text-yellow-300">contact</span>      - Get contact coordinates</div>
                        <div><span className="text-yellow-300">sudo hire-me</span>  - Initialize recruiting protocol</div>
                        <div><span className="text-yellow-300">clear</span>        - Clear terminal screen</div>
                    </div>
                );
                break;
            case "experience":
                output = (
                    <div className="text-gray-300 font-mono space-y-3 text-xs md:text-sm">
                        <div className="border-l-2 border-emerald-500/50 pl-3">
                            <div className="text-emerald-400 font-bold">Frontend Lead | South Valley National University</div>
                            <div className="text-gray-400">Field Training · Feb 2026 – Jun 2026</div>
                            <div className="text-white mt-1">Led StudentHub campus platform frontend in an 8-person Agile team.</div>
                            <div className="text-blue-300 text-xs mt-1">★ 500+ commits · 135+ PRs · 47 web screens built (React 18 + Vite + Tailwind)</div>
                            <div className="text-purple-300 text-xs">★ Full EN/AR bilingual RTL · JWT role auth · 110+ REST endpoints integrated</div>
                        </div>
                        <div className="border-l-2 border-blue-500/50 pl-3">
                            <div className="text-blue-400 font-bold">Backend Intern | Web Masters</div>
                            <div className="text-gray-400">Remote, Cairo · Jul 2025 – Aug 2025</div>
                            <div className="text-white mt-1">Engineered RESTful APIs for Blog Pro CMS &amp; URL Shortener (Node.js/Express/MongoDB).</div>
                            <div className="text-emerald-300 text-xs mt-1">★ ~40% data sync latency reduction via Firebase Realtime DB</div>
                            <div className="text-yellow-300 text-xs">★ ~30% query speedup via optimized MongoDB schemas &amp; Joi validation</div>
                        </div>
                    </div>
                );
                break;
            case "stats":
                output = (
                    <div className="text-gray-300 font-mono space-y-1 text-xs md:text-sm">
                        <div className="text-emerald-400 font-bold mb-1">=== ENGINEERING BY THE NUMBERS ===</div>
                        <div><span className="text-yellow-300 font-bold">500+</span> Commits on StudentHub alone (135+ PRs merged)</div>
                        <div><span className="text-yellow-300 font-bold">156+</span> Automated tests across Scout cognitive pipeline</div>
                        <div><span className="text-yellow-300 font-bold">6</span> Production systems deployed (DigitalOcean, Vercel, Cloudflare)</div>
                        <div><span className="text-yellow-300 font-bold">20 TPS</span> Server physics engine tick rate (Logic Arena)</div>
                        <div><span className="text-yellow-300 font-bold">&lt;50ms</span> WebRTC P2P audio/video latency (Flurry)</div>
                        <div><span className="text-yellow-300 font-bold">80%</span> WebSocket payload reduction via delta diffing</div>
                        <div><span className="text-yellow-300 font-bold">30+</span> Production incidents debugged &amp; documented</div>
                        <div><span className="text-yellow-300 font-bold">2,000</span> Ops/tick deterministic execution quota (AliScript)</div>
                    </div>
                );
                break;
            case "scout":
                output = (
                    <div className="text-gray-300 font-mono space-y-2 text-xs md:text-sm">
                        <div className="text-purple-400 font-bold">[SCOUT v0.24] AI Autonomous Job-Application Agent (Graduation Project)</div>
                        <div>Stack: NestJS 11 · Next.js 16 · Tauri v2 (Rust) · PostgreSQL · Redis/BullMQ · Playwright</div>
                        <div className="text-blue-300">● Brain Loop: Observe → Reason → Plan → Act → Verify (worker_threads isolated)</div>
                        <div className="text-emerald-300">● Ethical Guardrails: Final Click Rule, &quot;Never Lie&quot; claims verifier, no scraping/evasion</div>
                        <div className="text-yellow-300">● Observability: 1-2 FPS browser streaming + real-time AI thought stream via Socket.io</div>
                    </div>
                );
                break;
            case "arena":
                output = (
                    <div className="text-gray-300 font-mono space-y-2 text-xs md:text-sm">
                        <div className="text-emerald-400 font-bold">[LOGIC ARENA v3.6.5] Competitive Robot-Programming Platform</div>
                        <div>Stack: Next.js 16 · NestJS 11 · React Three Fiber · Socket.io · Redis · DigitalOcean</div>
                        <div className="text-purple-300">● Language: AliScript v2.4 custom DSL (Lexer → AST → Deterministic 2,000 ops quota)</div>
                        <div className="text-blue-300">● Renderer: 20 TPS physics interpolated to 120 FPS render; pure Web Audio spatial sound</div>
                        <div className="text-yellow-300">● Content: 8 game modes, 60 campaign levels, mobile drag-and-drop block compiler</div>
                    </div>
                );
                break;
            case "aliscript":
                output = (
                    <div className="text-gray-300 font-mono space-y-1 text-xs md:text-sm">
                        <div className="text-yellow-300 font-bold">=== ALISCRIPT v2.4 SPECIFICATION ===</div>
                        <div>Parser ......... Custom Lexer → AST Parser (No eval(), node-by-node AST)</div>
                        <div>Quota .......... 2,000 ops/tick TLE limit (deterministic across any hardware)</div>
                        <div>Features ....... WHILE / IF / FOR, user functions, state-machines, Swarm API</div>
                        <div>Superpowers .... SHIELD, CLOAK, DASH, TELEPORT, MINE, TAUNT (energy &amp; cooldowns)</div>
                        <div>Diagnostics .... Worker-thread semantic analyzer w/ Levenshtein autocorrect</div>
                    </div>
                );
                break;
            case "scars":
                output = (
                    <div className="text-gray-300 font-mono space-y-1 text-xs md:text-sm">
                        <div className="text-red-400 font-bold">=== BATTLE SCARS (30+ RESOLVED INCIDENTS) ===</div>
                        <div><span className="text-red-400">[CRITICAL]</span> Ghost Worker Uprising (Playwright worker_threads leak)</div>
                        <div><span className="text-red-400">[CRITICAL]</span> Ghost Match Massacre (Physics loop unhook on disconnect)</div>
                        <div><span className="text-red-400">[CRITICAL]</span> Ghost Robot Infestation (R3F InterpolationBuffer singleton)</div>
                        <div><span className="text-yellow-300">[HIGH]</span>     Mobile Scroll Lag (3D recreate + backdrop-blur repaint)</div>
                        <div><span className="text-yellow-300">[HIGH]</span>     VDOM Stuttering (Custom React.memo equality functions)</div>
                        <div className="text-muted-foreground text-xs mt-1">Type &apos;cd projects&apos; or scroll to Battle Scars section for full autopsies.</div>
                    </div>
                );
                break;
            case "stack":
                output = (
                    <div className="text-gray-300 font-mono space-y-2 text-xs md:text-sm">
                        <div><span className="text-blue-400 font-bold">Frontend:</span> Next.js 15/16, React 19, TypeScript, Tailwind CSS, Framer Motion, R3F</div>
                        <div><span className="text-emerald-400 font-bold">Backend:</span> NestJS 11, Node.js, Express, PostgreSQL, MongoDB, Redis, Prisma</div>
                        <div><span className="text-purple-400 font-bold">AI &amp; Real-Time:</span> Groq (Llama 3.3 70B), Playwright, Socket.io, WebRTC, Tauri v2</div>
                        <div><span className="text-yellow-400 font-bold">DevOps &amp; Security:</span> Docker + Nginx, DigitalOcean, JWT HttpOnly, AES-256-GCM</div>
                    </div>
                );
                break;
            case "certs":
                output = (
                    <div className="text-gray-300 font-mono space-y-1 text-xs md:text-sm">
                        <div className="text-emerald-400 font-bold">=== CERTIFICATIONS &amp; DIPLOMAS ===</div>
                        <div>● Front-End Development Diploma (React.js) — Sef Academy</div>
                        <div>● Back-End Development Training Program — Web Masters</div>
                        <div>● Back-End Development Diploma (Node.js) — Sef Academy</div>
                        <div>● The Web Frontend Learning Guide — Udemy</div>
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
                setHistory([]);
                return;
            case "":
                output = "";
                break;
            default: {
                const closest = getClosestCommand(cmd);
                const displayCmd = cmd.length > 30 ? cmd.slice(0, 30) + "..." : cmd;
                output = (
                    <span className="text-red-500 block break-words">
                        command not found: {displayCmd}: did you mean &apos;{closest}&apos;?
                    </span>
                );
            }
        }

        setHistory(prev => [...prev, { id: Date.now(), command: trimmedInput, output }]);
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
        <article className={wrapperClasses} onClick={handleTerminalClick}>
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
                        onClick={(e) => { e.stopPropagation(); terminal.setIsClosed(true); }}
                        className="cursor-pointer p-1 rounded-full hover:bg-white/10 transition-colors group outline-none"
                    >
                        <div className="w-3 h-3 rounded-full bg-red-500 relative flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black leading-none">x</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); terminal.setIsMinimized(p => !p); }}
                        className="cursor-pointer p-1 rounded-full hover:bg-white/10 transition-colors group outline-none"
                    >
                        <div className="w-3 h-3 rounded-full bg-yellow-500 relative flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black leading-none">-</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); terminal.setIsFullScreen(p => !p); terminal.setIsMinimized(false); }}
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
                    onClick={(e) => { e.stopPropagation(); terminal.setIsMuted(p => !p); }}
                    className="cursor-pointer p-2 -mr-2 text-gray-400 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded-sm"
                >
                    {terminal.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
            </header>

            <div ref={terminalContainerRef} className={bodyClasses}>
                <BootSequence step={terminal.step} />

                {history.map((item) => (
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
                    <TerminalInput
                        onSubmit={handleCommand}
                        playKeystroke={terminal.playKeystroke}
                        inputRef={inputRef}
                    />
                )}
            </div>
        </article>
    );
});