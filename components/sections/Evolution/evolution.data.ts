import { GraduationCap, Layout, Database, Rocket, Code, Brain, type LucideIcon } from "lucide-react";

export type ExperienceEntry = {
    role: string;
    company: string;
    type: string;
    period: string;
    metrics: { label: string; value: string }[];
};

export type EvolutionChapter = {
    id: string;
    year: string;
    title: string;
    /** One-line identity shift statement */
    shift: string;
    description: string;
    evidence: string[];
    projects: { name: string; url: string }[];
    tech: string[];
    /** Bridge to the next chapter — null for the last one */
    narrativeConnector: string | null;
    icon: LucideIcon;
    accentVar: string;
    isActive: boolean;
    /** Optional embedded work experience for this period */
    experience?: ExperienceEntry;
};

// Frozen at module level — never re-created on renders.
// Every evidence point, project, and tech entry is sourced directly from the live CV.
export const evolutionData: readonly EvolutionChapter[] = Object.freeze([
    {
        id: "the-foundation",
        year: "2023",
        title: "The Foundation",
        shift: "I learned to think in code",
        description:
            "Started my B.Sc. in Computer Science & Artificial Intelligence at South Valley National University. Laid strong foundations in algorithmic thinking, object-oriented design, and relational databases.",
        evidence: [
            "Enrolled in the B.Sc. Computer Science & Artificial Intelligence program at South Valley National University.",
            "Built strong foundations in Data Structures, Algorithms, and Object-Oriented Programming.",
            "Studied Database Systems and Software Engineering as part of the core curriculum.",
        ],
        projects: [],
        tech: ["Data Structures", "OOP", "Database Systems", "C++"],
        narrativeConnector:
            "Understanding algorithms made me want to build things people could actually use — which meant learning how to build interfaces.",
        icon: GraduationCap,
        accentVar: "var(--evo-accent-1)",
        isActive: false,
    },
    {
        id: "the-builder",
        year: "2024",
        title: "The Builder",
        shift: "I learned to build for users",
        description:
            "Earned my Front-End Development Diploma and mastered the art of building responsive, interactive user interfaces. Adopted bilingual RTL/LTR patterns that would become a standard in all future projects.",
        evidence: [
            "Earned a Front-End Development Diploma focused on React.js from Sef Academy.",
            "Built responsive, interactive interfaces with Tailwind CSS and Framer Motion.",
            "Adopted bilingual (RTL/LTR) UI patterns for English and Arabic that became standard practice.",
            "Completed The Web Frontend Learning Guide from Udemy.",
        ],
        projects: [],
        tech: ["React.js", "Tailwind CSS", "Framer Motion", "JavaScript ES6+"],
        narrativeConnector:
            "Building frontends revealed that the real complexity lives behind the UI — APIs, databases, authentication. I needed to understand the full stack.",
        icon: Layout,
        accentVar: "var(--evo-accent-2)",
        isActive: false,
    },
    {
        id: "the-engineer",
        year: "2025",
        title: "The Engineer",
        shift: "I learned to build systems",
        description:
            "Completed a Backend Internship at Web Masters. Engineered RESTful APIs, optimised MongoDB schemas, mastered JWT authentication, and shipped Blog Pro — a full CMS with 5-layer security.",
        evidence: [
            "Engineered RESTful APIs for a CMS (Blog Pro) and a URL Shortener using Node.js / Express / MongoDB.",
            "Integrated Firebase Realtime Database for instant messaging — reduced data sync latency by ~40%.",
            "Optimised MongoDB schemas with Joi validation — accelerated query execution by ~30%.",
            "Built Blog Pro: a MERN CMS with JWT HttpOnly cookies, RBAC, and Helmet/XSS-Clean/HPP protection layers.",
        ],
        projects: [
            { name: "Blog Pro", url: "https://blog-pro-platform.vercel.app/" },
        ],
        tech: ["Node.js", "Express.js", "MongoDB", "JWT", "Firebase", "Joi"],
        narrativeConnector:
            "Building secure APIs taught me how data flows through systems. But I wanted to push further — real-time communication, peer-to-peer connections, and offline-first architecture.",
        icon: Database,
        accentVar: "var(--evo-accent-3)",
        isActive: false,
        experience: {
            role: "Backend Intern",
            company: "Web Masters",
            type: "Remote, Cairo",
            period: "Jul 2025 – Aug 2025",
            metrics: [
                { label: "Latency reduction", value: "~40%" },
                { label: "Query speedup", value: "~30%" },
                { label: "Auth coverage", value: "100%" },
            ],
        },
    },
    {
        id: "the-architect",
        year: "Late 2025 – Early 2026",
        title: "The Architect",
        shift: "I learned to build at scale",
        description:
            "Architected complex, offline-first systems. Shipped Flurry with WebRTC P2P calling and offline-first PWA sync. Launched CS Arena as a developer ecosystem. Built the Cybership carrier integration with domain-driven boundaries.",
        evidence: [
            "Architected Flurry's hybrid signaling server with Socket.io for handshakes, offloading media to WebRTC P2P channels — <50ms latency.",
            "Engineered an offline-first PWA with Inngest durable background functions and Workbox service workers.",
            "Built CS Arena's 3-level cascading classification system, solving race conditions with useTransition + URL-first state.",
            "Designed the Cybership carrier service with a Zod-validated Anti-Corruption Layer and OAuth 2.0 token cache.",
        ],
        projects: [
            { name: "Flurry", url: "https://flurry-app.vercel.app/" },
            { name: "CS Arena", url: "https://csarena.tech" },
            { name: "Cybership API", url: "https://github.com/Ali-Haggag7/cybership-carrier-service" },
        ],
        tech: ["Socket.io", "WebRTC", "PWA", "Workbox", "Next.js 16", "Zod", "DDD"],
        narrativeConnector:
            "Scaling real-time systems made me realize I needed to control every layer — including the programming language players would use. That's when I decided to build my own.",
        icon: Rocket,
        accentVar: "var(--evo-accent-4)",
        isActive: false,
    },
    {
        id: "the-inventor",
        year: "2026",
        title: "The Inventor",
        shift: "I built my own language",
        description:
            "Created Logic Arena — a competitive robot-programming platform with a custom DSL (AliScript), a 3D physics engine, cinematic arenas, and a 60-level campaign. Led the frontend of StudentHub in an 8-person Agile team.",
        evidence: [
            "Designed AliScript v2.4 — a custom DSL with a full Lexer → AST parser → secure server-side evaluator under a deterministic 2,000 ops/tick quota.",
            "Built a 20 TPS server physics engine with sub-frame interpolation delivering 120 FPS client rendering. Delta-state diffing cut WebSocket payloads ~80%.",
            "Shipped cinematic 3D arenas with a fully synthesized 8-soundscape spatial audio engine built on pure Web Audio (zero MP3s).",
            "Led frontend of StudentHub in an 8-person Agile team: 500+ commits, 135+ PRs, 47 web screens with full EN/AR bilingual RTL localisation.",
            "Resolved 30+ production incidents across engine, renderer, and infrastructure layers.",
        ],
        projects: [
            { name: "Logic Arena", url: "https://logicarena.dev" },
        ],
        tech: ["AliScript", "NestJS 11", "React Three Fiber", "Web Audio API", "Socket.io", "Redis", "Docker"],
        narrativeConnector:
            "Building a compiler and a physics engine pushed my systems thinking to the limit. The next frontier was clear — machines that can think and act on their own.",
        icon: Code,
        accentVar: "var(--evo-accent-5)",
        isActive: false,
        experience: {
            role: "Frontend Lead",
            company: "South Valley National University",
            type: "Field Training",
            period: "Feb 2026 – Jun 2026",
            metrics: [
                { label: "Commits", value: "500+" },
                { label: "PRs", value: "135+" },
                { label: "Web screens", value: "47" },
                { label: "REST endpoints", value: "110+" },
            ],
        },
    },
    {
        id: "the-ai-pioneer",
        year: "Mid 2026 – Present",
        title: "The AI Pioneer",
        shift: "I taught machines to think",
        description:
            "Building Scout — an autonomous AI job-application agent as my graduation project. A cognitive brain loop with ethical guardrails, worker-thread browser automation, and a 'Never Lie' claims verifier.",
        evidence: [
            "Architected a Cognitive Brain Loop (Observe → Reason → Plan → Act → Verify) running on the main thread, with Playwright browser automation isolated inside node:worker_threads.",
            "Built an AI Application Intelligence pipeline: two-axis question classifier, deterministic-first answers with zero LLM cost, and a 'Never Lie' claims verifier.",
            "Engineered hard ethical guardrails: no mass scraping, no proxy rotation, no anti-bot evasion, and a mandatory Final Click Rule requiring explicit human approval.",
            "Implemented BYOK AI provider layer with automatic HTTP 429 fallback, AES-256-GCM field-level encryption for CVs/PII, and Pino structured logging with credential redaction.",
            "156+ automated tests (Vitest/Jest) covering session lifecycle, worker isolation, and the full cognitive cycle.",
        ],
        projects: [
            { name: "Scout", url: "#" },
        ],
        tech: ["NestJS 11", "Playwright", "Groq Llama-3.3-70B", "Tauri v2", "BullMQ", "Prisma", "AES-256-GCM"],
        narrativeConnector: null,
        icon: Brain,
        accentVar: "var(--evo-accent-6)",
        isActive: true,
    },
]);
