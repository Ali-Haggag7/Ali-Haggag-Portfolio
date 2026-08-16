export interface TourStep {
    id: string;
    /** Must match a real DOM element id (document.getElementById) */
    targetId: string;
    title: string;
    subtitle: string;
    commentary: string;
    actionHint?: string;
    placement?: "top" | "bottom" | "left" | "right" | "center";
}

export interface TourPersona {
    id: "recruiter" | "engineer" | "quick";
    title: string;
    description: string;
    badge: string;
    steps: TourStep[];
}

export const TOUR_PERSONAS: readonly TourPersona[] = Object.freeze([
    {
        id: "recruiter",
        title: "Recruiter & Hiring Manager",
        description: "Guided deep-dive into Ali's growth story, engineering scale, and live CV proof.",
        badge: "HIRING SIGNAL",
        steps: [
            {
                id: "step-recruiter-1",
                targetId: "hero-terminal",
                title: "AliOS Terminal & Interactive CLI",
                subtitle: "First Impression & Identity",
                commentary:
                    "Welcome! This CLI is not a mock — it's a live command engine with 15+ custom commands. Try typing 'experience' or 'stats' to pull real CV data updated for August 2026.",
                actionHint: "Try typing 'experience' or 'stats' in the terminal!",
                placement: "bottom",
            },
            {
                id: "step-recruiter-2",
                targetId: "evolution",
                title: "The Evolution Arc (2023–2026)",
                subtitle: "Engineering Growth Story",
                commentary:
                    "This narrative arc replaces traditional timelines. It traces how Ali evolved from foundational CS to leading 8-person teams, building custom compilers, and shipping 6 production systems.",
                placement: "top",
            },
            {
                id: "step-recruiter-3",
                targetId: "metrics",
                title: "Engineering Metrics Dashboard",
                subtitle: "Scale Proven by Numbers",
                commentary:
                    "Numbers don't lie. 500+ commits on StudentHub alone, 156+ automated tests on Scout, 20 TPS physics engine, and sub-50ms response times across 6 production systems.",
                placement: "bottom",
            },
            {
                id: "step-recruiter-4",
                targetId: "projects",
                title: "Production Projects Bento",
                subtitle: "Flagship Systems & Autopsies",
                commentary:
                    "Each project card opens a full technical autopsy — specs, metrics, live URLs, and linked production incidents. Click any card to explore.",
                actionHint: "Click a project card to open its full technical autopsy!",
                placement: "center",
            },
            {
                id: "step-recruiter-5",
                targetId: "contact",
                title: "Contact & Living CV Sync",
                subtitle: "Direct Outreach & Downloads",
                commentary:
                    "Download the full 9-page technical profile PDF or reach out directly for full-time engineering roles and consulting opportunities.",
                placement: "top",
            },
        ],
    },
    {
        id: "engineer",
        title: "Senior Engineer & Architect",
        description: "Deep technical walkthrough of compiler design, AI brain loop, & system post-mortems.",
        badge: "DEEP TECH",
        steps: [
            {
                id: "step-eng-1",
                targetId: "aliscript-playground",
                title: "AliScript v2.4 DSL Engine",
                subtitle: "Custom Compiler & 2D Canvas",
                commentary:
                    "AliScript is a custom programming language built from scratch — Lexer, AST Parser, 2,000 Ops TLE quota, and an HTML5 2D canvas robot renderer running entirely in the browser.",
                actionHint: "Click 'Run Script' or choose a preset like 'Circle Patrol'!",
                placement: "top",
            },
            {
                id: "step-eng-2",
                targetId: "scout-brain",
                title: "Scout Cognitive Pipeline",
                subtitle: "Observe → Reason → Plan → Act → Verify",
                commentary:
                    "Scout's 5-stage cognitive brain loop powered by Groq Llama 3.3 and Playwright worker_threads — with 4 active ethical guardrails preventing runaway autonomous actions.",
                placement: "bottom",
            },
            {
                id: "step-eng-3",
                targetId: "architecture",
                title: "Interactive System Architecture",
                subtitle: "12-Node Distributed Monorepo Maps",
                commentary:
                    "Interactive SVG node graphs illustrating real data flow between Next.js, NestJS, Redis, Socket.io, and PostgreSQL across Logic Arena and Scout production systems.",
                placement: "top",
            },
            {
                id: "step-eng-4",
                targetId: "battle-scars",
                title: "Battle Scars — Incident Autopsies",
                subtitle: "SYMPTOM → CAUSE → FIX",
                commentary:
                    "30+ real production incident post-mortems documented with full diagnosis. Toggle 'Timeline View' to trace how bugs evolved across releases and were permanently resolved.",
                actionHint: "Try switching to 'Timeline View' to trace bug evolution!",
                placement: "bottom",
            },
            {
                id: "step-eng-5",
                targetId: "ecosystem",
                title: "Project Ecosystem Constellation",
                subtitle: "Shared Technology Hubs",
                commentary:
                    "Constellation map highlighting how shared technologies — WebRTC, PWA, Socket.io, Redis — form the backbone connecting all 6 production systems together.",
                placement: "top",
            },
        ],
    },
]);
