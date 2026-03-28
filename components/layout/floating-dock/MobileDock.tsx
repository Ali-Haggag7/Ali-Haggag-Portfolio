"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import { DOCK_ITEMS, type DockItem, smoothScrollTo } from "./data";

// ─── Constants — allocated once, never re-allocated ──────────────────────────

const ITEM_SPRING = { type: "spring", stiffness: 200, damping: 20 } as const;
const TOGGLE_SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;

// Pre-compute stagger delays for both open (reverse cascade) and
// exit (forward cascade) directions. Avoids arithmetic inside render.
const OPEN_DELAYS = DOCK_ITEMS.map((_, i) => (DOCK_ITEMS.length - 1 - i) * 0.05);
const EXIT_DELAYS = DOCK_ITEMS.map((_, i) => i * 0.05);

// ─── MobileNavItem ────────────────────────────────────────────────────────────
// Isolated into its own memo component so that toggling `open` on the parent
// does NOT re-render items that are already in their final animated state.
const MobileNavItem = memo(function MobileNavItem({
    item,
    index,
    visible,
    onClose,
}: {
    item: DockItem;
    index: number;
    visible: boolean;
    onClose: () => void;
}) {
    const { Icon, iconClassName, href, glowColor, title } = item;
    const isExternal = !href.startsWith("#");

    // Stable click handler — depends only on href and isExternal,
    // which are constant for the lifetime of this item.
    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (!isExternal) smoothScrollTo(e, href, onClose);
        },
        [isExternal, href, onClose],
    );

    // Glow shadow computed once per glowColor — not per render.
    const shadowStyle = useMemo(
        () => ({ boxShadow: `0 4px 20px -5px ${glowColor}40` }),
        [glowColor],
    );

    return (
        // Always mounted — visibility driven by opacity + transform (Compositor only).
        // will-change declared upfront so the GPU layer is ready before first toggle.
        <motion.div
            aria-hidden={!visible}
            animate={
                visible
                    ? { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" as const }
                    : { opacity: 0, y: 15, scale: 0.88, pointerEvents: "none" as const }
            }
            transition={{
                ...ITEM_SPRING,
                // Swap delay direction based on visibility state.
                delay: visible ? OPEN_DELAYS[index] : EXIT_DELAYS[index],
            }}
            style={{ willChange: "transform, opacity" }}
        >
            <Link
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                onClick={handleClick}
                aria-label={title}
                tabIndex={visible ? 0 : -1}
                className="h-12 w-12 rounded-full bg-background border border-border shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                style={shadowStyle}
            >
                {/* Icon rendered from component ref — stable reconciliation target */}
                <Icon className={cn("h-5 w-5", iconClassName)} />
            </Link>
        </motion.div>
    );
});

// ─── FloatingDockMobile ───────────────────────────────────────────────────────
export const FloatingDockMobile = memo(function FloatingDockMobile({
    className,
}: {
    className?: string;
}) {
    const [open, setOpen] = useState(false);

    // Functional updater — avoids stale closure on rapid taps.
    const toggleOpen = useCallback(() => setOpen((o) => !o), []);

    // Passed as onClose to each item; stable reference via useCallback.
    const closeMenu = useCallback(() => setOpen(false), []);

    // Respect the OS "reduce motion" setting — accessibility + perf on low-end devices.
    const prefersReduced = useReducedMotion();

    return (
        <div className={cn("relative block md:hidden z-50", className)}>
            {/* ── Item list ─────────────────────────────────────────────────────────
          Always in the DOM. Visibility toggled via Compositor-only properties.
          This eliminates 7× insertBefore/removeChild calls per open/close cycle.
      ────────────────────────────────────────────────────────────────────────── */}
            <div
                className="absolute bottom-full mb-4 inset-x-0 flex flex-col gap-3 items-center"
                // inert makes the whole group non-interactive & invisible to AT when closed,
                // without touching individual children — one DOM write instead of N.
                inert={!open ? ("" as unknown as boolean) : undefined}
            >
                {DOCK_ITEMS.map((item, idx) => (
                    <MobileNavItem
                        key={item.title}
                        item={item}
                        index={idx}
                        visible={open}
                        onClose={closeMenu}
                    />
                ))}
            </div>

            {/* ── Toggle button ─────────────────────────────────────────────────────
          The hamburger lines and × are always mounted. We cross-fade between
          them with opacity — no conditional rendering, no DOM diffing.
      ────────────────────────────────────────────────────────────────────────── */}
            <button
                type="button"
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={open}
                aria-controls="mobile-dock-items"
                onClick={toggleOpen}
                className="h-14 w-14 rounded-full bg-foreground text-background shadow-2xl flex items-center justify-center active:scale-90 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            >
                {/* Outer wrapper rotates 45° on open — drives the × illusion */}
                <motion.div
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={prefersReduced ? { duration: 0 } : TOGGLE_SPRING}
                    style={{ willChange: "transform" }}
                    className="relative h-6 w-6"
                >
                    {/* Hamburger bars — always mounted, fade out on open */}
                    <motion.div
                        animate={{ opacity: open ? 0 : 1 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 flex flex-col gap-[5px] items-center justify-center"
                        aria-hidden
                    >
                        <span className="h-0.5 w-5 bg-current rounded-full block" />
                        <span className="h-0.5 w-5 bg-current rounded-full block" />
                        <span className="h-0.5 w-5 bg-current rounded-full block" />
                    </motion.div>

                    {/* × bars — always mounted, fade in on open.
              Built from two rotated divs so the 45° parent rotation
              produces a perfect × with zero layout cost. */}
                    <motion.div
                        animate={{ opacity: open ? 1 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 flex items-center justify-center"
                        aria-hidden
                    >
                        <span className="h-0.5 w-5 bg-current rounded-full block" />
                    </motion.div>
                </motion.div>
            </button>
        </div>
    );
});