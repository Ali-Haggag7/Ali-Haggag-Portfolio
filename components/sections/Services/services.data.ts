import { Globe, Terminal, Database, Layout, Smartphone, Sparkles } from "lucide-react";

export const servicesData = [
    {
        title: "Full-Stack Web Dev",
        description: "Building scalable, high-performance web applications from scratch using the MERN Stack and Next.js.",
        icon: Globe,
    },
    {
        title: "Real-Time & Streaming",
        description: "Developing zero-latency live chats and P2P video calling systems using Socket.io and WebRTC.",
        icon: Terminal,
    },
    {
        title: "AI Integration",
        description: "Integrating Generative AI models (like Google Gemini) to build smart features, summaries, and chatbots.",
        icon: Sparkles,
    },
    {
        title: "Robust API Architecture",
        description: "Designing secure RESTful APIs with MVC architecture, JWT authentication, and optimized MongoDB aggregations.",
        icon: Database,
    },
    {
        title: "PWA & Offline-First",
        description: "Architecting Progressive Web Apps with Service Workers for seamless offline functionality and background syncing.",
        icon: Smartphone,
    },
    {
        title: "Modern UI/UX & Motion",
        description: "Crafting pixel-perfect, bilingual (RTL/LTR), and highly animated interfaces with Tailwind CSS and Framer Motion.",
        icon: Layout,
    },
];