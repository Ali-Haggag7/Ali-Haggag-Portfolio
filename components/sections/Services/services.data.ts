/* ═══════════════════════════════════════════════════════════════════════
   CAPABILITY SYSTEM DATA
   Source of truth for the "What I Offer" section.
   All metrics, tech, and implementations are sourced from the portfolio.
   ═══════════════════════════════════════════════════════════════════════ */

export type PipelineNode = {
    label: string;
    role: string;
};

export type CapabilityDomain = {
    id: string;
    index: number;
    title: string;
    shortTitle: string;
    domain: string;
    tagline: string;
    iconName: "Layers" | "Zap" | "Bot" | "ShieldCheck" | "Smartphone" | "Palette";
    description: string;
    /** Architecture Data Pipeline Flow */
    pipeline: PipelineNode[];
    /** What I actually build in this domain */
    builds: string[];
    /** Core technology stack, grouped */
    stack: { group: string; items: string[] }[];
    /** Key metrics — only real, verifiable numbers */
    metrics: { label: string; value: string }[];
    /** Real implementation evidence */
    implementation: string;
    /** Projects where this capability was shipped */
    projects: { name: string; url: string }[];
    /** IDs of related capabilities — drives the connection map */
    relatedIds: string[];
};

/** Legacy types retained for backwards compatibility */
export type ServiceCategory = "systems" | "realtime" | "security";
export type Service = {
    id: string;
    title: string;
    description: string;
    category: ServiceCategory;
    icon: string;
    builds: string[];
    skills: string[];
    implementation?: string;
    implementations?: string;
    projects: { name: string; url: string }[];
    metrics: { label: string; value: string }[];
};

export const capabilityData: readonly CapabilityDomain[] = Object.freeze([
    {
        id: "fullstack",
        index: 0,
        title: "Full-Stack Web Development",
        shortTitle: "Full-Stack",
        domain: "Systems & Architecture",
        tagline: "Monorepo Architecture / App Router / Scalable APIs",
        iconName: "Layers",
        description:
            "Building scalable, high-performance web applications from scratch using the MERN Stack, Next.js, and modern microservices.",
        pipeline: [
            { label: "Next.js 16 Client", role: "App Router & React 19" },
            { label: "RSC Streaming", role: "Suspense Boundaries" },
            { label: "NestJS 11 Gateway", role: "Typed REST / RPC" },
            { label: "Prisma ORM", role: "Schema Validation" },
            { label: "PostgreSQL", role: "Persistent Storage" },
        ],
        builds: [
            "End-to-end web applications",
            "SSR & RSC frontend architecture",
            "Production-grade backend APIs",
            "Strict authentication systems",
            "Optimized relational schemas",
        ],
        stack: [
            { group: "Core", items: ["TypeScript", "Next.js 16", "React 19"] },
            { group: "Backend", items: ["NestJS 11", "Express.js"] },
            { group: "Data / Styling", items: ["Prisma", "PostgreSQL", "Tailwind CSS"] },
        ],
        metrics: [
            { label: "Codebase", value: "100% TypeScript" },
            { label: "Architecture", value: "pnpm Monorepo" },
            { label: "Streaming", value: "Suspense RSC" },
        ],
        implementation:
            "Architected Logic Arena as a pnpm monorepo with a Next.js 16 client and NestJS 11 server, and shipped CS Arena on the Next.js 16 App Router with Server Components and Suspense streaming.",
        projects: [
            { name: "Logic Arena", url: "https://logicarena.dev" },
            { name: "CS Arena", url: "https://csarena.tech" },
        ],
        relatedIds: ["realtime", "security", "uiux"],
    },
    {
        id: "realtime",
        index: 1,
        title: "Real-Time & Streaming",
        shortTitle: "Real-Time",
        domain: "Real-Time Engines",
        tagline: "20 TPS Physics Tick / WebRTC Mesh / Delta Diffing",
        iconName: "Zap",
        description:
            "Developing zero-latency live interactions, real-time multiplayer state synchronization, and peer-to-peer WebRTC calling systems.",
        pipeline: [
            { label: "Client WebGL", role: "60 FPS LERP Interpolation" },
            { label: "Socket.io", role: "Delta Diff Transport" },
            { label: "Redis Buffer", role: "High-Throughput Pub/Sub" },
            { label: "Game Engine", role: "50ms Server Tick (20 TPS)" },
        ],
        builds: [
            "Low-latency multiplayer sync",
            "P2P audio/video WebRTC calling",
            "Real-time canvas & 3D engines",
            "WebSocket delta diff pipelines",
            "High-frequency state broadcast",
        ],
        stack: [
            { group: "Transport", items: ["Socket.io", "WebRTC"] },
            { group: "Rendering", items: ["React Three Fiber", "Three.js"] },
            { group: "Cache & Store", items: ["Redis", "In-Memory Buffer"] },
        ],
        metrics: [
            { label: "Server Physics", value: "50ms (20 TPS)" },
            { label: "Client Render", value: "60 FPS LERP" },
            { label: "Payload Cut", value: "~80% Delta Diff" },
        ],
        implementation:
            "Built Logic Arena's match pipeline that runs server physics at a 50ms tick (20 TPS), interpolates meshes to 60 FPS via THREE.Vector3.lerp(), and cut WebSocket payloads ~80% with delta diffing; Flurry adds WebRTC peer-to-peer audio/video calls inside the chat UI.",
        projects: [
            { name: "Logic Arena", url: "https://logicarena.dev" },
            { name: "Flurry", url: "https://flurry-app.vercel.app/" },
        ],
        relatedIds: ["fullstack", "ai", "security"],
    },
    {
        id: "ai",
        index: 2,
        title: "AI Integration & Agents",
        shortTitle: "AI & Agents",
        domain: "Intelligent Systems",
        tagline: "Generative Models / Async Worker Queues / Structured Output",
        iconName: "Bot",
        description:
            "Integrating Generative AI models into production pipelines with asynchronous task queues, telemetry, and automated summarization.",
        pipeline: [
            { label: "Client Prompt", role: "Streaming Input" },
            { label: "BullMQ Queue", role: "Background Task Worker" },
            { label: "Gemini / Groq", role: "LLM Reasoning Core" },
            { label: "Telemetry Cache", role: "Structured JSON Output" },
        ],
        builds: [
            "AI-assisted workflow automation",
            "Real-time conversation summarization",
            "Autonomous reasoning agents",
            "Background queue inference workers",
            "Structured response validation",
        ],
        stack: [
            { group: "Models", items: ["Google Gemini", "Groq Llama-3.3-70B"] },
            { group: "Runtime", items: ["Node.js", "NestJS"] },
            { group: "Queues & Data", items: ["BullMQ", "Redis", "Prisma"] },
        ],
        metrics: [
            { label: "Primary Model", value: "Google Gemini" },
            { label: "Summaries", value: "1-Click Instant" },
            { label: "Execution", value: "BullMQ Isolated" },
        ],
        implementation:
            "Integrated the Google Gemini API into Flurry to summarize long group conversations instantly with a single click alongside real-time interactive polls, and engineered Scout AI's candidate analysis pipeline.",
        projects: [
            { name: "Flurry", url: "https://flurry-app.vercel.app/" },
            { name: "Scout AI", url: "https://github.com/Ali-Haggag7" },
        ],
        relatedIds: ["fullstack", "realtime", "security"],
    },
    {
        id: "security",
        index: 3,
        title: "Robust API & Security",
        shortTitle: "Security & API",
        domain: "Security Architecture",
        tagline: "Zero-Trust Perimeter / Anti-Corruption Layers / Token Caching",
        iconName: "ShieldCheck",
        description:
            "Designing enterprise-grade REST APIs with strict domain-driven Zod boundaries, JWT HttpOnly security, and automated token versioning.",
        pipeline: [
            { label: "Perimeter", role: "Helmet + Redis Rate-Limiter" },
            { label: "Zod ACL Guard", role: "Strict Payload Whitelisting" },
            { label: "Auth Guard", role: "JWT HttpOnly + Token Versioning" },
            { label: "Domain Service", role: "Isolated Business Logic" },
        ],
        builds: [
            "Hardened RESTful API endpoints",
            "JWT HttpOnly cookie architecture",
            "Zod Anti-Corruption payload boundaries",
            "OAuth 2.0 token caching engines",
            "Rate-limiting & DDoS mitigations",
        ],
        stack: [
            { group: "Framework", items: ["NestJS 11", "Express"] },
            { group: "Persistence", items: ["Prisma", "PostgreSQL", "MongoDB"] },
            { group: "Hardening", items: ["Zod", "Helmet", "Redis Windows"] },
        ],
        metrics: [
            { label: "Auth Model", value: "JWT HttpOnly" },
            { label: "Validation", value: "Strict Zod ACL" },
            { label: "Token Buffer", value: "60s Pre-Expiry" },
        ],
        implementation:
            "Designed Logic Arena's NestJS API with JWT HttpOnly cookies, Prisma/PostgreSQL persistence and Zod-validated payloads, and built the Cybership carrier service with a domain-driven Zod boundary plus an OAuth 2.0 client that caches tokens with a 60-second expiry buffer.",
        projects: [
            { name: "Logic Arena", url: "https://logicarena.dev" },
            { name: "Cybership API", url: "https://github.com/Ali-Haggag7/cybership-carrier-service" },
        ],
        relatedIds: ["fullstack", "pwa", "ai"],
    },
    {
        id: "pwa",
        index: 4,
        title: "PWA & Offline-First",
        shortTitle: "PWA & Offline",
        domain: "Resilient Systems",
        tagline: "Service Workers / Workbox Background Sync / Fallbacks",
        iconName: "Smartphone",
        description:
            "Architecting installable Progressive Web Apps with Workbox Service Workers for resilient offline functionality and background request replay.",
        pipeline: [
            { label: "Client Request", role: "Fetch Interception" },
            { label: "Service Worker", role: "Network-First / Cache Fallback" },
            { label: "IndexedDB Queue", role: "Offline Mutation Store" },
            { label: "Workbox Sync", role: "Auto Replay on Reconnect" },
        ],
        builds: [
            "Offline-first mobile web apps",
            "Workbox cache & sync strategies",
            "Persistent mutation background replay",
            "Full PWA manifest compliance",
            "Cross-network reliability",
        ],
        stack: [
            { group: "Core", items: ["Service Workers", "Workbox"] },
            { group: "Storage", items: ["IndexedDB", "CacheStorage"] },
            { group: "Specs", items: ["Web App Manifest", "Push API"] },
        ],
        metrics: [
            { label: "SW Strategy", value: "Network-First" },
            { label: "Icon Matrix", value: "72px → 512px" },
            { label: "Sync Engine", value: "Workbox Replay" },
        ],
        implementation:
            "Shipped Logic Arena's PWA with a full icon set (72–512), a network-first service worker that bypasses API/socket traffic with an offline fallback, and built Flurry's Workbox service worker that queues offline actions and syncs them automatically when connectivity returns.",
        projects: [
            { name: "Logic Arena", url: "https://logicarena.dev" },
            { name: "Flurry", url: "https://flurry-app.vercel.app/" },
        ],
        relatedIds: ["fullstack", "uiux", "realtime"],
    },
    {
        id: "uiux",
        index: 5,
        title: "Modern UI/UX & Motion",
        shortTitle: "UI/UX & Motion",
        domain: "Frontend Engineering",
        tagline: "Bilingual (RTL/LTR) / Design Systems / 60 FPS Micro-Motion",
        iconName: "Palette",
        description:
            "Crafting pixel-perfect, bilingual (Arabic RTL & English LTR), and fluidly animated web applications with Tailwind CSS and Framer Motion.",
        pipeline: [
            { label: "i18n Context", role: "Locale Detection (AR/EN)" },
            { label: "CSS Custom Props", role: "Dynamic HSL Design Tokens" },
            { label: "Framer Motion", role: "GPU-Accelerated Layout Springs" },
            { label: "DOM Render", role: "Bilingual Direction (RTL/LTR)" },
        ],
        builds: [
            "Bilingual interfaces (EN / AR)",
            "Dynamic RTL/LTR layout transitions",
            "Multi-theme design token engines",
            "Interactive physics-based micro-motion",
            "WCAG 2.1 touch & contrast compliance",
        ],
        stack: [
            { group: "Styling", items: ["Tailwind CSS", "CSS Variables"] },
            { group: "Animation", items: ["Framer Motion", "Spring Physics"] },
            { group: "Localization", items: ["i18next", "next-intl"] },
        ],
        metrics: [
            { label: "Locales", value: "EN / AR Native" },
            { label: "Layouts", value: "RTL + LTR Adaptive" },
            { label: "Themes", value: "3 Custom Palettes" },
        ],
        implementation:
            "Built Flurry's bilingual interface with i18next that flips layout direction between English (LTR) and Arabic (RTL), and delivered Logic Arena's three-theme design system on CSS custom properties with zero hardcoded colors.",
        projects: [
            { name: "Flurry", url: "https://flurry-app.vercel.app/" },
            { name: "Logic Arena", url: "https://logicarena.dev" },
        ],
        relatedIds: ["fullstack", "pwa", "realtime"],
    },
]);

/* ── Security posture data ── */
export type SecurityLayer = {
    layer: number;
    name: string;
    projects: string;
    description: string;
    threat: string;
};

export const securityLayers: readonly SecurityLayer[] = Object.freeze([
    {
        layer: 1,
        name: "AES-256-GCM Field Encryption",
        projects: "Scout AI Agent",
        description: "Encrypts candidate CV data & sensitive PII at rest before DB insertion.",
        threat: "Mitigates Database Leak & Plaintext PII Extraction",
    },
    {
        layer: 2,
        name: "HttpOnly JWT & Token Versioning",
        projects: "Blog Pro / StudentHub",
        description: "Prevents token theft via XSS using HttpOnly cookies with automatic invalidation on role change.",
        threat: "Mitigates XSS Token Theft & Session Hijacking",
    },
    {
        layer: 3,
        name: "Zod Anti-Corruption Layer (ACL)",
        projects: "Cybership Carrier API",
        description: "Strict payload schema boundaries preventing external API malformed payload injection.",
        threat: "Mitigates Mass Assignment & Malformed Payloads",
    },
    {
        layer: 4,
        name: "Sandboxed AST Interpreter",
        projects: "AliScript DSL Engine",
        description: "Node-by-node AST execution without eval() under a deterministic 2,000 ops quota.",
        threat: "Mitigates Arbitrary Code Execution (RCE) & ReDoS",
    },
    {
        layer: 5,
        name: "Redis Rate-Limiting & Helmet",
        projects: "Logic Arena / Nginx Gateway",
        description: "Protecting public endpoints against DDoS & brute-force attempts with Redis sliding windows.",
        threat: "Mitigates DDoS, Brute-Force & Header Exploits",
    },
]);
