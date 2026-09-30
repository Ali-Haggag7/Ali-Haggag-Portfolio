import {
    Activity, CheckCircle2, FlaskConical,
    Monitor, Server, Layers, Zap, Shield, Database,
    Rocket, BarChart3, Mail, Palette, Code,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Skill = {
    name: string;
    icon: string;
    status: "Battle-Tested" | "Production Ready" | "R&D / Exploring";
    projects: string[];
    scarId: string | null;
    themeable?: boolean;
    quadrant?: "frontend" | "backend" | "data" | "infra";
};

export type AccentColor =
    | "blue" | "emerald" | "violet" | "amber" | "red"
    | "cyan" | "orange" | "pink" | "indigo" | "fuchsia" | "slate";

export type SkillCategory = {
    title: string;
    icon: LucideIcon;
    accent: AccentColor;
    skills: Skill[];
};

export type SkillQuadrant = {
    id: "frontend" | "backend" | "data" | "infra";
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
    accentVar: string;
    categoryNames: string[];
};

export const SKILL_QUADRANTS: readonly SkillQuadrant[] = Object.freeze([
    {
        id: "frontend",
        title: "Frontend & Interface Engines",
        subtitle: "SSR · RSC · Motion · 3D WebGL",
        description: "Modern component architectures, streaming React Server Components, 3D Canvas scenes, and responsive design systems.",
        icon: Monitor,
        accentVar: "var(--accent-blue)",
        categoryNames: ["Frontend", "Real-time & AI", "CMS & State", "Design & UI Libs"],
    },
    {
        id: "backend",
        title: "Backend, Microservices & Runtimes",
        subtitle: "NestJS · Node · Low-Level AST",
        description: "High-throughput APIs, custom DSL compiler engines, and WebSocket event brokers.",
        icon: Server,
        accentVar: "var(--accent-emerald)",
        categoryNames: ["Backend", "CS & Tools"],
    },
    {
        id: "data",
        title: "Data Architecture, Storage & APIs",
        subtitle: "PostgreSQL · Redis · Zod ACL",
        description: "Relational modeling, high-speed in-memory caches, and strict schema validation boundaries.",
        icon: Database,
        accentVar: "var(--accent-purple)",
        categoryNames: ["ORM & API Layer"],
    },
    {
        id: "infra",
        title: "DevSecOps, Cloud & Infrastructure",
        subtitle: "Docker · JWT · Telemetry · CI/CD",
        description: "Containerized deployments, Zero-Trust JWT authentication, telemetry tracking, and automated pipelines.",
        icon: Shield,
        accentVar: "var(--accent-yellow, var(--accent-blue))",
        categoryNames: ["Deploy & DevOps", "Auth & Security", "Monitoring & Analytics", "Email Services"],
    },
]);

export const SCAR_TITLES: Record<string, string> = {
    "cascading-filters-race": "The Cascading Filters Render Race",
    "ddd-boundaries": "The Leaky Domain-Driven Boundaries",
    "logic-arena-pathfinding": "The Logic Arena Pathfinding Blockade",
    "offline-sync": "The Desynchronized Offline Mutation Queue",
    "graphql-lying-zeros": "The GraphQL Lying Zeros Anomaly",
    "redis-ipv6-docker": "The Redis IPv6 Docker Loophole",
    "webrtc-latency": "The WebRTC Peer Discovery Freezefall",
    "api-fortress": "The Broken JWT Token Revocation Loop",
    "logic-arena-compiler": "The Infinite Loop AST Memory Exhaustion",
};

export const MODAL_EXIT_DURATION = 300;

export const technicalArsenal: SkillCategory[] = [
    {
        title: "Frontend",
        icon: Monitor,
        accent: "blue",
        skills: [
            { name: "Next.js 15/16", icon: "/skills/nextjs.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "CS Arena", "Logic Arena", "My Portfolio"], scarId: "cascading-filters-race", themeable: true, quadrant: "frontend" },
            { name: "React", icon: "/skills/react.svg", status: "Production Ready", projects: ["Flurry v2.0", "CS Arena", "Logic Arena", "Gemini Clone"], scarId: null, quadrant: "frontend" },
            { name: "TypeScript", icon: "/skills/typescript.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "Cybership API", "Logic Arena", "My Portfolio"], scarId: "ddd-boundaries", quadrant: "frontend" },
            { name: "JavaScript", icon: "/skills/javascript.svg", status: "Production Ready", projects: ["Legacy Projects", "Core Logic"], scarId: null, quadrant: "frontend" },
            { name: "Redux", icon: "/skills/redux.svg", status: "Production Ready", projects: ["Blog Pro", "Flurry v2.0"], scarId: null, quadrant: "frontend" },
            { name: "Tailwind CSS", icon: "/skills/tailwindcss.svg", status: "Production Ready", projects: ["All Modern Projects"], scarId: null, quadrant: "frontend" },
            { name: "Bootstrap", icon: "/skills/bootstrap.svg", status: "Production Ready", projects: ["Legacy Web Projects"], scarId: null, quadrant: "frontend" },
        ],
    },
    {
        title: "Backend",
        icon: Server,
        accent: "emerald",
        skills: [
            { name: "Node.js", icon: "/skills/nodejs.svg", status: "Production Ready", projects: ["Cybership API", "Blog Pro", "Flurry v2.0", "Logic Arena"], scarId: null, quadrant: "backend" },
            { name: "MongoDB", icon: "/skills/mongodb.svg", status: "Production Ready", projects: ["Flurry v2.0", "Blog Pro", "Admin Dashboard"], scarId: null, quadrant: "data" },
            { name: "Firebase", icon: "/skills/firebase.svg", status: "Production Ready", projects: ["Flurry v2.0", "Realtime Chat Engine"], scarId: null, quadrant: "data" },
            { name: "Supabase", icon: "/skills/supabase.svg", status: "Production Ready", projects: ["E-commerce Lab", "Logic Arena"], scarId: null, quadrant: "data" },
            { name: "PostgreSQL", icon: "/skills/postgresql.svg", status: "Production Ready", projects: ["E-commerce Lab", "Logic Arena"], scarId: null, quadrant: "data" },
            { name: "NestJS", icon: "/skills/nestjs.svg", status: "Battle-Tested", projects: ["Logic Arena"], scarId: "logic-arena-pathfinding", quadrant: "backend" },
        ],
    },
    {
        title: "ORM & API Layer",
        icon: Layers,
        accent: "violet",
        skills: [
            { name: "Prisma", icon: "/skills/prisma.svg", status: "Production Ready", projects: ["E-commerce Lab", "Real Time Chat Engine", "Logic Arena"], scarId: null, quadrant: "data" },
            { name: "Inngest", icon: "/skills/inngest.webp", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "offline-sync", quadrant: "data" },
            { name: "Zod", icon: "/skills/zod.svg", status: "Battle-Tested", projects: ["Cybership API", "CS Arena", "Flurry v2.0", "Logic Arena"], scarId: "ddd-boundaries", quadrant: "data" },
            { name: "GraphQL", icon: "/skills/graphql.svg", status: "Battle-Tested", projects: ["Portfolio"], scarId: "graphql-lying-zeros", quadrant: "data" },
            { name: "Redis", icon: "/skills/redis.svg", status: "Battle-Tested", projects: ["Logic Arena"], scarId: "redis-ipv6-docker", quadrant: "data" },
        ],
    },
    {
        title: "Real-time & AI",
        icon: Zap,
        accent: "amber",
        skills: [
            { name: "Socket.io", icon: "/skills/socketio.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "Logic Arena"], scarId: "webrtc-latency", themeable: true, quadrant: "backend" },
            { name: "WebRTC", icon: "/skills/webrtc.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "webrtc-latency", themeable: true, quadrant: "backend" },
            { name: "Three.js / R3F", icon: "/skills/threejs.svg", status: "Production Ready", projects: ["Logic Arena"], scarId: null, themeable: true, quadrant: "frontend" },
            { name: "Google Gemini", icon: "/skills/google.svg", status: "Production Ready", projects: ["Flurry v2.0", "Gemini Clone", "My Portfolio"], scarId: null, quadrant: "backend" },
            { name: "PWA", icon: "/skills/pwa.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "CS Arena", "Logic Arena", "My Portfolio"], scarId: "offline-sync", quadrant: "frontend" },
        ],
    },
    {
        title: "Auth & Security",
        icon: Shield,
        accent: "red",
        skills: [
            { name: "JWT", icon: "/skills/jwt.svg", status: "Battle-Tested", projects: ["Blog Pro", "Cybership API"], scarId: "api-fortress", quadrant: "infra" },
            { name: "Clerk", icon: "/skills/clerk.svg", status: "Production Ready", projects: ["Flurry v2.0"], scarId: null, quadrant: "infra" },
            { name: "NextAuth", icon: "/skills/nextauth.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, quadrant: "infra" },
            { name: "OAuth", icon: "/skills/oauth.svg", status: "Production Ready", projects: ["CS Arena", "Logic Arena"], scarId: null, themeable: true, quadrant: "infra" },
        ],
    },
    {
        title: "CMS & State",
        icon: Database,
        accent: "cyan",
        skills: [
            { name: "Sanity", icon: "/skills/sanity.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, themeable: true, quadrant: "data" },
            { name: "Zustand", icon: "/skills/zustand.png", status: "Production Ready", projects: ["Real Time Chat Engine"], scarId: null, quadrant: "frontend" },
            { name: "React Query", icon: "/skills/reactquery.svg", status: "Production Ready", projects: ["Flurry v2.0 (Optimistic UI)"], scarId: null, quadrant: "frontend" },
            { name: "I18next", icon: "/skills/i18next.svg", status: "Production Ready", projects: ["Flurry v2.0", "CS Arena"], scarId: null, quadrant: "frontend" },
        ],
    },
    {
        title: "Deploy & DevOps",
        icon: Rocket,
        accent: "orange",
        skills: [
            { name: "Vercel", icon: "/skills/vercel.svg", status: "Production Ready", projects: ["All Modern Apps"], scarId: null, themeable: true, quadrant: "infra" },
            { name: "DigitalOcean", icon: "/skills/digitalocean.svg", status: "Production Ready", projects: ["Logic Arena Deployment"], scarId: null, quadrant: "infra" },
            { name: "Docker", icon: "/skills/docker.svg", status: "Production Ready", projects: ["Logic Arena Deployment"], scarId: null, quadrant: "infra" },
            { name: "Nginx", icon: "/skills/nginx.svg", status: "Production Ready", projects: ["Logic Arena Deployment"], scarId: null, quadrant: "infra" },
            { name: "Azure", icon: "/skills/azure.svg", status: "R&D / Exploring", projects: ["Cloud Architecture Lab"], scarId: null, quadrant: "infra" },
            { name: "Sevalla", icon: "/skills/sevalla.jpeg", status: "Production Ready", projects: ["Flurry v2.0 Backend"], scarId: null, quadrant: "infra" },
        ],
    },
    {
        title: "Monitoring & Analytics",
        icon: BarChart3,
        accent: "pink",
        skills: [
            { name: "Sentry", icon: "/skills/sentry.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, quadrant: "infra" },
            { name: "Azure Monitor", icon: "/skills/azuremonitor.svg", status: "R&D / Exploring", projects: ["Infrastructure Health"], scarId: null, quadrant: "infra" },
        ],
    },
    {
        title: "Email Services",
        icon: Mail,
        accent: "indigo",
        skills: [
            { name: "Resend", icon: "/skills/resend.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, themeable: true, quadrant: "infra" },
            { name: "Nodemailer", icon: "/skills/nodemailer.png", status: "Production Ready", projects: ["Flurry v2.0", "Blog Pro", "Logic Arena"], scarId: null, quadrant: "infra" },
            { name: "Mailtrap", icon: "/skills/mailtrap.svg", status: "Production Ready", projects: ["Flurry v2.0 (Dev Testing)", "Logic Arena (Dev Testing)"], scarId: null, quadrant: "infra" },
        ],
    },
    {
        title: "Design & UI Libs",
        icon: Palette,
        accent: "fuchsia",
        skills: [
            { name: "Figma", icon: "/skills/figma.svg", status: "Production Ready", projects: ["UI/UX Prototyping"], scarId: null, quadrant: "frontend" },
            { name: "Shadcn/UI", icon: "/skills/shadcn.svg", status: "Production Ready", projects: ["CS Arena", "My Portfolio"], scarId: null, themeable: true, quadrant: "frontend" },
            { name: "Framer Motion", icon: "/skills/framermotion.svg", status: "Production Ready", projects: ["Most Modern Projects"], scarId: null, quadrant: "frontend" },
            { name: "Material UI", icon: "/skills/mui.svg", status: "Production Ready", projects: ["Youtube Clone"], scarId: null, quadrant: "frontend" },
            { name: "Magic UI", icon: "/skills/magicui.svg", status: "Production Ready", projects: ["Portfolio Motion"], scarId: null, quadrant: "frontend" },
        ],
    },
    {
        title: "CS & Tools",
        icon: Code,
        accent: "slate",
        skills: [
            { name: "C++", icon: "/skills/cpp.svg", status: "Production Ready", projects: ["Competitive Programming", "Algorithms"], scarId: null, quadrant: "backend" },
            { name: "AST & Compiler Design", icon: "/skills/compiler.svg", status: "Battle-Tested", projects: ["Logic Arena (AliScript Engine)"], scarId: "logic-arena-compiler", quadrant: "backend" },
            { name: "pnpm Workspaces", icon: "/skills/pnpm.svg", status: "Production Ready", projects: ["Logic Arena"], scarId: null, quadrant: "backend" },
            { name: "Postman", icon: "/skills/postman.svg", status: "Production Ready", projects: ["API Lifecycle Testing"], scarId: null, quadrant: "backend" },
            { name: "Git", icon: "/skills/git.svg", status: "Production Ready", projects: ["Version Control"], scarId: null, quadrant: "infra" },
            { name: "GitHub", icon: "/skills/github.svg", status: "Production Ready", projects: ["Open Source / CI/CD"], scarId: null, themeable: true, quadrant: "infra" },
            { name: "GitLab", icon: "/skills/gitlab.svg", status: "Production Ready", projects: ["AI Agents Collaboration"], scarId: null, quadrant: "infra" },
        ],
    },
];

// ── Pre-computed lookups ──────────────────────────────────────────────

/** O(1) skill lookup by name */
export const SKILL_MAP = new Map<string, Skill>(
    technicalArsenal.flatMap(c => c.skills).map(s => [s.name, s])
);

/** Pre-computed stats for the arsenal summary bar */
export const arsenalStats = (() => {
    const all = technicalArsenal.flatMap(c => c.skills);
    return {
        total: all.length,
        battleTested: all.filter(s => s.status === "Battle-Tested").length,
        productionReady: all.filter(s => s.status === "Production Ready").length,
        exploring: all.filter(s => s.status === "R&D / Exploring").length,
        withScars: all.filter(s => s.scarId !== null).length,
    };
})();

// ── Status configs with 100% CSS Variables (zero raw Tailwind colors) ──

const STATUS_CONFIG = {
    "Battle-Tested": {
        color: "text-[hsl(var(--accent-purple))]",
        bg: "bg-[hsl(var(--accent-purple)/0.12)]",
        border: "border-[hsl(var(--accent-purple)/0.3)]",
        badge: "BATTLE-TESTED",
        icon: Activity,
    },
    "Production Ready": {
        color: "text-[hsl(var(--accent-emerald))]",
        bg: "bg-[hsl(var(--accent-emerald)/0.12)]",
        border: "border-[hsl(var(--accent-emerald)/0.3)]",
        badge: "PRODUCTION READY",
        icon: CheckCircle2,
    },
    "R&D / Exploring": {
        color: "text-[hsl(var(--accent-blue))]",
        bg: "bg-[hsl(var(--accent-blue)/0.12)]",
        border: "border-[hsl(var(--accent-blue)/0.3)]",
        badge: "R&D / EVALUATING",
        icon: FlaskConical,
    },
} as const;

export const getStatusConfig = (status: Skill["status"]) => STATUS_CONFIG[status];

export const STATUS_PROGRESS: Record<Skill["status"], {
    percent: number;
    barColor: string;
}> = {
    "R&D / Exploring":  { percent: 40, barColor: "bg-[hsl(var(--accent-blue))]" },
    "Production Ready": { percent: 80, barColor: "bg-[hsl(var(--accent-emerald))]" },
    "Battle-Tested":    { percent: 100, barColor: "bg-[hsl(var(--accent-purple))]" },
};

// ── Navigation helper ──────────────────────────────────────────────────

interface RouterLike {
    push(href: string, options?: { scroll?: boolean }): void;
}

export const handleJumpToScar = (scarId: string, onClose: () => void, router: RouterLike) => {
    onClose();
    router.push(`?scar=${scarId}`, { scroll: false });
    setTimeout(() => {
        const element = document.getElementById("battle-scars");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, 300);
};