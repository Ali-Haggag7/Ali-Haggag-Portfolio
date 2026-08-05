export interface SystemNode {
    id: string;
    label: string;
    role: string;
    tech: string;
    details: string;
    scarId?: string;
    category: "client" | "api" | "database" | "cache" | "infra" | "worker";
    x: number; // 0..100 (percentage coordinates)
    y: number; // 0..100
    connections: string[]; // ids of nodes connected to this one
}

export interface ArchitectureMap {
    id: "logic-arena" | "scout" | "flurry";
    title: string;
    subtitle: string;
    nodes: SystemNode[];
}

export const ARCHITECTURE_MAPS: readonly ArchitectureMap[] = Object.freeze([
    {
        id: "logic-arena",
        title: "Logic Arena",
        subtitle: "12-Node Distributed Monorepo & Physics Engine System",
        nodes: [
            {
                id: "client-r3f",
                label: "Next.js 16 Client",
                role: "R3F 3D Canvas & UI",
                tech: "React 19 / R3F / CSS Vars",
                details: "Client canvas rendering 3D Cyber City / Volcanic Core arenas at 120 FPS via direct mesh mutation inside useFrame.",
                scarId: "vdom-stuttering",
                category: "client",
                x: 15,
                y: 20,
                connections: ["nestjs-server", "web-audio"],
            },
            {
                id: "web-audio",
                label: "Web Audio Engine",
                role: "Spatial Sound Generator",
                tech: "Web Audio API (Zero MP3s)",
                details: "Synthesizes 8 procedural soundscapes dynamically using logarithmic 3D distance falloff directly to destination node.",
                scarId: "spatial-audio-crush",
                category: "client",
                x: 15,
                y: 75,
                connections: [],
            },
            {
                id: "aliscript-compiler",
                label: "AliScript Lexer & AST",
                role: "Sandboxed Interpreter",
                tech: "Custom Lexer / AST / Worker",
                details: "Node-by-node AST parser executing scripts under a strict, hardware-independent 2,000 Ops/tick TLE quota.",
                scarId: "operator-precedence",
                category: "worker",
                x: 45,
                y: 20,
                connections: ["nestjs-server"],
            },
            {
                id: "nestjs-server",
                label: "NestJS 11 Engine",
                role: "Match & Physics Authority",
                tech: "NestJS / Socket.io Gateway",
                details: "Runs 20 TPS server-authoritative physics simulation, interpolating states to client via sub-frame buffer.",
                scarId: "ghost-match-massacre",
                category: "api",
                x: 45,
                y: 50,
                connections: ["redis-pubsub", "postgres-db", "nginx-proxy"],
            },
            {
                id: "redis-pubsub",
                label: "Redis Cache & Leaderboard",
                role: "Match State & Rate Limit",
                tech: "Redis / ioredis",
                details: "Backs active match state, rate limits public API calls, and maintains sorted-set leaderboard rankings with DB auto-reconciliation.",
                scarId: "redis-ipv6-docker",
                category: "cache",
                x: 75,
                y: 20,
                connections: [],
            },
            {
                id: "postgres-db",
                label: "PostgreSQL & Prisma",
                role: "Persistent Storage",
                tech: "Postgres / Prisma ORM",
                details: "Stores user profiles, unlocked chassis/paints, campaign progression, and tournament bracket results behind Prisma mass-assignment guards.",
                scarId: "prisma-ghost-engine",
                category: "database",
                x: 75,
                y: 75,
                connections: [],
            },
            {
                id: "nginx-proxy",
                label: "Nginx Reverse Proxy",
                role: "CORS & TLS Gateway",
                tech: "Nginx / Let's Encrypt",
                details: "Routes /api/ to NestJS on port 3001 and static traffic to Next.js on 3000 with long-lived WebSocket upgrade tunnels.",
                scarId: "nginx-route-hijacker",
                category: "infra",
                x: 45,
                y: 85,
                connections: [],
            },
        ],
    },
    {
        id: "scout",
        title: "Scout AI Agent",
        subtitle: "Crash-Safe Cognitive Loop & Worker Threads Architecture",
        nodes: [
            {
                id: "scout-brain",
                label: "Cognitive Brain Loop",
                role: "Main Thread Reasoner",
                tech: "NestJS / Groq Llama-3.3",
                details: "Orchestrates Observe->Reason->Plan->Act->Verify cycle on main thread, maintaining state queue and BYOK AI provider fallback.",
                scarId: "replan-infinite-loop",
                category: "api",
                x: 20,
                y: 50,
                connections: ["scout-worker", "scout-verifier"],
            },
            {
                id: "scout-worker",
                label: "Playwright Worker",
                role: "Isolated DOM Automation",
                tech: "node:worker_threads / Playwright",
                details: "Executes browser actions inside isolated worker threads. Terminated via terminateAllWorkers() if session stops.",
                scarId: "ghost-worker-uprising",
                category: "worker",
                x: 50,
                y: 20,
                connections: ["scout-dashboard"],
            },
            {
                id: "scout-verifier",
                label: "Never Lie Claims Verifier",
                role: "PII & Ethical Guard",
                tech: "Zod / AES-256-GCM",
                details: "Validates candidate claims against encrypted PII database and enforces mandatory Final Click Rule before submit.",
                category: "worker",
                x: 50,
                y: 80,
                connections: [],
            },
            {
                id: "scout-dashboard",
                label: "Tauri Desktop & Control Room",
                role: "Live Stream Observability",
                tech: "Tauri v2 (Rust) / Socket.io",
                details: "Displays 2 FPS browser frame streaming, AI thought stream, and human approval final-click modal over Socket.io.",
                scarId: "socket-eviction-loop",
                category: "client",
                x: 80,
                y: 50,
                connections: [],
            },
        ],
    },
    {
        id: "flurry",
        title: "Flurry Super App",
        subtitle: "WebRTC P2P & Offline-First Service Worker Flow",
        nodes: [
            {
                id: "flurry-client",
                label: "React PWA Client",
                role: "Bilingual UI & Offline Queue",
                tech: "React / Workbox / IndexedDB",
                details: "Manages LTR/RTL bilingual UI, stores offline messages in IndexedDB queue, auto-syncing upon network reconnect.",
                scarId: "offline-sync",
                category: "client",
                x: 20,
                y: 50,
                connections: ["flurry-signaling", "webrtc-channel"],
            },
            {
                id: "flurry-signaling",
                label: "Socket.io Signaling Server",
                role: "P2P Handshake Orchestration",
                tech: "Socket.io / Node.js",
                details: "Handles WebRTC SDP offer/answer handshakes and ICE candidate exchange, offloading media payloads to direct channels.",
                scarId: "webrtc-signaling-dilemma",
                category: "api",
                x: 50,
                y: 20,
                connections: [],
            },
            {
                id: "webrtc-channel",
                label: "WebRTC Peer P2P Channel",
                role: "Direct Media & Voice",
                tech: "WebRTC (SimplePeer)",
                details: "Establishes peer-to-peer audio/video calling channels delivering sub-50ms latency direct between browsers.",
                category: "worker",
                x: 80,
                y: 50,
                connections: [],
            },
        ],
    },
]);
