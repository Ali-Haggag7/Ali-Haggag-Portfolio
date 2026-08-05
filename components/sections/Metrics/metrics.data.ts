import {
    GitCommitHorizontal, TestTube, Server, Gamepad2,
    Gauge, Zap, MonitorSmartphone, Route, Bug, type LucideIcon
} from "lucide-react";

export type MetricCategory = "code" | "systems" | "performance" | "scale";

export type MetricItem = {
    id: string;
    value: number;
    /** Prefix like "<" or "~" rendered before the number */
    prefix?: string;
    /** Suffix like "+", "%", "ms", "TPS" rendered after the number */
    suffix?: string;
    label: string;
    icon: LucideIcon;
    category: MetricCategory;
    /** CSS variable for the accent glow */
    accentVar: string;
};

export const CATEGORY_LABELS: Record<MetricCategory, string> = {
    code: "Code",
    systems: "Systems",
    performance: "Performance",
    scale: "Scale",
};

// All metrics sourced directly from the live CV (August 2026).
export const metricsData: readonly MetricItem[] = Object.freeze([
    // ── Code ──
    {
        id: "commits",
        value: 500,
        suffix: "+",
        label: "Commits on StudentHub alone",
        icon: GitCommitHorizontal,
        category: "code",
        accentVar: "var(--tl-accent-blue)",
    },
    {
        id: "prs",
        value: 135,
        suffix: "+",
        label: "Pull Requests reviewed & merged",
        icon: GitCommitHorizontal,
        category: "code",
        accentVar: "var(--tl-accent-blue)",
    },
    {
        id: "tests",
        value: 156,
        suffix: "+",
        label: "Automated tests (Scout pipeline)",
        icon: TestTube,
        category: "code",
        accentVar: "var(--tl-accent-blue)",
    },
    // ── Systems ──
    {
        id: "production-systems",
        value: 6,
        suffix: "",
        label: "Production systems deployed",
        icon: Server,
        category: "systems",
        accentVar: "var(--tl-accent-emerald)",
    },
    {
        id: "game-modes",
        value: 8,
        suffix: "",
        label: "Game modes in Logic Arena",
        icon: Gamepad2,
        category: "systems",
        accentVar: "var(--tl-accent-emerald)",
    },
    {
        id: "campaign-levels",
        value: 60,
        suffix: "+",
        label: "Campaign levels designed",
        icon: Route,
        category: "systems",
        accentVar: "var(--tl-accent-emerald)",
    },
    // ── Performance ──
    {
        id: "webrtc-latency",
        value: 50,
        prefix: "<",
        suffix: "ms",
        label: "WebRTC P2P call latency",
        icon: Zap,
        category: "performance",
        accentVar: "var(--tl-accent-purple)",
    },
    {
        id: "physics-tps",
        value: 20,
        suffix: " TPS",
        label: "Server physics tick rate",
        icon: Gauge,
        category: "performance",
        accentVar: "var(--tl-accent-purple)",
    },
    {
        id: "payload-reduction",
        value: 80,
        suffix: "%",
        label: "WebSocket payload reduction",
        icon: Zap,
        category: "performance",
        accentVar: "var(--tl-accent-purple)",
    },
    // ── Scale ──
    {
        id: "web-screens",
        value: 47,
        suffix: "",
        label: "Web screens built (StudentHub)",
        icon: MonitorSmartphone,
        category: "scale",
        accentVar: "var(--tl-accent-yellow)",
    },
    {
        id: "rest-endpoints",
        value: 110,
        suffix: "+",
        label: "REST endpoints integrated",
        icon: Route,
        category: "scale",
        accentVar: "var(--tl-accent-yellow)",
    },
    {
        id: "battle-scars",
        value: 30,
        suffix: "+",
        label: "Production incidents resolved",
        icon: Bug,
        category: "scale",
        accentVar: "var(--tl-accent-yellow)",
    },
]);
