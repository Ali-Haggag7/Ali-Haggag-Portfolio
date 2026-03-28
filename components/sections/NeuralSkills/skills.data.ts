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

export const technicalArsenal: SkillCategory[] = [
    {
        title: "Frontend",
        skills: [
            { name: "Next.js 14+", icon: "/skills/nextjs.svg", status: "Battle-Tested", projects: ["CS Arena", "My Portfolio"], scarId: "cascading-filters-race", themeable: true },
            { name: "React", icon: "/skills/react.svg", status: "Production Ready", projects: ["CS Arena", "Flurry v2.0", "Blog Pro"], scarId: null },
            { name: "TypeScript", icon: "/skills/typescript.svg", status: "Battle-Tested", projects: ["Cybership API", "CS Arena", "My Portfolio"], scarId: "ddd-boundaries" },
            { name: "JavaScript", icon: "/skills/javascript.svg", status: "Production Ready", projects: ["Multiple Projects"], scarId: null },
            { name: "Redux", icon: "/skills/redux.svg", status: "Production Ready", projects: ["Blog Pro", "Flurry v2.0"], scarId: null },
            { name: "Tailwind CSS", icon: "/skills/tailwindcss.svg", status: "Production Ready", projects: ["Multiple Projects"], scarId: null },
            { name: "Bootstrap", icon: "/skills/bootstrap.svg", status: "Production Ready", projects: ["Multiple Projects"], scarId: null },
        ],
    },
    {
        title: "Backend",
        skills: [
            { name: "Node.js", icon: "/skills/nodejs.svg", status: "Production Ready", projects: ["Cybership API", "Admin Dashboard", "Blog Pro"], scarId: null },
            { name: "NestJS", icon: "/skills/nestjs.svg", status: "Production Ready", projects: ["Cybership API"], scarId: null },
            { name: "MongoDB", icon: "/skills/mongodb.svg", status: "Production Ready", projects: ["Admin Dashboard", "Blog Pro", "Flurry v2.0"], scarId: null },
            { name: "Firebase", icon: "/skills/firebase.svg", status: "Production Ready", projects: ["Realtime Chat Engine", "Flurry v2.0"], scarId: null },
            { name: "Supabase", icon: "/skills/supabase.svg", status: "R&D / Exploring", projects: [], scarId: null },
            { name: "PostgreSQL", icon: "/skills/postgresql.svg", status: "R&D / Exploring", projects: [], scarId: null },
        ],
    },
    {
        title: "ORM & API Layer",
        skills: [
            { name: "Prisma", icon: "/skills/prisma.svg", status: "Production Ready", projects: ["Real Time Chat Engine"], scarId: null },
            { name: "GraphQL", icon: "/skills/graphql.svg", status: "R&D / Exploring", projects: [], scarId: null },
            { name: "Redis", icon: "/skills/redis.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "enterprise-security" },
            { name: "Zod", icon: "/skills/zod.svg", status: "Battle-Tested", projects: ["Cybership API", "CS Arena"], scarId: "ddd-boundaries" },
        ],
    },
    {
        title: "Real-time & AI",
        skills: [
            { name: "Socket.io", icon: "/skills/socketio.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "webrtc-latency", themeable: true },
            { name: "WebRTC", icon: "/skills/webrtc.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "webrtc-latency", themeable: true },
            { name: "Google Gemini", icon: "/skills/google.svg", status: "Battle-Tested", projects: ["Gemini Clone", "Flurry v2.0", "My Portfolio"], scarId: "gemini-clone" },
            { name: "PWA", icon: "/skills/pwa.svg", status: "Battle-Tested", projects: ["Flurry v2.0", "My Portfolio"], scarId: "offline-sync" },
        ],
    },
    {
        title: "Auth & Security",
        skills: [
            { name: "JWT", icon: "/skills/jwt.svg", status: "Battle-Tested", projects: ["Blog Pro", "Admin Dashboard"], scarId: "enterprise-security" },
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
            { name: "React Query", icon: "/skills/reactquery.svg", status: "Production Ready", projects: ["Flurry v2.0"], scarId: null },
            { name: "I18next", icon: "/skills/i18next.svg", status: "Production Ready", projects: ["Flurry v2.0", "CS Arena"], scarId: null },
        ],
    },
    {
        title: "Deploy & DevOps",
        skills: [
            { name: "Vercel", icon: "/skills/vercel.svg", status: "Production Ready", projects: ["Multiple Projects"], scarId: null, themeable: true },
            { name: "Sevalla", icon: "/skills/sevalla.jpeg", status: "Production Ready", projects: ["Blog Pro", "Flurry v2.0"], scarId: null },
            { name: "DigitalOcean", icon: "/skills/digitalocean.svg", status: "R&D / Exploring", projects: [], scarId: null },
        ],
    },
    {
        title: "Media & Storage",
        skills: [
            { name: "Cloudinary", icon: "/skills/cloudinary.svg", status: "Production Ready", projects: ["Blog Pro", "Admin Dashboard", "Real Time Chat Engine"], scarId: null },
            { name: "ImageKit", icon: "/skills/imagekit.jpg", status: "Production Ready", projects: ["Flurry v2.0"], scarId: null },
        ],
    },
    {
        title: "Monitoring",
        skills: [
            { name: "Sentry", icon: "/skills/sentry.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null },
        ],
    },
    {
        title: "Email Services",
        skills: [
            { name: "Resend", icon: "/skills/resend.svg", status: "Production Ready", projects: ["CS Arena"], scarId: null, themeable: true },
            { name: "Nodemailer", icon: "/skills/nodemailer.png", status: "Production Ready", projects: ["Blog Pro", "Flurry v2.0"], scarId: null },
            { name: "Mailtrap", icon: "/skills/mailtrap.svg", status: "Production Ready", projects: ["Flurry v2.0"], scarId: null },
        ],
    },
    {
        title: "Design & UI Libs",
        skills: [
            { name: "Figma", icon: "/skills/figma.svg", status: "Production Ready", projects: ["Multiple Projects"], scarId: null },
            { name: "Shadcn/UI", icon: "/skills/shadcn.svg", status: "Production Ready", projects: ["Multiple Projects"], scarId: null, themeable: true },
            { name: "Material UI", icon: "/skills/mui.svg", status: "Production Ready", projects: ["Youtube Clone"], scarId: null },
            { name: "Magic UI", icon: "/skills/magicui.svg", status: "Production Ready", projects: ["Portfolio"], scarId: null },
        ],
    },
    {
        title: "CS & Tools",
        skills: [
            { name: "C++", icon: "/skills/cpp.svg", status: "Battle-Tested", projects: ["Algorithms & Data Structures"], scarId: null },
            { name: "Git", icon: "/skills/git.svg", status: "Production Ready", projects: ["All Projects"], scarId: null },
            { name: "GitHub", icon: "/skills/github.svg", status: "Production Ready", projects: ["All Projects"], scarId: null, themeable: true },
            { name: "VS Code", icon: "/skills/vscode.svg", status: "Production Ready", projects: ["All Projects"], scarId: null },
            { name: "Postman", icon: "/skills/postman.svg", status: "Production Ready", projects: ["Multiple Projects"], scarId: null },
        ],
    },
];

// Precomputed map — O(1) lookup vs a switch statement called on every render.
const STATUS_CONFIG = {
    "Battle-Tested": { color: "text-red-600 dark:text-red-500", bg: "bg-red-500/10", icon: Activity },
    "Production Ready": { color: "text-emerald-600 dark:text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
    "R&D / Exploring": { color: "text-purple-600 dark:text-purple-500", bg: "bg-purple-500/10", icon: FlaskConical },
} as const;

export const getStatusConfig = (status: Skill["status"]) => STATUS_CONFIG[status];

export const handleJumpToScar = (scarId: string, callback: () => void) => {
    callback();
    // Delay lets the modal exit animation finish before scrolling.
    setTimeout(() => {
        document.getElementById("battle-scars")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
};