import { GraduationCap, Layout, Database, Rocket } from "lucide-react";

export type TimelineItem = {
    year: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    glowBg: string;
    hoverBorder: string;
    isActive: boolean;
};

export const timelineData: TimelineItem[] = [
    {
        year: "2023",
        title: "The Beginning",
        description: "Started my B.Sc. in Computer Science & Artificial Intelligence at South Valley National University. Laid strong foundations in Data Structures, OOP, and Database Systems.",
        icon: GraduationCap,
        color: "text-purple-500",
        glowBg: "bg-purple-500/10",
        hoverBorder: "group-hover:border-purple-500/50 group-focus:border-purple-500/50",
        isActive: false,
    },
    {
        year: "2024",
        title: "Frontend Engineering",
        description: "Mastered the UI/UX world. Earned my Front-End Development Diploma (React.js) and built responsive, interactive interfaces using Tailwind CSS and Framer Motion.",
        icon: Layout,
        color: "text-blue-500",
        glowBg: "bg-blue-500/10",
        hoverBorder: "group-hover:border-blue-500/50 group-focus:border-blue-500/50",
        isActive: false,
    },
    {
        year: "2025",
        title: "Backend & Full-Stack Shift",
        description: "Completed a Backend Internship at Web Masters. Engineered RESTful APIs, optimized MongoDB schemas, and mastered the MERN stack with strict JWT authentication.",
        icon: Database,
        color: "text-yellow-500",
        glowBg: "bg-yellow-500/10",
        hoverBorder: "group-hover:border-yellow-500/50 group-focus:border-yellow-500/50",
        isActive: false,
    },
    {
        year: "2026 — Present",
        title: "Elite Software Engineer",
        description: "Architecting complex, offline-first systems like the 'Flurry' Super App and the 'CS Arena' developer ecosystem. Specializing in WebRTC, Socket.io, Next.js architecture, and Gemini AI integrations.",
        icon: Rocket,
        color: "text-emerald-500",
        glowBg: "bg-emerald-500/10",
        hoverBorder: "group-hover:border-emerald-500/50 group-focus:border-emerald-500/50",
        isActive: true,
    },
];