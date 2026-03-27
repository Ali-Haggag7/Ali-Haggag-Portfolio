import { MessageSquare, Network, Code2, ShieldAlert, BarChart3, Bot, type LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image"; // Added explicit type for Next.js images
import flurryImg from "@/public/images/flurry.png";
import blogImg from "@/public/images/blog-pro.png";
import geminiImg from "@/public/images/gemini-clone-1.jpeg";
import csArenaImg from "@/public/images/cs-arena.png";

export type Autopsy = {
    challenge: string;
    architecture: string;
    impact: string;
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
};

export const projectsData: ProjectFeature[] = [
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
        autopsy: {
            challenge: "State Synchronization & Cascading Filter Race Conditions",
            architecture: "Engineered a URL-first state management system using Next.js App Router. Leveraged React's useTransition to decouple UI state updates from router navigation.",
            impact: "Zero race conditions during complex query parameter updates, ensuring a fluid, glitch-free discovery experience."
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
        autopsy: {
            challenge: "Defending Boundaries Against Unpredictable Third-Party APIs",
            architecture: "Enforced strict Domain-Driven Design (DDD) principles. Built an isolated Anti-Corruption Layer using Zod schemas to sanitize and normalize incoming UPS carrier JSON data.",
            impact: "Zero runtime crashes from external API changes, accompanied by structured custom Error Classes for actionable client feedback."
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
        autopsy: {
            challenge: "Enterprise-Grade Security Against Modern Web Vulnerabilities",
            architecture: "Engineered a multi-layered security pipeline integrating Helmet for HTTP headers, XSS-Clean for payload sanitization, Joi for schema validation, and Redis-backed rate limiting.",
            impact: "Blocked 100% of malicious payloads and mitigated aggressive DDoS attempts without degrading the sub-100ms API response times."
        }
    },
    {
        id: "admin-dashboard",
        Icon: BarChart3,
        name: "Admin Dashboard API",
        description: "Robust CRM Backend API with MVC Architecture & JWT Authentication.",
        href: "https://github.com/Ali-Haggag7/Admin-Pro-Dashboard",
        cta: "View Source",
        isGradientBg: true,
        gradientClass: "from-indigo-950 to-slate-900",
        videoSrc: "/videos/admin-dashboard-demo.mp4",
        className: "col-span-1 md:col-span-2",
        autopsy: {
            challenge: "Scalable Architecture & Centralized Error Handling",
            architecture: "Architected a RESTful API using strict MVC patterns to ensure clean codebases. Secured admin endpoints with JWT Authentication and enforced strict data validation using Joi middleware.",
            impact: "Blocked 100% of invalid data payloads and accelerated complex data reporting queries by ~35% using MongoDB Aggregation pipelines."
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
        autopsy: {
            challenge: "State Management & Streaming AI Responses",
            architecture: "Integrated the Google Gemini AI SDK with a modern React frontend. Utilized complex state management to persist chat history and handle readable streams for real-time typing effects.",
            impact: "Delivered a highly responsive clone capable of multi-turn conversations with zero UI blocking during API data fetching."
        }
    }
];