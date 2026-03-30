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
        badges: ["Socket.io", "WebRTC", "P2P Architecture"],
        problem: "Managing unpredictable connection states and achieving near-zero latency for P2P audio/video calls without heavy third-party overhead.",
        solution: "Architected a hybrid signaling server using Socket.io to manage complex handshakes, offloading media payloads directly to WebRTC P2P channels with custom ICE candidate handling.",
        impact: "Achieved <50ms latency for seamless voice/video calls and instant status sync across varying network conditions.",
    },
    {
        id: "offline-sync",
        category: "Performance",
        icon: WifiOff,
        title: "The Offline-First Illusion: Background Sync Strategies",
        project: "Flurry v2.0",
        badges: ["PWA", "Inngest", "Service Workers"],
        problem: "Users experiencing app 'freezes' or data loss during intermittent connectivity, specifically during multi-step message processing.",
        solution: "Engineered a robust sync layer using Inngest for durable background functions, ensuring user actions are queued in IndexedDB and re-hydrated once online via Workbox.",
        impact: "100% message delivery guarantee. Offline actions are reflected instantly in Optimistic UI and synced seamlessly without manual retries.",
    },
    {
        id: "ddd-boundaries",
        category: "Architecture",
        icon: Network,
        title: "Defending Boundaries: Third-Party API Chaos",
        project: "Cybership API",
        badges: ["Domain-Driven Design", "TypeScript", "Zod"],
        problem: "Runtime crashes caused by unpredictable external carrier JSON structures bleeding into the core business logic.",
        solution: "Implemented an Anti-Corruption Layer (ACL) using Zod for strict runtime schema enforcement, creating a 'Type-Safe Fortress' around the core domain.",
        impact: "Zero runtime crashes from external API changes. Developer productivity increased by 40% due to deterministic data structures.",
    },
    {
        id: "cascading-filters-race",
        category: "Architecture",
        icon: Filter,
        title: "State Sync: The Cascading Filter Race Condition",
        project: "CS Arena",
        badges: ["Next.js 15", "Server Components", "useTransition"],
        problem: "Complex multi-level filtering caused UI 'jank' and race conditions in the Next.js router when clearing multiple dependent states.",
        solution: "Leveraged Next.js 15 'useTransition' and 'useActionState' to decouple heavy URL state-sync from the main UI thread, ensuring non-blocking navigation.",
        impact: "Glitch-free, zero-latency filtering experience even with complex, deep-nested category queries.",
    },
    {
        id: "api-fortress",
        category: "Security",
        icon: ShieldAlert,
        title: "The API Fortress: Defense in Depth",
        project: "Blog Pro / Cybership",
        badges: ["JWT", "Security Middleware", "Rate Limiting"],
        problem: "Protecting full-stack applications from common vulnerabilities like XSS, Brute-force, and unauthorized state mutations without killing performance.",
        solution: "Implemented a multi-layered security pipeline: custom JWT guards for role-based access, Helmet for secure headers, and express-rate-limit to mitigate automated attacks.",
        impact: "Successfully blocked 100% of basic automated exploits during testing and ensured zero unauthorized data access in production environments.",
    },
];

export const scarCategories = ["All", ...new Set(scarsData.map((s) => s.category))];