import {
    Swords,
    Bot,
    MessageSquare,
    Terminal,
    Network,
    ShieldAlert,
    Zap,
    Server,
    Database,
    Globe,
    Code2,
    ShieldCheck,
    Smartphone,
    Layers,
    type LucideIcon,
} from "lucide-react";

export type SystemTier =
    | "Core Systems & Engines"
    | "Real-Time & Distributed"
    | "Platforms & Security";

export type TechCategory =
    | "Real-Time"
    | "Backend"
    | "Frontend"
    | "Infrastructure"
    | "Data & Validation";

export type FilterLens = "all" | "realtime" | "engines-ai" | "distributed-web";

export interface ProjectSubsystem {
    name: string;
    description: string;
}

export interface ProjectStation {
    id: string;
    name: string;
    shortName: string;
    tier: SystemTier;
    categoryBadge: string;
    description: string;
    architectureSummary: string;
    iconUrl?: string;
    FallbackIcon: LucideIcon;
    accentVar: string; // CSS variable or token
    accentColor: string; // HSL color string for SVG and borders
    githubUrl?: string;
    demoUrl?: string;
    metrics: { value: string; label: string }[];
    subsystems: ProjectSubsystem[];
    techIds: string[];
}

export interface TechImplementation {
    projectId: string;
    roleDescription: string;
}

export interface TechBridge {
    id: string;
    name: string;
    category: TechCategory;
    iconUrl: string;
    themeable?: boolean;
    FallbackIcon: LucideIcon;
    accentColor: string;
    architecturalRole: string;
    description: string;
    implementations: TechImplementation[];
    pairedTechIds: string[];
}

/* ═══════════════════════════════════════════════════════════════════════
   AUTHENTIC PROJECTS DATA (100% DATA INTEGRITY FROM REPOSITORY)
   ═══════════════════════════════════════════════════════════════════════ */

export const PROJECT_STATIONS: readonly ProjectStation[] = [
    {
        id: "logic-arena",
        name: "Logic Arena",
        shortName: "Logic Arena",
        tier: "Core Systems & Engines",
        categoryBadge: "FLAGSHIP SIMULATOR",
        description: "Competitive robot-programming platform where custom AliScript code battles inside a deterministic 20 TPS physics engine.",
        architectureSummary: "Monorepo architecture with NestJS 11 backend running a 20 TPS physics tick loop, broadcasting compressed state via Socket.io to a React Three Fiber 3D viewport.",
        iconUrl: "/logic-arena-icon.png",
        FallbackIcon: Swords,
        accentVar: "var(--accent-emerald)",
        accentColor: "hsl(var(--accent-emerald))",
        githubUrl: "https://github.com/Ali-Haggag7/logic-arena",
        demoUrl: "https://logicarena.dev",
        metrics: [
            { value: "20 TPS", label: "Tick-rate physics loop" },
            { value: "<50ms", label: "Real-time state sync" },
            { value: "2,000", label: "Ops/tick TLE budget" },
        ],
        subsystems: [
            { name: "AliScript v2.2 Engine", description: "Custom domain-specific language with recursive-descent AST parser and bytecode execution sandbox." },
            { name: "Deterministic Physics Loop", description: "Fixed 50ms time-step collision detection with 80% delta payload compression." },
            { name: "Three.js Spatial Arena", description: "Hardware-accelerated 3D battlefield with entity interpolation and dynamic particle emitters." },
        ],
        techIds: [
            "tech-nestjs",
            "tech-socketio",
            "tech-redis",
            "tech-nextjs",
            "tech-pwa",
            "tech-postgres",
        ],
    },
    {
        id: "scout",
        name: "Scout AI Agent",
        shortName: "Scout AI",
        tier: "Core Systems & Engines",
        categoryBadge: "AUTONOMOUS AGENT",
        description: "Autonomous local AI job-application agent orchestrating Chrome DevTools Protocol automation with a 6-node cognitive execution loop.",
        architectureSummary: "Turborepo monorepo with NestJS backend, Next.js 16 dashboard, and local browser automation daemon coordinating Groq AI evaluations and live WebSocket telemetry.",
        FallbackIcon: Bot,
        accentVar: "var(--accent-purple)",
        accentColor: "hsl(var(--accent-purple))",
        githubUrl: "https://github.com/Ali-Haggag7/scout",
        metrics: [
            { value: "0.42s", label: "Groq match scoring" },
            { value: "100%", label: "Local CDP automation" },
            { value: "0", label: "Hallucinated data" },
        ],
        subsystems: [
            { name: "Cognitive Brain Loop", description: "6-stage observe-reason-plan-execute-verify-learn cycle running in isolated worker threads." },
            { name: "CDP Headless Automation", description: "Direct Chrome DevTools Protocol connection for robust DOM interaction without external bot fingerprints." },
            { name: "Discriminated Telemetry", description: "Zod-validated typed telemetry streaming real-time agent diagnostics to the web console." },
        ],
        techIds: [
            "tech-nestjs",
            "tech-socketio",
            "tech-redis",
            "tech-nextjs",
            "tech-zod",
            "tech-postgres",
        ],
    },
    {
        id: "flurry",
        name: "Flurry Super App",
        shortName: "Flurry",
        tier: "Real-Time & Distributed",
        categoryBadge: "P2P SOCIAL APP",
        description: "Real-time communication super-app combining peer-to-peer WebRTC media calls, Socket.io signaling, and offline-first PWA sync.",
        architectureSummary: "Hybrid signaling server using Socket.io to establish direct WebRTC mesh connections for sub-50ms peer media, backed by Workbox service workers for offline message caching.",
        iconUrl: "/flurry-icon.ico",
        FallbackIcon: MessageSquare,
        accentVar: "var(--accent-blue)",
        accentColor: "hsl(var(--accent-blue))",
        githubUrl: "https://github.com/Ali-Haggag7/Flurry-Super-App",
        demoUrl: "https://flurry-app.vercel.app/",
        metrics: [
            { value: "<50ms", label: "WebRTC P2P latency" },
            { value: "100%", label: "Offline message sync" },
            { value: "Bi-dir", label: "RTL/LTR dynamic layout" },
        ],
        subsystems: [
            { name: "WebRTC Media Mesh", description: "PeerConnection pipeline offloading real-time audio/video streams from server infrastructure." },
            { name: "Offline Sync Engine", description: "IndexedDB transaction queues synchronized via Workbox background-sync upon reconnection." },
            { name: "Gemini AI Assistant", description: "Streaming contextual chat completions with zero UI thread blocking." },
        ],
        techIds: [
            "tech-socketio",
            "tech-webrtc",
            "tech-pwa",
        ],
    },
    {
        id: "cybership",
        name: "Cybership API",
        shortName: "Cybership",
        tier: "Real-Time & Distributed",
        categoryBadge: "DOMAIN BACKEND",
        description: "Carrier integration CRM service built on strict Domain-Driven Design principles with an Anti-Corruption Layer for untrusted payloads.",
        architectureSummary: "Isolated domain boundaries separating carrier-specific UPS data structures from core business entities using Zod schemas and automatic OAuth 2.0 token buffers.",
        FallbackIcon: Network,
        accentVar: "var(--scar-high)",
        accentColor: "#f97316",
        githubUrl: "https://github.com/Ali-Haggag7/cybership-carrier-service",
        metrics: [
            { value: "100%", label: "Payload sanitization" },
            { value: "0", label: "Runtime crashes from APIs" },
            { value: "60s", label: "Token refresh buffer" },
        ],
        subsystems: [
            { name: "Zod Anti-Corruption Layer", description: "Strict ingress boundary normalizing chaotic third-party courier JSON into typed domain entities." },
            { name: "OAuth 2.0 Lease Manager", description: "Proactive token renewal daemon preventing mid-flight authorization dropouts." },
            { name: "Domain Exception Hierarchy", description: "Structured error classes mapping carrier protocol codes into actionable client responses." },
        ],
        techIds: [
            "tech-zod",
        ],
    },
    {
        id: "cs-arena",
        name: "CS Arena Platform",
        shortName: "CS Arena",
        tier: "Platforms & Security",
        categoryBadge: "DEV PLATFORM",
        description: "Developer resource ecosystem featuring 3-level cascading classification and race-condition-free URL-driven state architecture.",
        architectureSummary: "Next.js 16 App Router application decoupling route transitions with React useTransition to eliminate cascading filter race conditions across bilingual content.",
        iconUrl: "/cs-arena-icon.png",
        FallbackIcon: Terminal,
        accentVar: "var(--evo-accent-4)",
        accentColor: "#06b6d4",
        githubUrl: "https://github.com/Ali-Haggag7/CS-Arena",
        demoUrl: "https://csarena.tech",
        metrics: [
            { value: "0", label: "Filter race conditions" },
            { value: "3-level", label: "URL state taxonomy" },
            { value: "MDX", label: "Interactive documentation" },
        ],
        subsystems: [
            { name: "URL-First State Engine", description: "Synchronous URL query parameter reflection ensuring deep-linkable and shareable search filters." },
            { name: "Sanity CMS Sync", description: "Headless content pipeline streaming structured tutorials and developer blueprints." },
            { name: "Bilingual Internationalization", description: "Native next-intl integration with strict RTL bidirectional stylesheet adaptations." },
        ],
        techIds: [
            "tech-nextjs",
            "tech-zod",
            "tech-pwa",
        ],
    },
    {
        id: "blog-pro",
        name: "Blog Pro Platform",
        shortName: "Blog Pro",
        tier: "Platforms & Security",
        categoryBadge: "SECURE CMS",
        description: "Enterprise MERN content platform defended by a 5-layer security pipeline and Redis-backed rate limiting.",
        architectureSummary: "Hardened content management architecture enforcing Helmet headers, XSS payload filtering, Joi validation, and Redis sliding-window abuse prevention.",
        FallbackIcon: ShieldAlert,
        accentVar: "var(--tl-accent-yellow)",
        accentColor: "#eab308",
        githubUrl: "https://github.com/Ali-Haggag7/Blog-Pro-Platform",
        demoUrl: "https://blog-pro-platform.vercel.app/",
        metrics: [
            { value: "100%", label: "XSS vectors blocked" },
            { value: "<100ms", label: "Cached read latency" },
            { value: "5-layer", label: "Security pipeline" },
        ],
        subsystems: [
            { name: "Defence-in-Depth Pipeline", description: "5-layer ingress sanitizer neutralizing script injection and prototype pollution before reaching controllers." },
            { name: "Redis Cache & Throttler", description: "Sliding-window IP rate limiter and in-memory read-cache delivering sub-100ms responses." },
            { name: "RBAC Permission Matrix", description: "Granular administrative privileges governing editorial workflows and media uploads." },
        ],
        techIds: [
            "tech-redis",
        ],
    },
];

/* ═══════════════════════════════════════════════════════════════════════
   AUTHENTIC SHARED TECHNOLOGY BRIDGES (CONNECTING HUBS)
   ═══════════════════════════════════════════════════════════════════════ */

export const TECH_BRIDGES: readonly TechBridge[] = [
    {
        id: "tech-socketio",
        name: "Socket.io",
        category: "Real-Time",
        iconUrl: "/skills/socketio.svg",
        themeable: true,
        FallbackIcon: Zap,
        accentColor: "hsl(var(--accent-purple))",
        architecturalRole: "Real-time bidirectional event transport protocol powering high-frequency state synchronization and telemetry streaming across multiple systems.",
        description: "Low-latency WebSocket engine with fallback transport, heartbeat monitoring, and namespace partitioning.",
        implementations: [
            { projectId: "logic-arena", roleDescription: "20 TPS physics tick broadcast & delta player input sync" },
            { projectId: "scout", roleDescription: "Bidirectional agent execution telemetry & CDP terminal streaming" },
            { projectId: "flurry", roleDescription: "WebRTC signaling handshake & instant messaging delivery" },
        ],
        pairedTechIds: ["tech-redis", "tech-webrtc", "tech-nestjs"],
    },
    {
        id: "tech-nestjs",
        name: "NestJS 11",
        category: "Backend",
        iconUrl: "/skills/nestjs.svg",
        FallbackIcon: Server,
        accentColor: "#e11d48",
        architecturalRole: "Enterprise TypeScript framework providing dependency injection, modular domain separation, and real-time gateway controllers.",
        description: "Scalable Node.js architecture with decorators, interceptor pipelines, and strict lifecycle management.",
        implementations: [
            { projectId: "logic-arena", roleDescription: "Matchmaking engine, tournament brackets, and AliScript execution container" },
            { projectId: "scout", roleDescription: "Core agent orchestrator, profile parser, and telemetry relay gateway" },
        ],
        pairedTechIds: ["tech-socketio", "tech-redis", "tech-postgres"],
    },
    {
        id: "tech-redis",
        name: "Redis",
        category: "Infrastructure",
        iconUrl: "/skills/redis.svg",
        FallbackIcon: Database,
        accentColor: "#dc2626",
        architecturalRole: "High-throughput in-memory data store leveraged for pub/sub message brokers, session state caching, and DDoS rate limiting.",
        description: "Microsecond-latency key-value engine handling ephemeral game states, agent queues, and security throttling.",
        implementations: [
            { projectId: "logic-arena", roleDescription: "Active match session caching & matchmaking queue storage" },
            { projectId: "scout", roleDescription: "Agent execution rate-limit quotas & ephemeral token verification" },
            { projectId: "blog-pro", roleDescription: "Sliding-window DDoS protection & high-speed article read caching" },
        ],
        pairedTechIds: ["tech-socketio", "tech-nestjs"],
    },
    {
        id: "tech-nextjs",
        name: "Next.js 16",
        category: "Frontend",
        iconUrl: "/skills/nextjs.svg",
        themeable: true,
        FallbackIcon: Code2,
        accentColor: "hsl(var(--foreground))",
        architecturalRole: "Modern hybrid rendering framework providing App Router server components, streaming SSR, and URL-first state management.",
        description: "Full-stack React platform enabling instant navigation, optimized asset bundles, and SEO performance.",
        implementations: [
            { projectId: "logic-arena", roleDescription: "Landing portal, competitive leaderboards, and campaign level selector" },
            { projectId: "scout", roleDescription: "Real-time executive telemetry dashboard and candidate sovereignty controls" },
            { projectId: "cs-arena", roleDescription: "URL-first 3-level cascading taxonomy and developer documentation portal" },
        ],
        pairedTechIds: ["tech-zod", "tech-pwa"],
    },
    {
        id: "tech-zod",
        name: "Zod",
        category: "Data & Validation",
        iconUrl: "/skills/zod.svg",
        FallbackIcon: ShieldCheck,
        accentColor: "#3b82f6",
        architecturalRole: "TypeScript-first schema declaration and validation library enforcing immutable contract safety across network boundaries.",
        description: "Runtime payload validator inferring static types, eliminating untrusted JSON exceptions across microservices.",
        implementations: [
            { projectId: "scout", roleDescription: "Discriminated union telemetry schemas & AI extraction output validation" },
            { projectId: "cybership", roleDescription: "Anti-Corruption Layer (ACL) parsing and sanitizing carrier API structures" },
            { projectId: "cs-arena", roleDescription: "URL search parameters verification and form input validation" },
        ],
        pairedTechIds: ["tech-nextjs", "tech-nestjs"],
    },
    {
        id: "tech-webrtc",
        name: "WebRTC",
        category: "Real-Time",
        iconUrl: "/skills/webrtc.svg",
        themeable: true,
        FallbackIcon: Globe,
        accentColor: "hsl(var(--accent-blue))",
        architecturalRole: "Peer-to-peer real-time communication protocol enabling audio, video, and arbitrary binary data streaming with sub-50ms latency.",
        description: "Direct client-to-client mesh protocol eliminating central media server bottlenecks for low-latency calls.",
        implementations: [
            { projectId: "flurry", roleDescription: "Direct peer-to-peer encrypted voice and video media transport" },
        ],
        pairedTechIds: ["tech-socketio", "tech-pwa"],
    },
    {
        id: "tech-pwa",
        name: "PWA & SW",
        category: "Infrastructure",
        iconUrl: "/skills/pwa.svg",
        FallbackIcon: Smartphone,
        accentColor: "#8b5cf6",
        architecturalRole: "Progressive Web App specifications and Service Worker runtime enabling offline reliability, asset caching, and background sync.",
        description: "Browser caching strategy turning web applications into installable, offline-resilient native-like experiences.",
        implementations: [
            { projectId: "logic-arena", roleDescription: "Offline simulator sandbox & campaign level asset pre-caching" },
            { projectId: "flurry", roleDescription: "Workbox background sync queues delivering messages upon reconnect" },
            { projectId: "cs-arena", roleDescription: "Offline documentation caching and fast edge manifest loading" },
        ],
        pairedTechIds: ["tech-nextjs", "tech-socketio"],
    },
    {
        id: "tech-postgres",
        name: "PostgreSQL",
        category: "Backend",
        iconUrl: "/skills/postgresql.svg",
        FallbackIcon: Database,
        accentColor: "#336791",
        architecturalRole: "ACID-compliant relational database engine managing structured transactional entities with Prisma ORM schemas.",
        description: "Robust SQL storage layer with complex joins, relational constraints, and index-optimized query execution.",
        implementations: [
            { projectId: "logic-arena", roleDescription: "User profiles, campaign progress, and immutable tournament match history" },
            { projectId: "scout", roleDescription: "Normalized candidate profiles, job postings, and audit execution logs" },
        ],
        pairedTechIds: ["tech-nestjs", "tech-redis"],
    },
];

/* ═══════════════════════════════════════════════════════════════════════
   ECOSYSTEM RELATIONSHIP GRAPH UTILITIES
   ═══════════════════════════════════════════════════════════════════════ */

/** Calculate shared technologies between two projects */
export function getSharedTechBetweenProjects(
    projectAId: string,
    projectBId: string
): TechBridge[] {
    const projA = PROJECT_STATIONS.find((p) => p.id === projectAId);
    const projB = PROJECT_STATIONS.find((p) => p.id === projectBId);
    if (!projA || !projB) return [];

    const setB = new Set(projB.techIds);
    const sharedIds = projA.techIds.filter((t) => setB.has(t));
    return TECH_BRIDGES.filter((tb) => sharedIds.includes(tb.id));
}

/** Get all projects connected to a given project via at least one shared technology */
export function getConnectedSiblingProjects(
    projectId: string
): { project: ProjectStation; sharedTech: TechBridge[] }[] {
    const currentProj = PROJECT_STATIONS.find((p) => p.id === projectId);
    if (!currentProj) return [];

    const results: { project: ProjectStation; sharedTech: TechBridge[] }[] = [];

    for (const otherProj of PROJECT_STATIONS) {
        if (otherProj.id === projectId) continue;
        const shared = getSharedTechBetweenProjects(projectId, otherProj.id);
        if (shared.length > 0) {
            results.push({ project: otherProj, sharedTech: shared });
        }
    }

    // Sort by number of shared technologies descending
    results.sort((a, b) => b.sharedTech.length - a.sharedTech.length);
    return results;
}

/** Get projects utilizing a given technology */
export function getProjectsUsingTech(techId: string): { project: ProjectStation; role: string }[] {
    const tech = TECH_BRIDGES.find((t) => t.id === techId);
    if (!tech) return [];

    const results: { project: ProjectStation; role: string }[] = [];
    for (const impl of tech.implementations) {
        const proj = PROJECT_STATIONS.find((p) => p.id === impl.projectId);
        if (proj) {
            results.push({ project: proj, role: impl.roleDescription });
        }
    }
    return results;
}

/** Check if an entity matches an active lens filter */
export function matchesFilterLens(
    entity: ProjectStation | TechBridge,
    lens: FilterLens
): boolean {
    if (lens === "all") return true;

    if (lens === "realtime") {
        if ("tier" in entity) {
            return entity.techIds.some((t) => ["tech-socketio", "tech-webrtc", "tech-redis"].includes(t));
        } else {
            return ["tech-socketio", "tech-webrtc", "tech-redis"].includes(entity.id);
        }
    }

    if (lens === "engines-ai") {
        if ("tier" in entity) {
            return ["logic-arena", "scout"].includes(entity.id);
        } else {
            return ["tech-nestjs", "tech-redis", "tech-postgres", "tech-socketio"].includes(entity.id);
        }
    }

    if (lens === "distributed-web") {
        if ("tier" in entity) {
            return ["cs-arena", "cybership", "blog-pro", "flurry"].includes(entity.id);
        } else {
            return ["tech-nextjs", "tech-zod", "tech-pwa", "tech-redis"].includes(entity.id);
        }
    }

    return true;
}
