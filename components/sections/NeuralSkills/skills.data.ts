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

export const MODAL_EXIT_DURATION = 300;

export const technicalArsenal: SkillCategory[] = [
    {
        title: "Frontend",
        icon: Monitor,
        accent: "blue",
        skills: [
            { name: "Next.js 15/16", icon: "/skills/nextjs.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "CS Arena", "Logic Arena", "My Portfolio"], scarId: "cascading-filters-race", themeable: true },
            { name: "React", icon: "/skills/react.svg", status: "Production Ready", projects: ["Flurry v2.0", "CS Arena", "Logic Arena", "Gemini Clone"], scarId: null },
            { name: "TypeScript", icon: "/skills/typescript.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "Cybership API", "Logic Arena", "My Portfolio"], scarId: "ddd-boundaries" },
            { name: "JavaScript", icon: "/skills/javascript.svg", status: "Production Ready", projects: ["Legacy Projects", "Core Logic"], scarId: null },
            { name: "Redux", icon: "/skills/redux.svg", status: "Production Ready", projects: ["Blog Pro", "Flurry v2.0"], scarId: null },
            { name: "Tailwind CSS", icon: "/skills/tailwindcss.svg", status: "Production Ready", projects: ["All Modern Projects"], scarId: null },
            { name: "Bootstrap", icon: "/skills/bootstrap.svg", status: "Production Ready", projects: ["Legacy Web Projects"], scarId: null },
        ],
    },
    {
        title: "Backend",
        icon: Server,
        accent: "emerald",
        skills: [
            { name: "Node.js", icon: "/skills/nodejs.svg", status: "Production Ready", projects: ["Cybership API", "Blog Pro", "Flurry v2.0", "Logic Arena"], scarId: null },
            { name: "MongoDB", icon: "/skills/mongodb.svg", status: "Production Ready", projects: ["Flurry v2.0", "Blog Pro", "Admin Dashboard"], scarId: null },
            { name: "Firebase", icon: "/skills/firebase.svg", status: "Production Ready", projects: ["Flurry v2.0", "Realtime Chat Engine"], scarId: null },
            { name: "Supabase", icon: "/skills/supabase.svg", status: "Production Ready", projects: ["E-commerce Lab", "Logic Arena"], scarId: null },
            { name: "PostgreSQL", icon: "/skills/postgresql.svg", status: "Production Ready", projects: ["E-commerce Lab", "Logic Arena"], scarId: null },
            { name: "NestJS", icon: "/skills/nestjs.svg", status: "Battle-Tested", projects: ["Logic Arena"], scarId: "logic-arena-pathfinding" },
        ],
    },
    {
        title: "ORM & API Layer",
        icon: Layers,
        accent: "violet",
        skills: [
            { name: "Prisma", icon: "/skills/prisma.svg", status: "Production Ready", projects: ["E-commerce Lab", "Real Time Chat Engine", "Logic Arena"], scarId: null },
            { name: "Inngest", icon: "/skills/inngest.webp", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "offline-sync" },
            { name: "Zod", icon: "/skills/zod.svg", status: "Battle-Tested", projects: ["Cybership API", "CS Arena", "Flurry v2.0", "Logic Arena"], scarId: "ddd-boundaries" },
            { name: "GraphQL", icon: "/skills/graphql.svg", status: "Battle-Tested", projects: ["Portfolio"], scarId: "graphql-lying-zeros" },
            { name: "Redis", icon: "/skills/redis.svg", status: "Battle-Tested", projects: ["Logic Arena"], scarId: "redis-ipv6-docker" },
        ],
    },
    {
        title: "Real-time & AI",
        icon: Zap,
        accent: "amber",
        skills: [
            { name: "Socket.io", icon: "/skills/socketio.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "Logic Arena"], scarId: "webrtc-latency", themeable: true },
            { name: "WebRTC", icon: "/skills/webrtc.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "webrtc-latency", themeable: true },
            { name: "Three.js / R3F", icon: "/skills/threejs.svg", status: "Production Ready", projects: ["Logic Arena"], scarId: null, themeable: true },
            { name: "Google Gemini", icon: "/skills/google.svg", status: "Production Ready", projects: ["Flurry v2.0", "Gemini Clone", "My Portfolio"], scarId: null },
            { name: "PWA", icon: "/skills/pwa.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "CS Arena", "Logic Arena", "My Portfolio"], scarId: "offline-sync" },
        ],
    },
    {
        title: "Auth & Security",
        icon: Shield,
        accent: "red",
        skills: [
            { name: "JWT", icon: "/skills/jwt.svg", status: "Battle-Tested", projects: ["Blog Pro", "Cybership API"], scarId: "api-fortress" },
            { name: "Clerk", icon: "/skills/clerk.svg", status: "Production Ready", projects: ["Flurry v2.0"], scarId: null },
            { name: "NextAuth", icon: "/skills/nextauth.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null },
            { name: "OAuth", icon: "/skills/oauth.svg", status: "Production Ready", projects: ["CS Arena", "Logic Arena"], scarId: null, themeable: true },
        ],
    },
    {
        title: "CMS & State",
        icon: Database,
        accent: "cyan",
        skills: [
            { name: "Sanity", icon: "/skills/sanity.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, themeable: true },
            { name: "Zustand", icon: "/skills/zustand.png", status: "Production Ready", projects: ["Real Time Chat Engine"], scarId: null },
            { name: "React Query", icon: "/skills/reactquery.svg", status: "Production Ready", projects: ["Flurry v2.0 (Optimistic UI)"], scarId: null },
            { name: "I18next", icon: "/skills/i18next.svg", status: "Production Ready", projects: ["Flurry v2.0", "CS Arena"], scarId: null },
        ],
    },
    {
        title: "Deploy & DevOps",
        icon: Rocket,
        accent: "orange",
        skills: [
            { name: "Vercel", icon: "/skills/vercel.svg", status: "Production Ready", projects: ["All Modern Apps"], scarId: null, themeable: true },
            { name: "DigitalOcean", icon: "/skills/digitalocean.svg", status: "Production Ready", projects: ["Logic Arena Deployment"], scarId: null },
            { name: "Docker", icon: "/skills/docker.svg", status: "Production Ready", projects: ["Logic Arena Deployment"], scarId: null },
            { name: "Nginx", icon: "/skills/nginx.svg", status: "Production Ready", projects: ["Logic Arena Deployment"], scarId: null },
            { name: "Azure", icon: "/skills/azure.svg", status: "R&D / Exploring", projects: ["Cloud Architecture Lab"], scarId: null },
            { name: "Sevalla", icon: "/skills/sevalla.jpeg", status: "Production Ready", projects: ["Flurry v2.0 Backend"], scarId: null },
        ],
    },
    {
        title: "Monitoring & Analytics",
        icon: BarChart3,
        accent: "pink",
        skills: [
            { name: "Sentry", icon: "/skills/sentry.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null },
            { name: "Azure Monitor", icon: "/skills/azuremonitor.svg", status: "R&D / Exploring", projects: ["Infrastructure Health"], scarId: null },
        ],
    },
    {
        title: "Email Services",
        icon: Mail,
        accent: "indigo",
        skills: [
            { name: "Resend", icon: "/skills/resend.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, themeable: true },
            { name: "Nodemailer", icon: "/skills/nodemailer.png", status: "Production Ready", projects: ["Flurry v2.0", "Blog Pro", "Logic Arena"], scarId: null },
            { name: "Mailtrap", icon: "/skills/mailtrap.svg", status: "Production Ready", projects: ["Flurry v2.0 (Dev Testing)", "Logic Arena (Dev Testing)"], scarId: null },
        ],
    },
    {
        title: "Design & UI Libs",
        icon: Palette,
        accent: "fuchsia",
        skills: [
            { name: "Figma", icon: "/skills/figma.svg", status: "Production Ready", projects: ["UI/UX Prototyping"], scarId: null },
            { name: "Shadcn/UI", icon: "/skills/shadcn.svg", status: "Production Ready", projects: ["CS Arena", "My Portfolio"], scarId: null, themeable: true },
            { name: "Framer Motion", icon: "/skills/framermotion.svg", status: "Production Ready", projects: ["Most Modern Projects"], scarId: null },
            { name: "Material UI", icon: "/skills/mui.svg", status: "Production Ready", projects: ["Youtube Clone"], scarId: null },
            { name: "Magic UI", icon: "/skills/magicui.svg", status: "Production Ready", projects: ["Portfolio Motion"], scarId: null },
        ],
    },
    {
        title: "CS & Tools",
        icon: Code,
        accent: "slate",
        skills: [
            { name: "C++", icon: "/skills/cpp.svg", status: "Production Ready", projects: ["Competitive Programming", "Algorithms"], scarId: null },
            { name: "AST & Compiler Design", icon: "/skills/compiler.svg", status: "Battle-Tested", projects: ["Logic Arena (AliScript Engine)"], scarId: "logic-arena-compiler" },
            { name: "pnpm Workspaces", icon: "/skills/pnpm.svg", status: "Production Ready", projects: ["Logic Arena"], scarId: null },
            { name: "Postman", icon: "/skills/postman.svg", status: "Production Ready", projects: ["API Lifecycle Testing"], scarId: null },
            { name: "Git", icon: "/skills/git.svg", status: "Production Ready", projects: ["Version Control"], scarId: null },
            { name: "GitHub", icon: "/skills/github.svg", status: "Production Ready", projects: ["Open Source / CI/CD"], scarId: null, themeable: true },
            { name: "GitLab", icon: "/skills/gitlab.svg", status: "Production Ready", projects: ["AI Agents Collaboration"], scarId: null },
        ],
    },
];

// ── Pre-computed lookups (module-level, zero runtime cost) ──────────────

/** O(1) skill lookup by name — replaces flatMap+find on every click */
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

// ── Accent color → Tailwind class mapping ──────────────────────────────
// All classes written explicitly so Tailwind JIT detects them at build time.

export const ACCENT_STYLES: Record<AccentColor, {
    dot: string;
    border: string;
    shadow: string;
    overlay: string;
}> = {
    blue:    { dot: "bg-blue-500",    border: "hover:border-blue-500/30",    shadow: "hover:shadow-blue-500/5",    overlay: "bg-blue-500/5" },
    emerald: { dot: "bg-emerald-500", border: "hover:border-emerald-500/30", shadow: "hover:shadow-emerald-500/5", overlay: "bg-emerald-500/5" },
    violet:  { dot: "bg-violet-500",  border: "hover:border-violet-500/30",  shadow: "hover:shadow-violet-500/5",  overlay: "bg-violet-500/5" },
    amber:   { dot: "bg-amber-500",   border: "hover:border-amber-500/30",   shadow: "hover:shadow-amber-500/5",   overlay: "bg-amber-500/5" },
    red:     { dot: "bg-red-500",     border: "hover:border-red-500/30",     shadow: "hover:shadow-red-500/5",     overlay: "bg-red-500/5" },
    cyan:    { dot: "bg-cyan-500",    border: "hover:border-cyan-500/30",    shadow: "hover:shadow-cyan-500/5",    overlay: "bg-cyan-500/5" },
    orange:  { dot: "bg-orange-500",  border: "hover:border-orange-500/30",  shadow: "hover:shadow-orange-500/5",  overlay: "bg-orange-500/5" },
    pink:    { dot: "bg-pink-500",    border: "hover:border-pink-500/30",    shadow: "hover:shadow-pink-500/5",    overlay: "bg-pink-500/5" },
    indigo:  { dot: "bg-indigo-500",  border: "hover:border-indigo-500/30",  shadow: "hover:shadow-indigo-500/5",  overlay: "bg-indigo-500/5" },
    fuchsia: { dot: "bg-fuchsia-500", border: "hover:border-fuchsia-500/30", shadow: "hover:shadow-fuchsia-500/5", overlay: "bg-fuchsia-500/5" },
    slate:   { dot: "bg-slate-500",   border: "hover:border-slate-500/30",   shadow: "hover:shadow-slate-500/5",   overlay: "bg-slate-500/5" },
};

// ── Status configs ─────────────────────────────────────────────────────

const STATUS_CONFIG = {
    "Battle-Tested": {
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-500/10",
        icon: Activity
    },
    "Production Ready": {
        color: "text-emerald-600 dark:text-emerald-500",
        bg: "bg-emerald-500/10",
        icon: CheckCircle2
    },
    "R&D / Exploring": {
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10",
        icon: FlaskConical
    },
} as const;

export const getStatusConfig = (status: Skill["status"]) => STATUS_CONFIG[status];

/** Mastery progress bar config — maps status to visual progress */
export const STATUS_PROGRESS: Record<Skill["status"], {
    percent: number;
    barColor: string;
    glowClass: string;
}> = {
    "R&D / Exploring":  { percent: 30,  barColor: "bg-blue-500",   glowClass: "" },
    "Production Ready": { percent: 70,  barColor: "bg-emerald-500", glowClass: "" },
    "Battle-Tested":    { percent: 100, barColor: "bg-violet-500",  glowClass: "shadow-[0_0_12px_rgba(139,92,246,0.5)]" },
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