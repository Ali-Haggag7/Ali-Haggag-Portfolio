import { Swords, WifiOff, Network, Filter, ShieldAlert, type LucideIcon } from "lucide-react";

export type Scar = {
    id: string;
    category: string;
    icon: LucideIcon;
    title: string;
    project: string;
    badges: string[];
    problem: string;
    solution: string;
    impact: string;
};

export const scarsData: Scar[] = [
    {
        id: "webrtc-latency",
        category: "Real-Time",
        icon: Swords,
        title: "Real-Time Combat: The WebRTC Signaling Dilemma",
        project: "Flurry v2.0",
        badges: ["Socket.io", "WebRTC", "P2P"],
        problem: "Managing unpredictable connection states and achieving near-zero latency for peer-to-peer audio and video calls without relying on heavy third-party plugins.",
        solution: "Architected a hybrid signaling server using Socket.io to reliably manage the complex handshake states, offloading the heavy media streaming payload directly to WebRTC P2P channels.",
        impact: "Achieved <50ms latency for seamless voice notes, video calls, and instant read receipts across different network conditions.",
    },
    {
        id: "offline-sync",
        category: "Offline & PWA",
        icon: WifiOff,
        title: "The Offline-First Illusion: Data Sync Strategies",
        project: "Flurry v2.0",
        badges: ["PWA", "Service Workers", "Background Sync"],
        problem: "Users losing data or experiencing app crashes when network connectivity drops, leading to failed message deliveries and poor UX.",
        solution: "Engineered a robust PWA architecture using Workbox Service Workers for aggressive asset caching, coupled with the Background Sync API to queue user actions locally.",
        impact: "Actions performed offline are instantly reflected in the Optimistic UI, securely queued, and automatically synchronized with MongoDB once connectivity returns.",
    },
    {
        id: "ddd-boundaries",
        category: "Architecture",
        icon: Network,
        title: "Defending Boundaries: Third-Party API Chaos",
        project: "Cybership Carrier Service",
        badges: ["Domain-Driven Design", "TypeScript", "Zod"],
        problem: "Tight coupling between internal business logic and unpredictable external carrier JSON structures, causing runtime crashes.",
        solution: "Implemented DDD principles with an isolated Anti-Corruption Layer using Zod schemas to enforce runtime validation before any external data touches the core domain.",
        impact: "Zero runtime crashes from external API changes. Custom Error Classes surface actionable feedback instead of generic 500s.",
    },
    {
        id: "cascading-filters-race",
        category: "Architecture",
        icon: Filter,
        title: "State Synchronization: The Cascading Filter Race Condition",
        project: "CS Arena",
        badges: ["Next.js 16", "URL Sync", "State Management"],
        problem: "Clearing multiple dependent filters simultaneously caused a race condition in the Next.js router, leading to UI freezing.",
        solution: "Coupled state management tightly with URL sync and leveraged useTransition to decouple UI updates from router navigation.",
        impact: "Glitch-free filtering where the UI stays responsive even during complex multi-level query parameter updates.",
    },
    {
        id: "enterprise-security",
        category: "Security",
        icon: ShieldAlert,
        title: "The Vulnerability Matrix: Enterprise-Grade Security",
        project: "Blog Pro CMS",
        badges: ["Security", "JWT", "XSS Prevention"],
        problem: "Securing a full-stack CMS against XSS, HTTP Parameter Pollution, and brute-force attacks while maintaining fast API response times.",
        solution: "Multi-layered security pipeline: Helmet for HTTP headers, XSS-Clean for sanitization, Joi for schema validation, and Redis-backed rate limiting.",
        impact: "Blocked 100% of malicious payloads and mitigated brute-force attempts with zero API performance degradation.",
    },
];

// Derived from data — adding a new scar with a new category auto-updates the filter.
export const scarCategories = ["All", ...new Set(scarsData.map((s) => s.category))];