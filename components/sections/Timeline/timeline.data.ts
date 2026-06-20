import { GraduationCap, Layout, Database, Rocket, type LucideIcon } from "lucide-react";

export type TimelineProject = {
    name: string;
    url: string;
};

export type TimelineItem = {
    year: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    glowBg: string;
    hoverBorder: string;
    isActive: boolean;
    // Accent CSS variable used for the active left-border highlight + expand details.
    accentVar: string;
    // 3–5 key achievements for the period (sourced from docs/).
    milestones: string[];
    // Projects worked on during the period.
    projects: TimelineProject[];
    // Main technologies used that period.
    tech: string[];
};

// Frozen at module level — never re-created on renders.
// Every milestone, project, and tech entry is sourced directly from docs/.
export const timelineData: readonly TimelineItem[] = Object.freeze([
    {
        year: "2023",
        title: "The Beginning",
        description:
            "Started my B.Sc. in Computer Science & Artificial Intelligence at South Valley National University. Laid strong foundations in Data Structures, OOP, and Database Systems.",
        icon: GraduationCap,
        color: "text-purple-500",
        glowBg: "bg-purple-500/10",
        hoverBorder: "group-hover:border-purple-500/50 group-focus:border-purple-500/50",
        isActive: false,
        accentVar: "var(--tl-accent-purple)",
        milestones: [
            "Enrolled in the B.Sc. Computer Science & Artificial Intelligence program at South Valley National University.",
            "Built strong foundations in Data Structures and Object-Oriented Programming.",
            "Studied Database Systems as part of the core curriculum.",
        ],
        projects: [],
        tech: ["Data Structures", "OOP", "Database Systems"],
    },
    {
        year: "2024",
        title: "Frontend Engineering",
        description:
            "Mastered the UI/UX world. Earned my Front-End Development Diploma (React.js) and built responsive, interactive interfaces using Tailwind CSS and Framer Motion.",
        icon: Layout,
        color: "text-blue-500",
        glowBg: "bg-blue-500/10",
        hoverBorder: "group-hover:border-blue-500/50 group-focus:border-blue-500/50",
        isActive: false,
        accentVar: "var(--tl-accent-blue)",
        milestones: [
            "Earned a Front-End Development Diploma focused on React.js.",
            "Built responsive, interactive interfaces with Tailwind CSS and Framer Motion.",
            "Adopted bilingual (RTL/LTR) UI patterns for English and Arabic.",
        ],
        projects: [],
        tech: ["React.js", "Tailwind CSS", "Framer Motion"],
    },
    {
        year: "2025",
        title: "Backend & Full-Stack Shift",
        description:
            "Completed a Backend Internship at Web Masters. Engineered RESTful APIs, optimized MongoDB schemas, and mastered the MERN stack with strict JWT authentication.",
        icon: Database,
        color: "text-yellow-500",
        glowBg: "bg-yellow-500/10",
        hoverBorder: "group-hover:border-yellow-500/50 group-focus:border-yellow-500/50",
        isActive: false,
        accentVar: "var(--tl-accent-yellow)",
        milestones: [
            "Completed a Backend Internship at Web Masters engineering RESTful APIs and optimizing MongoDB schemas.",
            "Built Blog Pro, a MERN CMS with JWT HttpOnly cookies, RBAC, and Helmet/XSS-Clean/HPP protection layers.",
            "Served as frontend lead on Student Hub, a university team project (Field Training course), owning the React/Vite UI, i18n, RTL/LTR, and component architecture with limited .NET backend contribution.",
        ],
        projects: [
            { name: "Blog Pro", url: "https://Blog-Pro-Platform.vercel.app/" },
        ],
        tech: ["Node.js", "Express.js", "MongoDB", "JWT", "React", "Vite"],
    },
    {
        year: "2026 — Present",
        title: "Elite Software Engineer",
        description:
            "Architecting complex, offline-first systems like the 'Flurry' Super App and the 'CS Arena' developer ecosystem. Specializing in WebRTC, Socket.io, Next.js architecture, and Gemini AI integrations.",
        icon: Rocket,
        color: "text-emerald-500",
        glowBg: "bg-emerald-500/10",
        hoverBorder: "group-hover:border-emerald-500/50 group-focus:border-emerald-500/50",
        isActive: true,
        accentVar: "var(--tl-accent-emerald)",
        milestones: [
            "Shipped Logic Arena v2.0.0 to production at logicarena.dev — a containerized pnpm monorepo deployed on a DigitalOcean Droplet behind Nginx with Let's Encrypt TLS.",
            "Built the real-time match pipeline running 50ms server physics (20 TPS) interpolated to 60 FPS, with delta diffing cutting WebSocket payloads ~80%.",
            "Designed AliScript, a custom sandboxed DSL with a deterministic 2,000-op TLE quota, plus a 60-level campaign and a Swarm Intelligence BROADCAST/RECEIVE API.",
            "Launched Flurry's WebRTC P2P calling and Google Gemini group-chat summaries, and the CS Arena developer ecosystem on Next.js 16 with Sanity CMS.",
            "Built the Cybership carrier integration service in TypeScript with an OAuth 2.0 token cache and Zod-validated domain boundary.",
        ],
        projects: [
            { name: "Logic Arena", url: "https://logicarena.dev" },
            { name: "Flurry", url: "https://flurry-app.vercel.app/" },
            { name: "CS Arena", url: "https://csarena.tech" },
        ],
        tech: ["Next.js 16", "NestJS 11", "Socket.io", "WebRTC", "Prisma", "Redis", "Google Gemini"],
    },
]);
