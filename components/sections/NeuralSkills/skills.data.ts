import { Activity, CheckCircle2, FlaskConical } from "lucide-react";

export type Skill = {
    name: string;
    icon: string;
    status: "Battle-Tested" | "Production Ready" | "R&D / Exploring";
    projects: string[];
    scarId: string | null;
    themeable?: boolean;
};

export type SkillCategory = {
    title: string;
    skills: Skill[];
};

export const MODAL_EXIT_DURATION = 300;

export const technicalArsenal: SkillCategory[] = [
    {
        title: "Frontend",
        skills: [
            { name: "Next.js 15", icon: "/skills/nextjs.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "CS Arena", "My Portfolio"], scarId: "cascading-filters-race", themeable: true },
            { name: "React", icon: "/skills/react.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "CS Arena", "Gemini Clone"], scarId: null },
            { name: "TypeScript", icon: "/skills/typescript.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "Cybership API", "My Portfolio"], scarId: "ddd-boundaries" },
            { name: "JavaScript", icon: "/skills/javascript.svg", status: "Production Ready", projects: ["Legacy Projects", "Core Logic"], scarId: null },
            { name: "Redux", icon: "/skills/redux.svg", status: "Production Ready", projects: ["Blog Pro", "Flurry v2.0"], scarId: null },
            { name: "Tailwind CSS", icon: "/skills/tailwindcss.svg", status: "Battle-Tested", projects: ["All Modern Projects"], scarId: null },
            { name: "Bootstrap", icon: "/skills/bootstrap.svg", status: "Production Ready", projects: ["Legacy Web Projects"], scarId: null },
        ],
    },
    {
        title: "Backend",
        skills: [
            { name: "Node.js", icon: "/skills/nodejs.svg", status: "Battle-Tested", projects: ["Cybership API", "Blog Pro", "Flurry v2.0"], scarId: null },
            { name: "MongoDB", icon: "/skills/mongodb.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "Blog Pro", "Admin Dashboard"], scarId: null },
            { name: "Firebase", icon: "/skills/firebase.svg", status: "Production Ready", projects: ["Flurry v2.0", "Realtime Chat Engine"], scarId: null },
            { name: "Supabase", icon: "/skills/supabase.svg", status: "R&D / Exploring", projects: ["E-commerce Lab"], scarId: null },
            { name: "PostgreSQL", icon: "/skills/postgresql.svg", status: "R&D / Exploring", projects: ["E-commerce Lab"], scarId: null },
            { name: "NestJS", icon: "/skills/nestjs.svg", status: "R&D / Exploring", projects: ["Upcoming Architecture"], scarId: null },
        ],
    },
    {
        title: "ORM & API Layer",
        skills: [
            { name: "Prisma", icon: "/skills/prisma.svg", status: "Production Ready", projects: ["E-commerce Lab", "Real Time Chat Engine"], scarId: null },
            { name: "Inngest", icon: "/skills/inngest.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "offline-sync" }, // Tied to background job sync logic
            { name: "Zod", icon: "/skills/zod.svg", status: "Battle-Tested", projects: ["Cybership API", "CS Arena", "Flurry v2.0"], scarId: "ddd-boundaries" },
            { name: "GraphQL", icon: "/skills/graphql.svg", status: "R&D / Exploring", projects: ["In-progress"], scarId: null },
            { name: "Redis", icon: "/skills/redis.svg", status: "Production Ready", projects: ["Flurry v2.0 (Caching Layer)"], scarId: null },
        ],
    },
    {
        title: "Real-time & AI",
        skills: [
            { name: "Socket.io", icon: "/skills/socketio.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "webrtc-latency", themeable: true },
            { name: "WebRTC", icon: "/skills/webrtc.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "webrtc-latency", themeable: true },
            { name: "Google Gemini", icon: "/skills/google.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "Gemini Clone", "My Portfolio"], scarId: null },
            { name: "PWA", icon: "/skills/pwa.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "CS Arena", "My Portfolio"], scarId: "offline-sync" },
        ],
    },
    {
        title: "Auth & Security",
        skills: [
            { name: "JWT", icon: "/skills/jwt.svg", status: "Battle-Tested", projects: ["Blog Pro", "Cybership API"], scarId: "enterprise-security" },
            { name: "Clerk", icon: "/skills/clerk.svg", status: "Production Ready", projects: ["Flurry v2.0"], scarId: null },
            { name: "NextAuth", icon: "/skills/nextauth.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null },
            { name: "OAuth", icon: "/skills/oauth.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, themeable: true },
        ],
    },
    {
        title: "CMS & State",
        skills: [
            { name: "Sanity", icon: "/skills/sanity.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, themeable: true },
            { name: "Zustand", icon: "/skills/zustand.png", status: "Production Ready", projects: ["Real Time Chat Engine"], scarId: null },
            { name: "React Query", icon: "/skills/reactquery.svg", status: "Production Ready", projects: ["Flurry v2.0 (Optimistic UI)"], scarId: null },
            { name: "I18next", icon: "/skills/i18next.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "CS Arena"], scarId: null },
        ],
    },
    {
        title: "Deploy & DevOps",
        skills: [
            { name: "Vercel", icon: "/skills/vercel.svg", status: "Battle-Tested", projects: ["All Modern Apps"], scarId: null, themeable: true },
            { name: "DigitalOcean", icon: "/skills/digitalocean.svg", status: "R&D / Exploring", projects: ["Droplet Experimentation"], scarId: null },
            { name: "Azure", icon: "/skills/azure.svg", status: "R&D / Exploring", projects: ["Cloud Architecture Lab"], scarId: null },
            { name: "Sevalla", icon: "/skills/sevalla.jpeg", status: "Production Ready", projects: ["Flurry v2.0 Backend"], scarId: null },
        ],
    },
    {
        title: "Monitoring & Analytics",
        skills: [
            { name: "Sentry", icon: "/skills/sentry.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null },
            { name: "Azure Monitor", icon: "/skills/azuremonitor.svg", status: "R&D / Exploring", projects: ["Infrastructure Health"], scarId: null },
        ],
    },
    {
        title: "Email Services",
        skills: [
            { name: "Resend", icon: "/skills/resend.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, themeable: true },
            { name: "Nodemailer", icon: "/skills/nodemailer.png", status: "Production Ready", projects: ["Flurry v2.0", "Blog Pro"], scarId: null },
            { name: "Mailtrap", icon: "/skills/mailtrap.svg", status: "Production Ready", projects: ["Flurry v2.0 (Dev Testing)"], scarId: null },
        ],
    },
    {
        title: "Design & UI Libs",
        skills: [
            { name: "Figma", icon: "/skills/figma.svg", status: "Production Ready", projects: ["UI/UX Prototyping"], scarId: null },
            { name: "Shadcn/UI", icon: "/skills/shadcn.svg", status: "Battle-Tested", projects: ["CS Arena", "My Portfolio"], scarId: null, themeable: true },
            { name: "Material UI", icon: "/skills/mui.svg", status: "Production Ready", projects: ["Youtube Clone"], scarId: null },
            { name: "Magic UI", icon: "/skills/magicui.svg", status: "Production Ready", projects: ["Portfolio Motion"], scarId: null },
        ],
    },
    {
        title: "CS & Tools",
        skills: [
            { name: "C++", icon: "/skills/cpp.svg", status: "Battle-Tested", projects: ["Competitive Programming", "Algorithms"], scarId: null },
            { name: "Postman", icon: "/skills/postman.svg", status: "Production Ready", projects: ["API Lifecycle Testing"], scarId: null },
            { name: "Git", icon: "/skills/git.svg", status: "Production Ready", projects: ["Version Control"], scarId: null },
            { name: "GitHub", icon: "/skills/github.svg", status: "Production Ready", projects: ["Open Source / CI/CD"], scarId: null, themeable: true },
        ],
    },
];

const STATUS_CONFIG = {
    "Battle-Tested": {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
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

export const handleJumpToScar = (scarId: string, callback: () => void) => {
    callback();
    setTimeout(() => {
        document.getElementById("battle-scars")?.scrollIntoView({ behavior: "smooth" });
    }, MODAL_EXIT_DURATION);
};