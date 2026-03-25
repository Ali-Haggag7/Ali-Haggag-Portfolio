import { Activity, CheckCircle2, FlaskConical } from "lucide-react";

export type Skill = {
    name: string;
    icon: string;
    status: "Battle-Tested" | "Production Ready" | "R&D / Exploring";
    projects: string[];
    scarId: string | null;
};

export const skillsData: Skill[] = [
    { name: "Next.js 14+", icon: "/skills/nextjs.svg", status: "Battle-Tested", projects: ["CS Arena", "Blog Pro"], scarId: "cascading-filters-race" },
    { name: "TypeScript", icon: "/skills/typescript.svg", status: "Battle-Tested", projects: ["Cybership API", "CS Arena", "Flurry v2.0"], scarId: "ddd-boundaries" },
    { name: "WebRTC", icon: "/skills/webrtc.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "webrtc-latency" },
    { name: "Socket.io", icon: "/skills/socketio.svg", status: "Battle-Tested", projects: ["Flurry v2.0"], scarId: "webrtc-latency" },
    { name: "MongoDB", icon: "/skills/mongodb.svg", status: "Production Ready", projects: ["Admin Dashboard", "Blog Pro", "Flurry v2.0"], scarId: null },
    { name: "Node.js", icon: "/skills/nodejs.svg", status: "Production Ready", projects: ["Cybership API", "Admin Dashboard", "Blog Pro"], scarId: null },
    { name: "NestJS", icon: "/skills/nestjs.svg", status: "Production Ready", projects: ["Cybership API"], scarId: null },
    { name: "GraphQL", icon: "/skills/graphql.svg", status: "R&D / Exploring", projects: [], scarId: null },
    { name: "Zod", icon: "/skills/zod.svg", status: "Battle-Tested", projects: ["Cybership API", "CS Arena"], scarId: "ddd-boundaries" },
    { name: "React", icon: "/skills/react.svg", status: "Production Ready", projects: ["CS Arena", "Flurry v2.0", "Blog Pro"], scarId: null },
    { name: "Tailwind CSS", icon: "/skills/tailwindcss.svg", status: "Production Ready", projects: ["CS Arena", "Flurry v2.0", "Gemini Clone"], scarId: null },
    { name: "Firebase", icon: "/skills/firebase.svg", status: "Production Ready", projects: ["Realtime Chat Engine"], scarId: null },
    { name: "Gemini AI", icon: "/skills/google.svg", status: "Battle-Tested", projects: ["Gemini Clone", "Flurry v2.0"], scarId: "gemini-clone" }
];

export const getStatusConfig = (status: Skill["status"]) => {
    switch (status) {
        case "Battle-Tested": return { color: "text-red-600 dark:text-red-500", bg: "bg-red-500/10", icon: Activity };
        case "Production Ready": return { color: "text-emerald-600 dark:text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 };
        case "R&D / Exploring": return { color: "text-purple-600 dark:text-purple-500", bg: "bg-purple-500/10", icon: FlaskConical };
    }
};

export const handleJumpToScar = (scarId: string, callback: () => void) => {
    callback();
    setTimeout(() => {
        const container = document.getElementById('battle-scars');
        if (container) container.scrollIntoView({ behavior: 'smooth' });
    }, 300);
};