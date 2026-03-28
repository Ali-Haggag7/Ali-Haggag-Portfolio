"use client";

import { cn } from "@/lib/utils";
import {
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import Link from "next/link";
import {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { DOCK_ITEMS, DockItem, smoothScrollTo } from "./data";

// ─── Spring & animation configs ───────────────────────────────────────────────
// Mutable object types — satisfies Framer Motion's internal SpringOptions.
// Only the string literal "spring" needs `as const` for the discriminated union.
const ICON_SPRING = { mass: 0.1, stiffness: 200, damping: 15 };

const TOOLTIP_SPRING = { type: "spring" as const, stiffness: 320, damping: 22 };

// Mutable tuple — satisfies Framer Motion's InputRange (number[]).
// as const was removed because readonly tuples are not assignable to mutable InputRange.
const DIST_RANGE: [number, number, number] = [-150, 0, 150];

// ─── FloatingDockDesktop ──────────────────────────────────────────────────────
export const FloatingDockDesktop = memo(function FloatingDockDesktop({
    className,
}: {
    className?: string;
}) {
    // MotionValue never triggers a React re-render — the perfect vehicle for
    // high-frequency mouse coordinates.
    const mouseX = useMotionValue(Infinity);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => mouseX.set(e.clientX),
        [mouseX],
    );

    const handleMouseLeave = useCallback(
        () => mouseX.set(Infinity),
        [mouseX],
    );

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "mx-auto hidden md:flex h-[72px] gap-4 items-end rounded-full",
                "bg-background/95 border border-border/50 px-6 pb-3",
                "shadow-2xl dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]",
                className,
            )}
        >
            {DOCK_ITEMS.map((item) => (
                <IconContainer key={item.title} mouseX={mouseX} item={item} />
            ))}
        </motion.div>
    );
});

// ─── IconContainer ────────────────────────────────────────────────────────────
// memo prevents re-renders when unrelated mouseX updates propagate upward —
// the motion values inside handle their own subscriptions.
const IconContainer = memo(function IconContainer({
    mouseX,
    item,
}: {
    mouseX: MotionValue<number>;
    item: DockItem;
}) {
    const { title, Icon, iconClassName, href, glowColor } = item;

    // Cache bounding rect so the transform callback never calls
    // getBoundingClientRect() synchronously mid-frame (forced layout).
    const ref = useRef<HTMLDivElement>(null);
    const boundsRef = useRef({ x: 0, width: 0 });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const read = () => {
            const r = el.getBoundingClientRect();
            boundsRef.current = { x: r.x, width: r.width };
        };
        read(); // initial read

        // Re-read only on resize — avoids layout thrash on every mousemove.
        const ro = new ResizeObserver(read);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // All motion derivations stay in MotionValue land — zero React re-renders.
    const distance = useTransform(mouseX, (val) => {
        const { x, width } = boundsRef.current;
        return val - x - width / 2;
    });

    const widthTransform = useTransform(distance, DIST_RANGE, [48, 80, 48]);
    const heightTransform = useTransform(distance, DIST_RANGE, [48, 80, 48]);
    const width = useSpring(widthTransform, ICON_SPRING);
    const height = useSpring(heightTransform, ICON_SPRING);
    const iconScale = useTransform(distance, DIST_RANGE, [1, 1.4, 1]);

    const [hovered, setHovered] = useState(false);

    const onEnter = useCallback(() => setHovered(true), []);
    const onLeave = useCallback(() => setHovered(false), []);

    const isExternal = !href.startsWith("#");

    // onClick is stable — smoothScrollTo is a module-level function.
    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (!isExternal) smoothScrollTo(e, href);
        },
        [isExternal, href],
    );

    // CSS custom properties for glow — computed once per glowColor change,
    // not on every render.
    const glowStyle = useMemo(
        () => ({
            "--glow-bg": `${glowColor}15`,
            "--glow-border": glowColor,
            "--glow-shadow": `0 10px 20px -5px ${glowColor}50`,
            // Promote to GPU layer before animation starts — eliminates first-hover
            // layer-promotion jank.
            willChange: "transform, width, height",
        } as React.CSSProperties),
        [glowColor],
    );

    // cn() is not free — memoised against the only value that changes it.
    const containerClass = useMemo(
        () =>
            cn(
                "aspect-square rounded-full flex items-center justify-center relative",
                hovered
                    ? "bg-[var(--glow-bg)] border border-[var(--glow-border)] shadow-[var(--glow-shadow)]"
                    : "bg-card border border-transparent shadow-sm",
            ),
        [hovered],
    );

    return (
        <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            onClick={handleClick}
        >
            <motion.div
                ref={ref}
                style={{ width, height, ...glowStyle }}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                className={containerClass}
            >
                {/* ── Tooltip ────────────────────────────────────────────────────────
            Always mounted — opacity + transform are Compositor-only props.
            No DOM insertion/removal = no Layout or Paint on hover toggle.
            AnimatePresence removed intentionally: mount/unmount is the
            enemy of zero-jank interactions.
        ──────────────────────────────────────────────────────────────────── */}
                <motion.div
                    animate={
                        hovered
                            ? { opacity: 1, y: 0, scale: 1 }
                            : { opacity: 0, y: 10, scale: 0.88 }
                    }
                    transition={TOOLTIP_SPRING}
                    // pointer-events:none keeps it inert when invisible — no hit-test cost.
                    className="pointer-events-none px-3 py-1.5 whitespace-pre rounded-lg bg-foreground text-background border border-border absolute left-1/2 -translate-x-1/2 -top-12 w-fit text-sm font-semibold shadow-xl z-50 flex items-center gap-2"
                    style={{ willChange: "transform, opacity" }}
                >
                    <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: glowColor }}
                    />
                    {title}
                </motion.div>

                {/* ── Icon ───────────────────────────────────────────────────────────
            scale is a transform — pure Compositor, no Layout or Paint.
            Rendered from component ref for stable React reconciliation.
        ──────────────────────────────────────────────────────────────────── */}
                <motion.div
                    style={{ scale: iconScale, willChange: "transform" }}
                    className="flex items-center justify-center text-muted-foreground transition-colors duration-300"
                >
                    <Icon className={cn("h-full w-full", iconClassName)} />
                </motion.div>
            </motion.div>
        </Link>
    );
});