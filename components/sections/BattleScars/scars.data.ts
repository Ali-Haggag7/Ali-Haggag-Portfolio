import {
    Swords,
    WifiOff,
    Network,
    Filter,
    ShieldAlert,
    Cpu,
    Gauge,
    Database,
    Mail,
    Box,
    Crosshair,
    Bug,
    Skull,
    Activity,
    type LucideIcon,
} from "lucide-react";

export type Severity = "critical" | "high" | "medium";

export type Scar = {
    id: string;
    category: string;
    icon: LucideIcon;
    title: string;
    project: string;
    severity: Severity;
    timeToSolve: string;
    badges: string[];
    // Three-line incident summary (visible without expanding)
    symptom: string;
    rootCause: string;
    solution: string;
    // Full technical detail (revealed on expand)
    problem: string;
    impact: string;
    // Optional short before/after or key fix snippet (2-6 lines)
    codeSnippet?: string;
};

export const scarsData: Scar[] = [
    // ─────────────────────────────────────────────────────────────────────
    // Logic Arena — Production / Infra
    // ─────────────────────────────────────────────────────────────────────
    {
        id: "ghost-match-massacre",
        category: "Performance",
        icon: Skull,
        title: "The Ghost Match Massacre",
        project: "Logic Arena v2.5.0",
        severity: "critical",
        timeToSolve: "3 days",
        badges: ["WebSocket", "NestJS", "Memory Leak"],
        symptom:
            "The server terminal kept printing MOVE_FAST commands for players who had closed their tab minutes ago, pinning CPU at 100%.",
        rootCause:
            "On disconnect the WebSocket dropped but the MatchEngine physics loop kept running at full speed, accumulating hundreds of dead matches in memory.",
        solution:
            "Tied match lifecycle to connected client count — the moment numClients hits 0 the engine calls match.stop() and is destroyed from RAM.",
        problem:
            "When a player pressed Back or closed the browser tab, their WebSocket disconnected but the MatchEngine kept the game loop, AliScript evaluator, and A* pathfinder running indefinitely, broadcasting state to a room with zero connected clients. In a busy hour, hundreds of ghost matches accumulated, consuming 100% CPU and eventually crashing the entire backend.",
        impact:
            "Zero ghost matches. Backend CPU returned to baseline and the server stopped crashing under sustained play.",
        codeSnippet: `// handleDisconnect in MatchGateway
if (numClients === 0) {
  match.stop();          // halt the physics loop
  this.destroyEngine(matchId); // free it from RAM
}`,
    },
    {
        id: "sentry-dev-freeze",
        category: "Performance",
        icon: Gauge,
        title: "The Sentry Development Freeze",
        project: "Logic Arena v3.4.0",
        severity: "high",
        timeToSolve: "1 day",
        badges: ["Sentry", "Webpack", "Next.js"],
        symptom:
            "Running the Next.js dev server froze the entire machine within seconds — mouse unresponsive, requiring a hard restart.",
        rootCause:
            "widenClientFileUpload: true told webpack to scan the whole project to build a source-map manifest, and combined with the Session Replay SDK it spawned CPU-saturating worker threads.",
        solution:
            "Removed Sentry entirely — uninstalled @sentry/nextjs, deleted all three config files, and restored next.config.ts to export nextConfig directly.",
        problem:
            "After integrating Sentry for client-side error tracking, local development became unusable. The withSentryConfig wrapper instructed webpack to scan the entire project directory for a source-map file manifest. Combined with Sentry.replayIntegration(), the webpack compilation spawned multiple CPU-saturating worker threads that overwhelmed the development machine entirely.",
        impact:
            "Development performance was instantly restored. Error monitoring deferred to a lighter-weight solution that does not hook into the webpack pipeline.",
        codeSnippet: `// next.config.ts — before
export default withSentryConfig(nextConfig, {
  widenClientFileUpload: true, // scanned the whole project
});
// after
export default nextConfig;`,
    },
    {
        id: "redis-isready-poisoning",
        category: "Performance",
        icon: Database,
        title: "The Poisoned Redis Flag",
        project: "Logic Arena v3.4.0",
        severity: "high",
        timeToSolve: "2 days",
        badges: ["Redis", "ioredis", "State Management"],
        symptom:
            "Users requesting a password reset code received no email and saw no error — the Redis write was silently dropped.",
        rootCause:
            "isReady was set to false inside the Redis error handler, which fires on transient network hiccups the client auto-recovers from, permanently marking the service as unavailable.",
        solution:
            "Removed the false assignment from the error handler so isReady only flips on the reconnecting and end events that represent genuine unavailability.",
        problem:
            "The Redis service's isReady flag was being set to false inside the error event handler. Redis fires error events for transient timeouts and brief disconnections that recover within milliseconds, so every hiccup permanently marked the service down. Password reset flows were the most visible casualty. A case-sensitivity bug in resetCodeKey also made User@Example.com and user@example.com generate different keys.",
        impact:
            "Redis state hardened against transient error poisoning. Password reset and session versioning writes stopped silently failing.",
        codeSnippet: `client.on('error', () => {
  // this.isReady = false;  // removed — error is transient
});
client.on('reconnecting', () => { this.isReady = false; });
client.on('end', () => { this.isReady = false; });`,
    },
    {
        id: "smtp-to-resend",
        category: "Architecture",
        icon: Mail,
        title: "The Blocked Mail Server",
        project: "Logic Arena v3.4.0",
        severity: "high",
        timeToSolve: "2 days",
        badges: ["SMTP", "Resend", "DigitalOcean"],
        symptom:
            "Every transactional email — password resets, verification codes, welcome messages — was silently dropped since production launch, with no error in the logs.",
        rootCause:
            "DigitalOcean blocks outbound SMTP port 465 on all Droplets as an anti-spam measure, and nodemailer's connection timeout looked like a queue delay rather than a hard block.",
        solution:
            "Replaced nodemailer with the Resend HTTP SDK so delivery bypasses the blocked SMTP port entirely, then verified SPF, DKIM, and DMARC.",
        problem:
            "All transactional email was routed through nodemailer over SMTP port 465. DigitalOcean blocks outbound 465 (and 25/587 on new Droplets) for anti-spam reasons, so every email since production launch was dropped at the network layer. There was no error surfaced because the connection timeout was interpreted as a delivery queue delay rather than a hard block.",
        impact:
            "Transactional email is live and verified through Resend with a full SPF/DKIM/DMARC authentication stack confirmed green.",
        codeSnippet: `// before: nodemailer over SMTP :465 (blocked by DO)
// after:
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({ from, to, subject, html }); // HTTP, no SMTP port`,
    },
    {
        id: "redis-ipv6-docker",
        category: "Performance",
        icon: Network,
        title: "The Redis Identity Crisis (IPv6 Resolution)",
        project: "Logic Arena v2.0.0",
        severity: "high",
        timeToSolve: "2 days",
        badges: ["Redis", "Docker", "Networking"],
        symptom:
            "The Upstash Redis connection collapsed inside Docker with getaddrinfo ENOTFOUND, masquerading as an auth failure, despite working perfectly in local dev.",
        rootCause:
            "The client silently resolved the Upstash hostname to an IPv6 address that the container's network stack could not reach.",
        solution:
            "Forced IPv4 resolution by injecting family: 4 into the ioredis config and switched to an explicit TLS handshake on port 6379.",
        problem:
            "The Upstash Redis connection worked locally but collapsed in the Docker environment. The ioredis client resolved the hostname to an unreachable IPv6 address, producing a getaddrinfo ENOTFOUND error that looked like an authentication failure. A [REDIS NETWORK/AUTH ERROR] log prefix was added to expose the real failure surface for future incidents.",
        impact:
            "Restored 100% database connectivity and stable real-time presence tracking in the production container.",
        codeSnippet: `new Redis({
  host, port: 6379,
  family: 4,   // force IPv4 — IPv6 path was unreachable
  tls: {},     // explicit TLS handshake
});`,
    },
    {
        id: "docker-context-bomb",
        category: "Architecture",
        icon: Box,
        title: "The 2.57GB Docker Context Bomb",
        project: "Logic Arena v2.0.0",
        severity: "medium",
        timeToSolve: "1 day",
        badges: ["Docker", "pnpm", "Monorepo"],
        symptom:
            "The first docker compose up --build transferred 2.57GB to the Docker daemon and hung the machine for 10 minutes before crashing.",
        rootCause:
            ".dockerignore was not excluding node_modules, so the entire workspace dependency tree was sent as build context.",
        solution:
            "Rewrote .dockerignore with **/node_modules globs and switched pnpm to --shamefully-hoist to flatten binaries like tsc into the root.",
        problem:
            "The initial Docker build sent the full monorepo node_modules tree as build context because .dockerignore did not exclude it. The build context also exposed a pnpm workspace hoisting issue causing 'Cannot find module typescript/bin/tsc' during engine builds.",
        impact:
            "Build context dropped from 2.57GB to under 15MB and the engine builds resolved tsc cleanly.",
        codeSnippet: `# .dockerignore
**/node_modules
# pnpm install
pnpm install --shamefully-hoist`,
    },
    {
        id: "prisma-ghost-engine",
        category: "Architecture",
        icon: Database,
        title: "The Prisma Ghost Engine (Alpine Binary)",
        project: "Logic Arena v2.0.0",
        severity: "high",
        timeToSolve: "1 day",
        badges: ["Prisma", "Docker", "Alpine"],
        symptom:
            "The container booted, mapped all routes, connected to Redis, then detonated with 'Unable to require libquery_engine-linux-musl.so.node'.",
        rootCause:
            "The Prisma client was generated on the Windows build machine for the wrong binary target, producing an engine Alpine Linux refused to execute.",
        solution:
            "Added linux-musl targets to schema.prisma, installed openssl via apk, and copied the generated .prisma client from the builder stage into the runner.",
        problem:
            "The NestJS container launched successfully but crashed with PrismaClientInitializationError because the Prisma query engine binary did not match the Alpine runtime. The build machine generated the engine for the wrong target, and the runner stage lacked openssl.",
        impact:
            "The production container boots cleanly with the correct musl query engine on every deploy.",
        codeSnippet: `// schema.prisma
binaryTargets = ["native", "linux-musl", "linux-musl-openssl-3.0.x"]
# Dockerfile runner stage
RUN apk add --no-cache openssl`,
    },
    // ─────────────────────────────────────────────────────────────────────
    // Logic Arena — Engine / AliScript
    // ─────────────────────────────────────────────────────────────────────
    {
        id: "operator-precedence",
        category: "Algorithms",
        icon: Cpu,
        title: "The Operator Precedence Disaster (2 + 3 * 4 = 20)",
        project: "Logic Arena v2.5.0",
        severity: "high",
        timeToSolve: "2 days",
        badges: ["Compiler", "Parser", "AST"],
        symptom:
            "Scripts using multiplication inside addition computed silently wrong values — 2 + 3 * 4 evaluated to 20 instead of 14.",
        rootCause:
            "The AliScript expression parser evaluated all binary operators left-to-right with equal precedence.",
        solution:
            "Split parseBinaryExpression into parseAddition and parseMultiply, establishing a proper precedence tower so multiply binds tighter than add.",
        problem:
            "The expression parser had no precedence tower. Every script relying on multiplication or division inside an addition/subtraction expression produced subtle, impossible-to-debug logical errors in robot behavior. The fix established the order OR → AND → comparison → addition → multiply → unary → primary.",
        impact:
            "Verified correct math: 2+3*4=14, (2+3)*4=20, 10-2*3=4, 10/2+3=8.",
        codeSnippet: `// before: one flat left-to-right pass
// after: precedence levels
parseAddition()  // handles + and -
  -> parseMultiply()  // handles *, /, % (binds tighter)`,
    },
    {
        id: "fov-fire-hack",
        category: "Algorithms",
        icon: Crosshair,
        title: "The FOV Fire Hack",
        project: "Logic Arena v2.5.0",
        severity: "high",
        timeToSolve: "1 day",
        badges: ["Game Engine", "Combat", "FOV"],
        symptom:
            "A robot with its scanner pointing East could FIRE at an enemy standing directly behind it to the West — the vision cone was purely cosmetic.",
        rootCause:
            "FIRE and BURST_FIRE selected targets by searching all living robots, completely ignoring the FOV cone, so CAN_SEE_ENEMY and FIRE used different datasets.",
        solution:
            "Changed target selection to use robot.visibleEntities.robots exclusively; if no enemy is in the cone, FIRE returns with zero energy and zero cooldown.",
        problem:
            "FIRE and BURST_FIRE operated on completely different data from CAN_SEE_ENEMY. The FOV cone had zero effect on actual targeting. Energy deduction was moved inside the combat executor so it is only charged after confirming a valid visible target.",
        impact:
            "FIRE and CAN_SEE_ENEMY now operate on the exact same FOV cone data — the vision cone is finally a real mechanic.",
        codeSnippet: `// combat-executor.ts
const target = robot.visibleEntities.robots[0];
if (!target) return; // outside cone: no energy, no cooldown`,
    },
    {
        id: "entity-interpolation-buffer",
        category: "Performance",
        icon: Activity,
        title: "The Ghost Robot Infestation (Interpolation Buffer)",
        project: "Logic Arena v3.5.0",
        severity: "critical",
        timeToSolve: "1 week",
        badges: ["R3F", "WebSocket", "State Management"],
        symptom:
            "After rapid arena switching, robots from the previous match appeared as invisible ghosts — commands executed above an empty space and on the third switch nothing worked at all.",
        rootCause:
            "The module-level InterpolationBuffer singleton was never cleared between matches and stale selectedRobotId / socketUserId refs were sent in updateLogic payloads the server silently rejected.",
        solution:
            "Added a clear() method called on arena mount and unmount, reset all tracking refs in useGameState, and replaced <Link> back buttons with router.push() that emits leaveMatch before navigation.",
        problem:
            "A multi-layered state accumulation problem spanned client and server. The singleton InterpolationBuffer retained snapshots from the previous session, so the new arena interpolated from stale positions. The guest socket ID persisted and was rejected after the socket was reassigned. handleLeaveMatch raced with handleDisconnect's cleanup timeout, and Next.js soft navigation unmounted the arena before leaveMatch fired.",
        impact:
            "Rapid arena switching is permanently clean — no ghost robots, no stale themes, no silent script failures.",
        codeSnippet: `// arena mount + unmount
InterpolationBuffer.clear();      // flush stale snapshots
// back button
socket.emit('leaveMatch', id);
router.push('/dashboard');        // emit BEFORE unmount`,
    },
    {
        id: "webgl-context-log-spam",
        category: "Performance",
        icon: Gauge,
        title: "The WebGL Context Loss (60Hz console.log)",
        project: "Logic Arena v3.5.0",
        severity: "high",
        timeToSolve: "2 days",
        badges: ["WebGL", "R3F", "GC Pressure"],
        symptom:
            "The arena tab would freeze entirely — a full browser hang requiring a tab kill — seemingly at random during matches.",
        rootCause:
            "A console.log inside the 60Hz useFrame loop serialized and heap-allocated the delta object 60 times a second, triggering GC at bad times and letting the OS reclaim the WebGL context under memory pressure.",
        solution:
            "Removed the console.log spam loop from the GameState delta processor entirely.",
        problem:
            "A single console.log call inside the GameState delta processor was executing inside the 60Hz useFrame loop. Each call serialized the delta to a string, allocated it on the heap, and flushed it to the DevTools protocol, creating sustained memory pressure that reclaimed the WebGL context on some devices.",
        impact:
            "Random tab freezes eliminated; the arena holds a stable WebGL context across long matches.",
        codeSnippet: `// inside useFrame (runs 60x/sec)
// console.log('delta', delta); // <- removed: heap + GC bomb`,
    },
    {
        id: "texture-cache-disposal",
        category: "Performance",
        icon: Bug,
        title: "The Texture Destruction Freeze",
        project: "Logic Arena v3.6.0",
        severity: "high",
        timeToSolve: "3 days",
        badges: ["Three.js", "useGLTF", "WebGL"],
        symptom:
            "Reconnecting to a match or cycling map settings crashed the WebGL canvas or rendered robot models completely invisible.",
        rootCause:
            "Unmount cleanup called .dispose() on materials and textures of shared GLB assets that useGLTF caches globally, corrupting the shared memory cache for every later instantiation.",
        solution:
            "Removed all manual material/texture dispose calls from the RobotModel unmount and delegated teardown to a React key driven by the cloned scene UUID.",
        problem:
            "The scene-graph wrapper explicitly disposed shared GLB textures on unmount. Because useGLTF caches assets globally, subsequent model instantiations fetched broken material descriptors, stalling the GLTF loader and forcing invisible renders. Defensive guards were added to traversal paths to intercept null materials.",
        impact:
            "Stable 120 FPS lifecycle across consecutive room switching with no WebGL cache destruction.",
        codeSnippet: `// before: mesh.material.dispose() on unmount (corrupts cache)
// after: let React handle teardown
<primitive key={clonedScene.uuid} object={clonedScene} />`,
    },
    {
        id: "docker-workspace-resolution",
        category: "Architecture",
        icon: Box,
        title: "The Broken Docker Container Assembly",
        project: "Logic Arena v3.6.0",
        severity: "high",
        timeToSolve: "2 days",
        badges: ["Docker", "TypeScript", "Monorepo"],
        symptom:
            "Production Docker deploys crashed with \"Cannot find module '@logic-arena/engine/constants'\" despite local builds passing flawlessly.",
        rootCause:
            "Local pnpm symlinks resolved workspace subpaths that the clean Docker layer lacked, the Dockerfile built the server before the shared packages, and it never copied the root tsconfig.json the server extended.",
        solution:
            "Built logic-parser and engine sequentially before the server stage, added wildcard tsconfig subpath aliases, and copied the root tsconfig.json into the build layer.",
        problem:
            "The monorepo relied on implicit pnpm link symlinks in local dev that the production Docker build did not have. The multi-stage Dockerfile also ordered the server build before the shared workspace compilation and omitted the root tsconfig.json that apps/server/tsconfig.json extended.",
        impact:
            "Production container compiling achieves complete parity with the local workspace layout.",
        codeSnippet: `# Dockerfile — build shared packages FIRST
RUN pnpm --filter @logic-arena/logic-parser run build
RUN pnpm --filter @logic-arena/engine run build
// tsconfig.json
"@logic-arena/engine/*": ["../../packages/engine/src/*"]`,
    },
    {
        id: "logic-arena-pathfinding",
        category: "Algorithms",
        icon: Cpu,
        title: "The Circular Jitter Navigation Loop",
        project: "Logic Arena v1.8.0",
        severity: "medium",
        timeToSolve: "3 days",
        badges: ["A* Algorithm", "Pathfinding", "Weighted Grid"],
        symptom:
            "Robots entered a spasmodic oscillation near traps, spinning in place instead of moving when recalculating paths near their own coordinates.",
        rootCause:
            "Binary pass/block A* routing combined with waypoints landing on the robot's own cell created a recursive 'pointing-at-self' feedback loop.",
        solution:
            "Overhauled the heuristic into a Weighted Cost Grid (TRAP 3.0, LAVA 5.0) and added Self-Waypoint Skip logic that consumes waypoints within a half-cell radius.",
        problem:
            "The pathfinder used binary pass/block logic and recomputed paths from the robot's current position, where the nearest cell centre was always slightly behind the robot. The first waypoint of the new path landed behind it, causing a U-turn, overshoot, recompute, and infinite back-and-forth oscillation.",
        impact:
            "Fluid hazard-avoidance navigation with 100% of trajectory jitter and navigation deadlock loops eliminated.",
        codeSnippet: `// weighted cost grid replaces binary pass/block
const COST = { OPEN: 1.0, TRAP: 3.0, LAVA: 5.0 };
// consume waypoint if within half a cell -> breaks self-loop
if (dist(robot, wp) < CELL / 2) path.shift();`,
    },
    {
        id: "logic-arena-compiler",
        category: "Security",
        icon: ShieldAlert,
        title: "The Deterministic TLE Quota System",
        project: "Logic Arena v2.7.0",
        severity: "high",
        timeToSolve: "3 days",
        badges: ["Sandboxing", "AST", "Fairness"],
        symptom:
            "The same AliScript passed on a fast gaming PC and failed on a low-end laptop — the infinite-loop limit was hardware-dependent.",
        rootCause:
            "MAX_TICK_DURATION_MS measured wall-clock milliseconds, making the execution limit non-deterministic and impossible to document.",
        solution:
            "Replaced the timestamp gate with a platform-agnostic MAX_OPERATIONS_PER_TICK quota (2,000 ops) tracked via an opsCounter passed by reference through the block executor.",
        problem:
            "User-submitted AliScript runs on the server and posed infinite-loop and CPU-exhaustion risks. The original timestamp-based TLE was fundamentally non-deterministic: 'your script might run fine' is not a spec. The counter resets each tick and hitting 2,000 ops fires a [FATAL] TLE into the player's terminal regardless of wall time.",
        impact:
            "Identical quota on every machine — from a Raspberry Pi to a threadripper — enforcing true competitive fairness.",
        codeSnippet: `const MAX_OPERATIONS_PER_TICK = 2000;
function evalNode(node, ops) {
  if (++ops.count > MAX_OPERATIONS_PER_TICK) throw new TLE();
}`,
    },
    // ─────────────────────────────────────────────────────────────────────
    // Flurry — Real-time / PWA
    // ─────────────────────────────────────────────────────────────────────
    {
        id: "webrtc-latency",
        category: "Real-Time",
        icon: Swords,
        title: "The WebRTC Signaling Dilemma",
        project: "Flurry v2.0",
        severity: "high",
        timeToSolve: "1 week",
        badges: ["Socket.io", "WebRTC", "P2P"],
        symptom:
            "P2P audio/video calls suffered unpredictable connection states and noticeable latency without leaning on heavy third-party media servers.",
        rootCause:
            "Complex WebRTC handshakes and ICE candidate exchange had no reliable orchestration layer.",
        solution:
            "Architected a hybrid signaling server on Socket.io to manage handshakes while offloading media payloads directly to WebRTC P2P channels with custom ICE handling.",
        problem:
            "Managing unpredictable connection states and achieving near-zero latency for P2P audio/video calls without heavy third-party overhead required custom signaling and ICE candidate negotiation.",
        impact:
            "Achieved <50ms latency for seamless voice/video calls and instant status sync across varying network conditions.",
    },
    {
        id: "offline-sync",
        category: "Performance",
        icon: WifiOff,
        title: "The Offline-First Illusion",
        project: "Flurry v2.0",
        severity: "medium",
        timeToSolve: "4 days",
        badges: ["PWA", "Inngest", "Service Workers"],
        symptom:
            "The app appeared to 'freeze' or lose data during intermittent connectivity, especially mid multi-step message processing.",
        rootCause:
            "User actions had no durable queue, so anything in flight when the connection dropped was lost.",
        solution:
            "Engineered a sync layer with Inngest durable background functions, queuing actions in IndexedDB and re-hydrating them via Workbox once back online.",
        problem:
            "Users experienced freezes and data loss during intermittent connectivity. The fix queues user actions in IndexedDB and replays them through durable background functions when the network returns, surfacing them instantly in an Optimistic UI.",
        impact:
            "100% message delivery guarantee. Offline actions reflect instantly and sync seamlessly with no manual retries.",
    },
    // ─────────────────────────────────────────────────────────────────────
    // Cybership / Blog Pro / CS Arena
    // ─────────────────────────────────────────────────────────────────────
    {
        id: "ddd-boundaries",
        category: "Architecture",
        icon: Network,
        title: "The Anti-Corruption Layer",
        project: "Cybership API",
        severity: "high",
        timeToSolve: "4 days",
        badges: ["Domain-Driven Design", "TypeScript", "Zod"],
        symptom:
            "Runtime crashes appeared whenever an external carrier returned an unexpected JSON shape that bled into core business logic.",
        rootCause:
            "Unvalidated third-party API structures were trusted directly inside the domain layer.",
        solution:
            "Implemented an Anti-Corruption Layer using Zod for strict runtime schema enforcement, building a type-safe fortress around the core domain.",
        problem:
            "Unpredictable external carrier JSON structures were crashing the application at runtime by leaking into the core domain. The ACL validates and normalizes every external payload at the boundary before it touches business logic.",
        impact:
            "Zero runtime crashes from external API changes; developer productivity rose with deterministic data structures.",
        codeSnippet: `const CarrierRate = z.object({
  price: z.number(), currency: z.string(), eta: z.string(),
});
const rate = CarrierRate.parse(external); // throws at the boundary`,
    },
    {
        id: "cascading-filters-race",
        category: "Architecture",
        icon: Filter,
        title: "The Cascading Filter Race Condition",
        project: "CS Arena",
        severity: "medium",
        timeToSolve: "2 days",
        badges: ["Next.js 15", "Server Components", "useTransition"],
        symptom:
            "Clearing several dependent filters at once caused UI jank and router race conditions in Next.js.",
        rootCause:
            "Heavy URL state-sync ran on the main UI thread, blocking navigation when multiple dependent states changed together.",
        solution:
            "Used Next.js 15 useTransition and useActionState to decouple URL state-sync from the UI thread for non-blocking navigation.",
        problem:
            "Complex multi-level filtering caused UI jank and race conditions in the router when clearing multiple dependent states. Marking the state-sync as a transition keeps the interface responsive while the URL updates in the background.",
        impact:
            "Glitch-free, zero-latency filtering even with deep-nested category queries.",
    },
    {
        id: "api-fortress",
        category: "Security",
        icon: ShieldAlert,
        title: "The API Fortress: Defense in Depth",
        project: "Blog Pro / Cybership",
        severity: "high",
        timeToSolve: "5 days",
        badges: ["JWT", "Helmet", "Rate Limiting"],
        symptom:
            "Full-stack apps were exposed to XSS, brute-force, and unauthorized state mutations without a layered defense.",
        rootCause:
            "There was no single pipeline enforcing authentication, secure headers, and abuse mitigation together.",
        solution:
            "Built a multi-layered security pipeline: custom JWT guards for role-based access, Helmet for secure headers, and express-rate-limit to mitigate automated attacks.",
        problem:
            "Protecting full-stack applications from common vulnerabilities without killing performance required defense in depth. RBAC guards, secure HTTP headers, and rate limiting were combined into one cohesive pipeline.",
        impact:
            "Blocked 100% of basic automated exploits during testing and ensured zero unauthorized data access in production.",
    },
];

export const scarCategories = ["All", ...new Set(scarsData.map((s) => s.category))];
