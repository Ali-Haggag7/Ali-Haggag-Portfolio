import { Swords, WifiOff, Network, Filter, ShieldAlert } from "lucide-react";

export const scarCategories = ["All", "Real-Time", "Architecture", "Offline & PWA", "Security"];

export const scarsData = [
    {
        id: "webrtc-latency",
        category: "Real-Time",
        icon: Swords,
        title: "Real-Time Combat: The WebRTC Signaling Dilemma",
        project: "Flurry v2.0",
        badges: ["Socket.io", "WebRTC", "P2P"],
        problem: "Managing unpredictable connection states and achieving near-zero latency for peer-to-peer audio and video calls without relying on heavy third-party plugins.",
        solution: "Architected a hybrid signaling server using Socket.io to reliably manage the complex handshake states, offloading the heavy media streaming payload directly to WebRTC P2P channels.",
        impact: "Achieved <50ms latency for seamless voice notes, video calls, and instant read receipts across different network conditions."
    },
    {
        id: "offline-sync",
        category: "Offline & PWA",
        icon: WifiOff,
        title: "The Offline-First Illusion: Data Sync Strategies",
        project: "Flurry v2.0",
        badges: ["PWA", "Service Workers", "Background Sync"],
        problem: "Users losing data or experiencing app crashes when network connectivity drops, leading to failed message deliveries and poor UX.",
        solution: "Engineered a robust Progressive Web App (PWA) architecture utilizing Workbox Service Workers for aggressive asset caching, coupled with the Background Sync API to queue user actions locally.",
        impact: "Actions performed offline (like sending messages) are instantly reflected in the Optimistic UI, securely queued, and automatically synchronized with MongoDB once connectivity returns."
    },
    {
        id: "ddd-boundaries",
        category: "Architecture",
        icon: Network,
        title: "Defending Boundaries: Third-Party API Chaos",
        project: "Cybership Carrier Service",
        badges: ["Domain-Driven Design", "TypeScript", "Zod"],
        problem: "Tight coupling between internal business logic and unpredictable, constantly changing external carrier (UPS) JSON data structures, causing runtime crashes.",
        solution: "Implemented strict Domain-Driven Design (DDD) principles. Created an isolated Anti-Corruption Layer with Zod schemas to enforce strict runtime validation before any external HTTP calls reach the core domain.",
        impact: "Zero runtime crashes due to external API changes. Structured custom Error Classes provide actionable feedback to the client instead of generic 500 errors."
    },
    {
        id: "cascading-filters-race",
        category: "Architecture",
        icon: Filter,
        title: "State Synchronization: The Cascading Filter Race Condition",
        project: "CS Arena",
        badges: ["Next.js 16", "URL Sync", "State Management"],
        problem: "Clearing multiple dependent filters (Subdomain and Tech) simultaneously when a parent category (Domain) changes, causing a race condition in the Next.js router and UI freezing.",
        solution: "Implemented careful state management tightly coupled with URL synchronization, leveraging React's useTransition to decouple the UI state updates from the router navigation.",
        impact: "Achieved a fluid, glitch-free filtering experience where the UI remains highly responsive even during complex multi-level query parameter updates."
    },
    {
        id: "enterprise-security",
        category: "Security",
        icon: ShieldAlert,
        title: "The Vulnerability Matrix: Enterprise-Grade Security",
        project: "Blog Pro CMS",
        badges: ["Security", "JWT", "XSS Prevention"],
        problem: "Securing a full-stack CMS against modern web vulnerabilities like Cross-Site Scripting (XSS), HTTP Parameter Pollution (HPP), and brute-force attacks while maintaining fast API response times.",
        solution: "Engineered a multi-layered security pipeline integrating Helmet for HTTP headers, XSS-Clean for payload sanitization, strict Joi schema validation, and Redis-backed rate limiting.",
        impact: "Blocked 100% of malicious data payloads and mitigated brute-force attempts without degrading the API performance or user experience."
    }
];