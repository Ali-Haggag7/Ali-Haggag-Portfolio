import {
    GitCommitHorizontal, TestTube, Server, Gamepad2,
    Gauge, Zap, MonitorSmartphone, Route, Bug, type LucideIcon
} from "lucide-react";

export type MetricCategory = "code" | "systems" | "performance" | "scale";

export type MetricDetail = {
    project: string;
    headline: string;
    description: string;
    highlights: string[];
    techStack: string[];
};

export type MetricItem = {
    id: string;
    value: number;
    /** Prefix like "<" or "~" rendered before the number */
    prefix?: string;
    /** Suffix like "+", "%", "ms", "TPS" rendered after the number */
    suffix?: string;
    label: string;
    icon: LucideIcon;
    category: MetricCategory;
    /** CSS variable for the accent glow */
    accentVar: string;
    /** Deep technical details sourced from production CV & architecture docs */
    detail: MetricDetail;
};

export const CATEGORY_LABELS: Record<MetricCategory, string> = {
    code: "Code",
    systems: "Systems",
    performance: "Performance",
    scale: "Scale",
};

// All metrics sourced directly from live CV & production architecture docs (August 2026).
export const metricsData: readonly MetricItem[] = Object.freeze([
    // ── Code ──
    {
        id: "commits",
        value: 500,
        suffix: "+",
        label: "Commits on StudentHub alone",
        icon: GitCommitHorizontal,
        category: "code",
        accentVar: "var(--tl-accent-blue)",
        detail: {
            project: "StudentHub Campus Platform",
            headline: "500+ Production Commits Led on StudentHub",
            description: "Led the frontend engineering of the StudentHub campus platform in an 8-person Agile team, shipping 500+ atomic commits across 47 production web screens.",
            highlights: [
                "Led frontend development in an 8-person Agile team across 47 production web screens.",
                "Full EN/AR bilingual localization with dynamic RTL/LTR layout switching.",
                "Cascading filter engines and stateful navigation built on React 18 & Vite.",
            ],
            techStack: ["React 18", "Vite", "Tailwind CSS", "MUI", "i18next"],
        },
    },
    {
        id: "prs",
        value: 135,
        suffix: "+",
        label: "Pull Requests reviewed & merged",
        icon: GitCommitHorizontal,
        category: "code",
        accentVar: "var(--tl-accent-blue)",
        detail: {
            project: "StudentHub Campus Platform",
            headline: "135+ Pull Requests Reviewed & Merged on StudentHub",
            description: "Reviewed and merged 135+ Pull Requests as Frontend Lead in an 8-person Agile team on StudentHub, enforcing component modularity, clean Git branch workflows, and zero breaking changes on develop.",
            highlights: [
                "Led frontend code reviews for an 8-person Agile team, reviewing and merging 135+ PRs into develop.",
                "Enforced React 18 & Vite component standards, UI accessibility, and strict branch naming conventions.",
                "Prevented regression bugs and ensured seamless integration across 47 production web screens.",
            ],
            techStack: ["React 18", "Vite", "Git / GitHub", "Agile / Scrum", "Code Review"],
        },
    },
    {
        id: "tests",
        value: 156,
        suffix: "+",
        label: "Automated tests (Scout pipeline)",
        icon: TestTube,
        category: "code",
        accentVar: "var(--tl-accent-blue)",
        detail: {
            project: "Scout AI Autonomous Agent Pipeline",
            headline: "156+ Automated Unit & Integration Tests",
            description: "Comprehensive test suite covering Scout's cognitive AI loop (Observe → Reason → Plan → Act → Verify), worker thread isolation, and claims verifier.",
            highlights: [
                "Worker thread crash-safety & Executor.terminateAllWorkers() lifecycle teardown validation.",
                "'Never Lie' AI claims verification engine test suite with factual audit trails.",
                "Two-axis question classifier tests (0 LLM cost for known candidate PII & date arithmetic).",
            ],
            techStack: ["Vitest", "Jest", "NestJS 11", "node:worker_threads", "Playwright"],
        },
    },
    // ── Systems ──
    {
        id: "production-systems",
        value: 6,
        suffix: "",
        label: "Production systems deployed",
        icon: Server,
        category: "systems",
        accentVar: "var(--tl-accent-emerald)",
        detail: {
            project: "Production Infrastructure & Architecture",
            headline: "6 Fully Deployed Production Systems",
            description: "Architected and shipped production-grade software across real-time multiplayer games, autonomous AI agents, social super-apps, developer ecosystems, and secure backends.",
            highlights: [
                "Scout: Autonomous AI Job-Application Agent with Playwright worker_threads (Graduation Project).",
                "Logic Arena v3.6.5: Real-Time 3D Scripting Game Engine with Custom AliScript DSL.",
                "Flurry v2.0: WebRTC P2P Real-Time Social Super-App with Offline-First PWA.",
                "StudentHub: Campus Platform (.NET 10 Web API + React 18 / Vite).",
                "CS Arena, Blog Pro & Cybership Carrier API: Developer Platforms & DDD Backends.",
            ],
            techStack: ["Docker", "Nginx", "Vercel", "Sevalla", "DigitalOcean", ".NET 10", "NestJS 11", "React 18"],
        },
    },
    {
        id: "game-modes",
        value: 8,
        suffix: "",
        label: "Game modes in Logic Arena",
        icon: Gamepad2,
        category: "systems",
        accentVar: "var(--tl-accent-emerald)",
        detail: {
            project: "Logic Arena Game Engine v3.6.5",
            headline: "8 Tactical Modes & Play Styles",
            description: "Engineered complex real-time game loops across 8 distinct modes and 3 play styles (Classic, Tactical, Hybrid), featuring custom physics rules, win conditions, and execution quotas.",
            highlights: [
                "6 Core Modes: Combat 1v1/FFA, Capture The Flag, Survival, Racing, King of The Hill, & Training Solo.",
                "3 Play Styles: Classic (10-token budget limit), Tactical (15s rounds + 60s breaks), and Hybrid (live iteration).",
                "Practice vs AI (15 bot behaviors across 3 difficulty tiers) & 4/8-player automated Tournament Brackets.",
            ],
            techStack: ["React Three Fiber", "Web Audio API", "NestJS 11", "Socket.io", "Redis"],
        },
    },
    {
        id: "campaign-levels",
        value: 60,
        suffix: "+",
        label: "Campaign levels designed",
        icon: Route,
        category: "systems",
        accentVar: "var(--tl-accent-emerald)",
        detail: {
            project: "Logic Arena Algorithmic Campaign",
            headline: "60 LeetCode-Style Algorithmic Levels",
            description: "Designed 60 progressive puzzle levels requiring players to write custom AliScript v2.4 algorithms to solve navigation, combat, pathfinding, and resource management challenges.",
            highlights: [
                "Headless 60fps-physics / 10Hz-logic server runner streamed to 2D canvas at 20fps.",
                "Server-authoritative pause/resume via timestamp shifting (re-anchoring Date.now() stun/shield/mine timers).",
                "Hidden _SYS_* rail-variable layer for pixel-precise enemy AI movement & in-memory replay scrubber.",
            ],
            techStack: ["AliScript v2.4", "AST Parser", "Node-by-node Evaluator", "Canvas 2D"],
        },
    },
    // ── Performance ──
    {
        id: "webrtc-latency",
        value: 50,
        prefix: "<",
        suffix: "ms",
        label: "WebRTC P2P call latency",
        icon: Zap,
        category: "performance",
        accentVar: "var(--tl-accent-purple)",
        detail: {
            project: "Flurry v2.0 P2P Engine",
            headline: "<50ms WebRTC Peer-to-Peer Call Latency",
            description: "Custom WebRTC audio/video calling architecture with Socket.io signaling, delivering ultra-low latency peer connections and instant media stream negotiation.",
            highlights: [
                "Custom Socket.io signaling protocol for rapid SDP offer/answer & ICE candidate exchange.",
                "Offline-first PWA architecture with IndexedDB action sync queue & Workbox service worker.",
                "4-state message delivery pipeline: Pending → Sent → Delivered → Read.",
            ],
            techStack: ["WebRTC", "Socket.io", "React", "Workbox PWA", "Node.js"],
        },
    },
    {
        id: "physics-tps",
        value: 20,
        suffix: " TPS",
        label: "Server physics tick rate",
        icon: Gauge,
        category: "performance",
        accentVar: "var(--tl-accent-purple)",
        detail: {
            project: "Logic Arena Server Physics Engine",
            headline: "20 TPS Server Physics Decoupled from Render",
            description: "Headless 20 ticks-per-second server physics simulation decoupled from client rendering via a sub-frame InterpolationBuffer, delivering smooth 120 FPS movement.",
            highlights: [
                "Three.js mesh mutations performed directly inside useFrame, bypassing React VDOM reconciliation.",
                "Sub-frame lerp-based position & rotation smoothing independent of network ping or tick rate.",
                "Server-authoritative collision detection and hitboxes.",
            ],
            techStack: ["Three.js", "React Three Fiber", "NestJS 11", "Socket.io"],
        },
    },
    {
        id: "payload-reduction",
        value: 80,
        suffix: "%",
        label: "WebSocket payload reduction",
        icon: Zap,
        category: "performance",
        accentVar: "var(--tl-accent-purple)",
        detail: {
            project: "Logic Arena Networking Protocol",
            headline: "80% WebSocket Payload Size Reduction",
            description: "Implemented delta-state diffing for real-time multiplayer updates: instead of broadcasting full 3D world states every tick, the server transmits bit-packed delta state diffs.",
            highlights: [
                "Bit-packed binary delta diffing for player coordinates and states.",
                "Drastically lowered bandwidth footprint for mobile & low-bandwidth clients.",
                "Eliminated socket buffer overflows during intense 8-player battles.",
            ],
            techStack: ["Socket.io", "Redis", "TypeScript Monorepo", "Binary Serialization"],
        },
    },
    // ── Scale ──
    {
        id: "web-screens",
        value: 47,
        suffix: "",
        label: "Web screens built (StudentHub)",
        icon: MonitorSmartphone,
        category: "scale",
        accentVar: "var(--tl-accent-yellow)",
        detail: {
            project: "StudentHub Campus Platform",
            headline: "47 Production Web Screens Built",
            description: "Designed and implemented 47 responsive, high-performance web screens as Frontend Lead in an 8-person Agile team, including Agent Kanban Boards, Public Leaderboards, and Student Portfolios.",
            highlights: [
                "Bilingual AR/EN support with dynamic RTL/LTR layout switching across all 47 screens.",
                "Agent Activity Kanban (Pending/Approved/Rejected) & Student Portfolio (/u/:username) flows.",
                "Built with React 18 SPA & Vite, styled via MUI + Tailwind CSS with 44px touch targets & zero CLS.",
            ],
            techStack: ["React 18", "Vite", "Tailwind CSS", "MUI", "Framer Motion", "i18next"],
        },
    },
    {
        id: "render-fps",
        value: 120,
        suffix: " FPS",
        label: "Client 3D render frame rate",
        icon: Gauge,
        category: "scale",
        accentVar: "var(--tl-accent-yellow)",
        detail: {
            project: "Logic Arena 3D Render Engine",
            headline: "120 FPS Decoupled WebGL Render Pipeline",
            description: "Engineered a zero-rerender 3D WebGL pipeline in React Three Fiber: Three.js meshes are mutated directly inside useFrame via an InterpolationBuffer, bypassing React VDOM to deliver 120 FPS smooth rendering.",
            highlights: [
                "Sub-frame lerp-based interpolation smoothing between 20 TPS server physics ticks and 120 FPS client rendering.",
                "Zero React VDOM reconciliation overhead during 3D match loops for smooth movement on desktop & mobile.",
                "Cinematic arena environments (Cyber City, Volcanic Core, Glacial Tundra, Black Hole) rendered at 120 FPS.",
            ],
            techStack: ["React Three Fiber", "Three.js", "WebGL", "useFrame", "TypeScript"],
        },
    },
    {
        id: "battle-scars",
        value: 30,
        suffix: "+",
        label: "Production incidents resolved",
        icon: Bug,
        category: "scale",
        accentVar: "var(--tl-accent-yellow)",
        detail: {
            project: "Production Incident Engineering",
            headline: "30+ Battle-Tested Incidents Resolved",
            description: "Documented real production failures across browser automation worker threads, WebGL render memory leaks, spatial audio signal routing, and WebSocket CORS traps in SYMPTOM / CAUSE / FIX format.",
            highlights: [
                "The Ghost Worker Uprising: Force-killed Playwright worker_threads on agent stop to eliminate zombie windows.",
                "The Ghost Match Massacre: Tied match lifecycle to active socket count to prevent CPU 100% spikes.",
                "The VDOM Stuttering Catastrophe: Replaced React VDOM reconciliation with direct Three.js useFrame mutations.",
            ],
            techStack: ["Sentry", "Pino", "Docker", "Node.js worker_threads", "Memory Profiling"],
        },
    },
]);
