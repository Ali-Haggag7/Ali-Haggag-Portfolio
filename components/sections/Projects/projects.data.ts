import { MessageSquare, Network, Code2, ShieldAlert, Bot, Swords, type LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image"; // Added explicit type for Next.js images
import flurryImg from "@/public/images/flurry.png";
import blogImg from "@/public/images/blog-pro.png";
import geminiImg from "@/public/images/gemini-clone-1.jpeg";
import csArenaImg from "@/public/images/cs-arena.png";
import logicArenaImg from "@/public/images/logic-arena.png";

export type Autopsy = {
    challenge: string;
    architecture: string;
    impact: string;
};

export type TechPillCategory = "frontend" | "backend" | "realtime" | "infra" | "language";

export type TechPill = {
    name: string;
    category: TechPillCategory;
};

export type MetricCard = {
    value: string;
    label: string;
};

/** Maps pill category to its CSS variable name */
export const PILL_CATEGORY_VAR: Record<TechPillCategory, string> = {
    frontend: "var(--pill-frontend)",
    backend: "var(--pill-backend)",
    realtime: "var(--pill-realtime)",
    infra: "var(--pill-infra)",
    language: "var(--pill-language)",
};

export type ProjectFeature = {
    id: string;
    name: string;
    description: string;
    href?: string;
    cta?: string;
    demoHref?: string;
    videoSrc?: string;
    className: string;
    Icon: LucideIcon;
    // Strictly typing the image source for better TS optimizations
    imageSrc?: StaticImageData | string;
    autopsy?: Autopsy;
    isGradientBg?: boolean;
    gradientClass?: string;
    /** Top 3-4 for card pills, up to 8 shown in modal */
    techStack: TechPill[];
    /** Real metrics sourced from project docs */
    metrics: MetricCard[];
    /** IDs from scarsData that belong to this project */
    scarIds: string[];
};

export const projectsData: ProjectFeature[] = [
    {
        id: "logic-arena",
        Icon: Swords,
        name: "Logic Arena",
        description: "Competitive coding platform where you program robots in a custom language (AliScript) to battle in a real-time 3D physics arena.",
        href: "https://github.com/Ali-Haggag7/logic-arena",
        cta: "View Source",
        demoHref: "https://logicarena.dev",
        imageSrc: logicArenaImg,
        videoSrc: "/videos/logic-arena-demo.mp4",
        className: "col-span-1 md:col-span-2",
        techStack: [
            { name: "AliScript", category: "language" },
            { name: "NestJS 11", category: "backend" },
            { name: "React Three Fiber", category: "frontend" },
            { name: "Socket.IO", category: "realtime" },
            { name: "PostgreSQL", category: "backend" },
            { name: "Redis", category: "infra" },
            { name: "Docker", category: "infra" },
            { name: "Prisma", category: "backend" },
        ],
        metrics: [
            { value: "20 TPS", label: "Physics engine tick rate" },
            { value: "<50ms", label: "Real-time sync latency" },
            { value: "8", label: "Concurrent players" },
            { value: "60+", label: "Campaign levels" },
            { value: "2,000", label: "Ops/tick TLE quota" },
            { value: "80%", label: "Delta payload reduction" },
        ],
        scarIds: [
            "ghost-match-massacre", "sentry-dev-freeze", "redis-isready-poisoning",
            "smtp-to-resend", "redis-ipv6-docker", "docker-context-bomb",
            "prisma-ghost-engine", "operator-precedence", "fov-fire-hack",
            "entity-interpolation-buffer", "webgl-context-log-spam",
            "texture-cache-disposal", "docker-workspace-resolution",
            "logic-arena-pathfinding", "logic-arena-compiler",
        ],
        autopsy: {
            challenge: "Real-Time Physics Sync & Custom Language Security Sandboxing",
            architecture: "Built a pnpm monorepo with a NestJS 11 backend running a shared TypeScript game engine at 20 ticks/sec. Designed AliScript v2.2 — a custom DSL with a full AST parser — with server-side execution sandboxing, strict command whitelists, logic timeouts, and rate limiting. State is broadcast via Socket.io and rendered through React Three Fiber.",
            impact: "Zero script injection vulnerabilities, sub-50ms real-time sync for up to 8 concurrent players, and a complete competitive ecosystem including Tournament Brackets, Campaign Mode, PWA support, and Match Replays."
        }
    },
    {
        id: "flurry-v2",
        Icon: MessageSquare,
        name: "Flurry Super App",
        description: "Real-time Social Super App merging WebRTC, Socket.io, and Gemini AI.",
        href: "https://github.com/Ali-Haggag7/Flurry-Super-App",
        cta: "View Source",
        demoHref: "https://flurry-app.vercel.app/",
        imageSrc: flurryImg,
        videoSrc: "/videos/flurry-demo.mp4",
        className: "col-span-1",
        techStack: [
            { name: "WebRTC", category: "realtime" },
            { name: "Socket.IO", category: "realtime" },
            { name: "PWA", category: "infra" },
            { name: "Gemini AI", category: "language" },
            { name: "React", category: "frontend" },
            { name: "MongoDB", category: "backend" },
            { name: "Workbox", category: "infra" },
            { name: "i18next", category: "frontend" },
        ],
        metrics: [
            { value: "<50ms", label: "WebRTC P2P latency" },
            { value: "100%", label: "Offline message delivery" },
            { value: "Bi-dir", label: "RTL/LTR layout support" },
            { value: "4-state", label: "Message status tracking" },
        ],
        scarIds: ["webrtc-latency", "offline-sync"],
        autopsy: {
            challenge: "Near-Zero Latency P2P Communication & Offline-First UX",
            architecture: "Architected a hybrid signaling server with Socket.io for handshake management, offloading media payloads to WebRTC. Implemented a PWA with Workbox Service Workers.",
            impact: "Achieved <50ms latency for streaming and enabled users to interact securely with the app without internet, auto-syncing upon reconnection."
        }
    },
    {
        id: "cybership",
        Icon: Network,
        name: "Cybership API",
        description: "Robust CRM Backend API with Domain-Driven Design & strict validation.",
        href: "https://github.com/Ali-Haggag7/cybership-carrier-service",
        cta: "View Source",
        isGradientBg: true,
        gradientClass: "from-blue-900 to-slate-900",
        videoSrc: "/videos/cybership-demo.mp4",
        className: "col-span-1",
        techStack: [
            { name: "TypeScript", category: "language" },
            { name: "Zod", category: "backend" },
            { name: "DDD", category: "backend" },
            { name: "Jest", category: "infra" },
            { name: "Axios", category: "backend" },
            { name: "OAuth 2.0", category: "backend" },
        ],
        metrics: [
            { value: "100%", label: "Payload sanitization" },
            { value: "0", label: "Runtime crashes from APIs" },
            { value: "60s", label: "Token refresh buffer" },
        ],
        scarIds: ["ddd-boundaries"],
        autopsy: {
            challenge: "Defending Boundaries Against Unpredictable Third-Party APIs",
            architecture: "Enforced strict Domain-Driven Design (DDD) principles. Built an isolated Anti-Corruption Layer using Zod schemas to sanitize and normalize incoming UPS carrier JSON data.",
            impact: "Zero runtime crashes from external API changes, accompanied by structured custom Error Classes for actionable client feedback."
        }
    },
    {
        id: "cs-arena",
        Icon: Code2,
        name: "CS Arena Platform",
        description: "Developer ecosystem featuring 3-level cascading classification and collaboration.",
        href: "https://github.com/Ali-Haggag7/CS-Arena",
        cta: "View Source",
        demoHref: "https://csarena.tech",
        imageSrc: csArenaImg,
        videoSrc: "/videos/cs-arena-demo.mp4",
        className: "col-span-1 md:col-span-2",
        techStack: [
            { name: "Next.js 16", category: "frontend" },
            { name: "Sanity CMS", category: "backend" },
            { name: "NextAuth", category: "backend" },
            { name: "Sentry", category: "infra" },
            { name: "Framer Motion", category: "frontend" },
            { name: "Resend", category: "infra" },
            { name: "Zod", category: "backend" },
            { name: "next-intl", category: "frontend" },
        ],
        metrics: [
            { value: "0", label: "Filter race conditions" },
            { value: "3-level", label: "Cascading classification" },
            { value: "Bi-lingual", label: "AR/EN with RTL" },
            { value: "MDX", label: "Interactive docs system" },
        ],
        scarIds: ["cascading-filters-race"],
        autopsy: {
            challenge: "State Synchronization & Cascading Filter Race Conditions",
            architecture: "Engineered a URL-first state management system using Next.js App Router. Leveraged React's useTransition to decouple UI state updates from router navigation.",
            impact: "Zero race conditions during complex query parameter updates, ensuring a fluid, glitch-free discovery experience."
        }
    },
    {
        id: "blog-pro",
        Icon: ShieldAlert,
        name: "Blog Pro Platform",
        description: "Secure MERN CMS with Role-Based Access Control and Enterprise Security.",
        href: "https://github.com/Ali-Haggag7/Blog-Pro-Platform",
        cta: "View Source",
        demoHref: "https://blog-pro-platform.vercel.app/",
        imageSrc: blogImg,
        videoSrc: "/videos/blog-cms-demo.mp4",
        className: "col-span-1 md:col-span-2",
        techStack: [
            { name: "React", category: "frontend" },
            { name: "Express.js", category: "backend" },
            { name: "Helmet", category: "backend" },
            { name: "Redis", category: "infra" },
            { name: "Redux Toolkit", category: "frontend" },
            { name: "MongoDB", category: "backend" },
            { name: "Cloudinary", category: "infra" },
            { name: "Nodemailer", category: "infra" },
        ],
        metrics: [
            { value: "100%", label: "XSS payloads blocked" },
            { value: "<100ms", label: "API response time" },
            { value: "RBAC", label: "Admin access control" },
            { value: "5-layer", label: "Security pipeline depth" },
        ],
        scarIds: ["api-fortress"],
        autopsy: {
            challenge: "Enterprise-Grade Security Against Modern Web Vulnerabilities",
            architecture: "Engineered a multi-layered security pipeline integrating Helmet for HTTP headers, XSS-Clean for payload sanitization, Joi for schema validation, and Redis-backed rate limiting.",
            impact: "Blocked 100% of malicious payloads and mitigated aggressive DDoS attempts without degrading the sub-100ms API response times."
        }
    },
    {
        id: "gemini-clone",
        Icon: Bot,
        name: "Gemini AI Clone",
        description: "Pixel-perfect Google Gemini Clone integrated with Generative AI SDK.",
        href: "https://github.com/Ali-Haggag7/Gemini-AI-Clone",
        cta: "View Source",
        demoHref: "https://gemini-clone-ali.vercel.app/",
        imageSrc: geminiImg,
        videoSrc: "/videos/gemini-clone-demo.mp4",
        className: "col-span-1",
        techStack: [
            { name: "React", category: "frontend" },
            { name: "Vite", category: "infra" },
            { name: "Gemini AI SDK", category: "language" },
            { name: "Context API", category: "frontend" },
        ],
        metrics: [
            { value: "Multi-turn", label: "Conversation support" },
            { value: "Real-time", label: "Streaming responses" },
            { value: "0", label: "UI blocking during fetch" },
        ],
        scarIds: [],
        autopsy: {
            challenge: "State Management & Streaming AI Responses",
            architecture: "Integrated the Google Gemini AI SDK with a modern React frontend. Utilized complex state management to persist chat history and handle readable streams for real-time typing effects.",
            impact: "Delivered a highly responsive clone capable of multi-turn conversations with zero UI blocking during API data fetching."
        }
    }
];