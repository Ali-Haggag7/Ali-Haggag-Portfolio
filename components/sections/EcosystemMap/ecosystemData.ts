export interface EcosystemNode {
    id: string;
    label: string;
    type: "project" | "tech";
    category?: string;
    description?: string;
    x: number; // 0..100 percentage
    y: number; // 0..100
    color: string;
    iconUrl?: string;
    themeable?: boolean;
}

export interface EcosystemEdge {
    source: string; // project or tech id
    target: string;
}

export const ECOSYSTEM_NODES: readonly EcosystemNode[] = Object.freeze([
    // Project Star Nodes
    { id: "logic-arena", label: "Logic Arena", type: "project", description: "Flagship robot-programming arena with custom AliScript DSL & 20 TPS physics", x: 25, y: 30, color: "#10b981", iconUrl: "/logic-arena-icon.png" },
    { id: "scout", label: "Scout AI", type: "project", description: "Autonomous AI job-application agent with isolated worker_threads brain loop", x: 75, y: 30, color: "#a855f7" },
    { id: "flurry", label: "Flurry", type: "project", description: "Real-time social super-app with WebRTC P2P calls & offline-first PWA sync", x: 15, y: 70, color: "#3b82f6", iconUrl: "/flurry-icon.ico" },
    { id: "cs-arena", label: "CS Arena", type: "project", description: "Developer project ecosystem with 3-level cascading URL state classification", x: 85, y: 70, color: "#06b6d4" },
    { id: "cybership", label: "Cybership API", type: "project", description: "Domain-Driven carrier API with Zod Anti-Corruption Layer", x: 50, y: 15, color: "#f97316" },
    { id: "blog-pro", label: "Blog Pro", type: "project", description: "MERN CMS with 5-layer security pipeline and RBAC", x: 50, y: 85, color: "#eab308" },

    // Tech Cluster Constellation Hubs
    { id: "tech-nestjs", label: "NestJS 11", type: "tech", x: 50, y: 32, color: "#e11d48", iconUrl: "/skills/nestjs.svg" },
    { id: "tech-socketio", label: "Socket.io", type: "tech", x: 35, y: 50, color: "#000000", iconUrl: "/skills/socketio.svg", themeable: true },
    { id: "tech-redis", label: "Redis", type: "tech", x: 65, y: 50, color: "#dc2626", iconUrl: "/skills/redis.svg" },
    { id: "tech-webrtc", label: "WebRTC", type: "tech", x: 20, y: 50, color: "#2563eb", iconUrl: "/skills/webrtc.svg", themeable: true },
    { id: "tech-nextjs", label: "Next.js 16", type: "tech", x: 50, y: 55, color: "#000000", iconUrl: "/skills/nextjs.svg", themeable: true },
    { id: "tech-zod", label: "Zod", type: "tech", x: 65, y: 70, color: "#3b82f6", iconUrl: "/skills/zod.svg" },
    { id: "tech-pwa", label: "PWA & SW", type: "tech", x: 35, y: 70, color: "#5b21b6", iconUrl: "/skills/pwa.svg" },
]);

export const ECOSYSTEM_EDGES: readonly EcosystemEdge[] = Object.freeze([
    // Logic Arena Tech Stack
    { source: "logic-arena", target: "tech-nestjs" },
    { source: "logic-arena", target: "tech-socketio" },
    { source: "logic-arena", target: "tech-redis" },
    { source: "logic-arena", target: "tech-nextjs" },
    { source: "logic-arena", target: "tech-pwa" },

    // Scout AI Tech Stack
    { source: "scout", target: "tech-nestjs" },
    { source: "scout", target: "tech-socketio" },
    { source: "scout", target: "tech-redis" },
    { source: "scout", target: "tech-nextjs" },
    { source: "scout", target: "tech-zod" },

    // Flurry Tech Stack
    { source: "flurry", target: "tech-socketio" },
    { source: "flurry", target: "tech-webrtc" },
    { source: "flurry", target: "tech-pwa" },

    // CS Arena Tech Stack
    { source: "cs-arena", target: "tech-nextjs" },
    { source: "cs-arena", target: "tech-zod" },
    { source: "cs-arena", target: "tech-pwa" },

    // Cybership Tech Stack
    { source: "cybership", target: "tech-zod" },

    // Blog Pro Tech Stack
    { source: "blog-pro", target: "tech-redis" },
]);
