import { Globe, Terminal, Database, Layout, Smartphone, Sparkles, type LucideIcon } from "lucide-react";

export type ServiceCategory = "systems" | "realtime" | "security";

export type ServiceMetric = {
    label: string;
    value: string;
};

export type Service = {
    title: string;
    description: string;
    icon: LucideIcon;
    category: ServiceCategory;
    metrics: ServiceMetric[];
    tech: string[];
    implementations: string;
};

// All metrics, tech, and implementation details are sourced directly from the
// project docs in docs/ — no invented numbers or generic claims.
export const servicesData: Service[] = [
    {
        title: "Full-Stack Web Dev",
        description:
            "Building scalable, high-performance web applications from scratch using the MERN Stack and Next.js.",
        icon: Globe,
        category: "systems",
        metrics: [
            { label: "primary languages", value: "TS / TSX" },
            { label: "router", value: "Next.js App Router" },
        ],
        tech: ["Next.js 16", "NestJS 11", "React 19", "TypeScript", "Tailwind CSS"],
        implementations:
            "Architected Logic Arena as a pnpm monorepo with a Next.js 16 client and NestJS 11 server, and shipped CS Arena on the Next.js 16 App Router with Server Components and Suspense streaming.",
    },
    {
        title: "Real-Time & Streaming",
        description:
            "Developing zero-latency live chats and P2P video calling systems using Socket.io and WebRTC.",
        icon: Terminal,
        category: "realtime",
        metrics: [
            { label: "physics tick", value: "50ms (20 TPS)" },
            { label: "client render", value: "60 FPS" },
            { label: "payload cut", value: "~80%" },
        ],
        tech: ["Socket.io", "WebRTC (SimplePeer)", "React Three Fiber", "Redis"],
        implementations:
            "Built Logic Arena's match pipeline that runs server physics at a 50ms tick (20 TPS), interpolates meshes to 60 FPS via THREE.Vector3.lerp(), and cut WebSocket payloads ~80% with delta diffing; Flurry adds WebRTC peer-to-peer audio/video calls inside the chat UI.",
    },
    {
        title: "AI Integration",
        description:
            "Integrating Generative AI models (like Google Gemini) to build smart features, summaries, and chatbots.",
        icon: Sparkles,
        category: "systems",
        metrics: [
            { label: "model", value: "Google Gemini" },
            { label: "feature", value: "1-click summaries" },
        ],
        tech: ["Google Gemini API", "Node.js", "Express.js"],
        implementations:
            "Integrated the Google Gemini API into Flurry to summarize long group conversations instantly with a single click alongside real-time interactive polls.",
    },
    {
        title: "Robust API Architecture",
        description:
            "Designing secure RESTful APIs with MVC architecture, JWT authentication, and optimized MongoDB aggregations.",
        icon: Database,
        category: "security",
        metrics: [
            { label: "auth", value: "JWT / HttpOnly" },
            { label: "validation", value: "Zod schemas" },
            { label: "token buffer", value: "60s refresh" },
        ],
        tech: ["NestJS", "Prisma", "PostgreSQL", "MongoDB", "Zod"],
        implementations:
            "Designed Logic Arena's NestJS API with JWT HttpOnly cookies, Prisma/PostgreSQL persistence and Zod-validated payloads, and built the Cybership carrier service with a domain-driven Zod boundary plus an OAuth 2.0 client that caches tokens with a 60-second expiry buffer.",
    },
    {
        title: "PWA & Offline-First",
        description:
            "Architecting Progressive Web Apps with Service Workers for seamless offline functionality and background syncing.",
        icon: Smartphone,
        category: "systems",
        metrics: [
            { label: "icon sizes", value: "72 → 512" },
            { label: "strategy", value: "network-first SW" },
        ],
        tech: ["Service Workers", "Workbox", "Web App Manifest"],
        implementations:
            "Shipped Logic Arena's PWA with a full icon set (72–512), a network-first service worker that bypasses API/socket traffic with an offline fallback, and built Flurry's Workbox service worker that queues offline actions and syncs them automatically when connectivity returns.",
    },
    {
        title: "Modern UI/UX & Motion",
        description:
            "Crafting pixel-perfect, bilingual (RTL/LTR), and highly animated interfaces with Tailwind CSS and Framer Motion.",
        icon: Layout,
        category: "systems",
        metrics: [
            { label: "locales", value: "EN / AR" },
            { label: "direction", value: "RTL + LTR" },
            { label: "themes", value: "3 (CSS vars)" },
        ],
        tech: ["Tailwind CSS", "Framer Motion", "i18next", "next-intl"],
        implementations:
            "Built Flurry's bilingual interface with i18next that flips layout direction between English (LTR) and Arabic (RTL), and delivered Logic Arena's three-theme design system on CSS custom properties with zero hardcoded colors.",
    },
];
