"use client";

import {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
    memo,
} from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { evolutionData, type EvolutionChapter } from "./evolution.data";
import { ExternalLink, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════ */

const TOTAL = evolutionData.length;

const CHAPTER_LABELS = [
    "Foundation",
    "Builder",
    "Engineer",
    "Architect",
    "Inventor",
    "AI Pioneer",
] as const;

/** Reduced-motion query match */
const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════════════ */

const workspaceVariants: Variants = {
    initial: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 60 : -60,
        filter: "blur(4px)",
    }),
    animate: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? -40 : 40,
        filter: "blur(3px)",
        transition: { duration: 0.25, ease: [0.55, 0.06, 0.68, 0.19] },
    }),
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" },
    }),
};

/* ═══════════════════════════════════════════════════════════════════════
   CHAPTER RAIL — Desktop horizontal indexed navigation
   ═══════════════════════════════════════════════════════════════════════ */

const ChapterRail = memo(function ChapterRail({
    active,
    onSelect,
}: {
    active: number;
    onSelect: (i: number) => void;
}) {
    return (
        <nav
            aria-label="Chapter navigation"
            className="evo-chapter-rail"
        >
            {/* Track line behind segments */}
            <div className="evo-rail-track" aria-hidden="true" />

            {evolutionData.map((ch, i) => {
                const isActive = i === active;
                const isPast = i < active;
                return (
                    <button
                        key={ch.id}
                        type="button"
                        onClick={() => onSelect(i)}
                        aria-current={isActive ? "step" : undefined}
                        className={cn(
                            "evo-rail-segment",
                            isActive && "evo-rail-segment--active",
                            isPast && "evo-rail-segment--past",
                        )}
                    >
                        <span className="evo-rail-index">{String(i + 1).padStart(2, "0")}</span>
                        <span className="evo-rail-label">{CHAPTER_LABELS[i]}</span>
                        <span className={cn(
                            "evo-rail-dot",
                            isActive && "evo-rail-dot--active",
                            isPast && "evo-rail-dot--past",
                        )} />
                    </button>
                );
            })}
        </nav>
    );
});

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE CHAPTER NAV — Compact bottom-style controls
   ═══════════════════════════════════════════════════════════════════════ */

const MobileChapterNav = memo(function MobileChapterNav({
    active,
    onPrev,
    onNext,
}: {
    active: number;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div className="evo-mobile-nav">
            <button
                type="button"
                onClick={onPrev}
                disabled={active === 0}
                className="evo-mobile-nav-btn"
                aria-label="Previous chapter"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="evo-mobile-nav-center">
                <span className="evo-mobile-nav-index">
                    {String(active + 1).padStart(2, "0")}
                </span>
                <span className="evo-mobile-nav-sep">/</span>
                <span className="evo-mobile-nav-total">
                    {String(TOTAL).padStart(2, "0")}
                </span>
            </div>

            <button
                type="button"
                onClick={onNext}
                disabled={active === TOTAL - 1}
                className="evo-mobile-nav-btn"
                aria-label="Next chapter"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
});

/* ═══════════════════════════════════════════════════════════════════════
   CHAPTER WORKSPACE — The main content area for each chapter
   ═══════════════════════════════════════════════════════════════════════ */

const ChapterWorkspace = memo(function ChapterWorkspace({
    chapter,
    direction,
}: {
    chapter: EvolutionChapter;
    direction: number;
}) {
    const reduced = prefersReducedMotion();

    return (
        <motion.article
            key={chapter.id}
            custom={reduced ? 0 : direction}
            variants={reduced ? undefined : workspaceVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="evo-workspace"
            aria-label={`Chapter ${chapter.index + 1}: ${chapter.title}`}
        >
            {/* ── Header band ── */}
            <header className="evo-ws-header">
                <div className="evo-ws-header-left">
                    <span className="evo-ws-chapter-num">
                        {String(chapter.index + 1).padStart(2, "0")}
                    </span>
                    <div className="evo-ws-header-text">
                        <h3 className="evo-ws-title">{chapter.title}</h3>
                        <span className="evo-ws-year">{chapter.year}</span>
                    </div>
                </div>
                <p className="evo-ws-shift">{chapter.shift}</p>
            </header>

            {/* ── Main grid ── */}
            <div className="evo-ws-grid">
                {/* LEFT COLUMN: Story + evidence */}
                <div className="evo-ws-col-main">
                    {/* Description */}
                    <motion.p
                        className="evo-ws-desc"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        {chapter.description}
                    </motion.p>

                    {/* Core ideas */}
                    <motion.div
                        className="evo-ws-block"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                    >
                        <h4 className="evo-ws-block-label">Core Concepts</h4>
                        <ul className="evo-ws-ideas">
                            {chapter.coreIdeas.map((idea) => (
                                <li key={idea} className="evo-ws-idea">{idea}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Evidence */}
                    <motion.div
                        className="evo-ws-block"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                    >
                        <h4 className="evo-ws-block-label">Evidence</h4>
                        <ul className="evo-ws-evidence">
                            {chapter.evidence.map((point) => (
                                <li key={point} className="evo-ws-evidence-item">{point}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Experience (if present) */}
                    {chapter.experience && (
                        <motion.div
                            className="evo-ws-experience"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={3}
                        >
                            <div className="evo-ws-exp-header">
                                <Briefcase className="w-4 h-4" aria-hidden="true" />
                                <span className="evo-ws-exp-role">{chapter.experience.role}</span>
                                <span className="evo-ws-exp-at">@</span>
                                <span className="evo-ws-exp-company">{chapter.experience.company}</span>
                            </div>
                            <div className="evo-ws-exp-meta">
                                <span>{chapter.experience.type}</span>
                                <span className="evo-ws-exp-divider">·</span>
                                <span>{chapter.experience.period}</span>
                            </div>
                            <div className="evo-ws-exp-metrics">
                                {chapter.experience.metrics.map((m) => (
                                    <div key={m.label} className="evo-ws-exp-metric">
                                        <span className="evo-ws-exp-metric-val">{m.value}</span>
                                        <span className="evo-ws-exp-metric-label">{m.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* RIGHT COLUMN: Meta panel */}
                <aside className="evo-ws-col-meta">
                    {/* Technologies */}
                    <motion.div
                        className="evo-ws-meta-block"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                    >
                        <h4 className="evo-ws-meta-label">Technologies</h4>
                        <div className="evo-ws-tech-list">
                            {chapter.tech.map((t) => (
                                <span key={t} className="evo-ws-tech-tag">{t}</span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Capabilities */}
                    <motion.div
                        className="evo-ws-meta-block"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                    >
                        <h4 className="evo-ws-meta-label">Capabilities Gained</h4>
                        <ul className="evo-ws-capabilities">
                            {chapter.capabilities.map((c) => (
                                <li key={c} className="evo-ws-capability">{c}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Mindset */}
                    <motion.div
                        className="evo-ws-meta-block"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                    >
                        <h4 className="evo-ws-meta-label">Mindset</h4>
                        <p className="evo-ws-mindset">{chapter.mindset}</p>
                    </motion.div>

                    {/* Projects */}
                    {chapter.projects.length > 0 && (
                        <motion.div
                            className="evo-ws-meta-block"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={4}
                        >
                            <h4 className="evo-ws-meta-label">Projects</h4>
                            <div className="evo-ws-projects">
                                {chapter.projects.map((p) => (
                                    <a
                                        key={p.name}
                                        href={p.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="evo-ws-project-link"
                                    >
                                        {p.name}
                                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Transition */}
                    {chapter.transition && (
                        <motion.div
                            className="evo-ws-transition"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={5}
                        >
                            <p className="evo-ws-transition-text">{chapter.transition}</p>
                        </motion.div>
                    )}
                </aside>
            </div>

            {/* Active chapter indicator */}
            {chapter.isActive && (
                <div className="evo-ws-active-badge">
                    <span className="evo-ws-active-dot" />
                    Current Chapter
                </div>
            )}
        </motion.article>
    );
});

/* ═══════════════════════════════════════════════════════════════════════
   PROGRESS BAR — Horizontal evolution progress
   ═══════════════════════════════════════════════════════════════════════ */

const ProgressBar = memo(function ProgressBar({ active }: { active: number }) {
    const pct = ((active + 1) / TOTAL) * 100;
    return (
        <div className="evo-progress" aria-hidden="true">
            <div className="evo-progress-track">
                <motion.div
                    className="evo-progress-fill"
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
            </div>
        </div>
    );
});

/* ═══════════════════════════════════════════════════════════════════════
   MAIN EXPORT — EvolutionArc
   ═══════════════════════════════════════════════════════════════════════ */

export default function EvolutionArc() {
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);

    const chapter = useMemo(() => evolutionData[active], [active]);

    const goTo = useCallback(
        (index: number) => {
            if (index < 0 || index >= TOTAL || index === active) return;
            setDirection(index > active ? 1 : -1);
            setActive(index);
        },
        [active],
    );

    const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);
    const goNext = useCallback(() => goTo(active + 1), [active, goTo]);

    /* ── Keyboard navigation ── */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Only respond when the evolution section is in viewport
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;

            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                goNext();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                goPrev();
            } else if (e.key >= "1" && e.key <= "6") {
                e.preventDefault();
                goTo(parseInt(e.key, 10) - 1);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [goNext, goPrev, goTo]);

    /* ── Touch swipe for mobile ── */
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const onTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (touchStartX.current === null) return;
            const diff = e.changedTouches[0].clientX - touchStartX.current;
            const threshold = 50;
            if (Math.abs(diff) > threshold) {
                if (diff < 0) goNext();
                else goPrev();
            }
            touchStartX.current = null;
        },
        [goNext, goPrev],
    );

    return (
        <section
            ref={sectionRef}
            id="evolution"
            className="evo-section"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* Section header */}
            <div className="evo-header">
                <p className="section-eyebrow">Engineering Archive</p>
                <h2 className="evo-title">
                    My Engineering{" "}
                    <span className="evo-title-accent">Evolution</span>
                </h2>
                <p className="evo-subtitle">
                    From writing my first line of C++ to architecting autonomous AI agents with custom languages.
                </p>
            </div>

            {/* Desktop chapter rail */}
            <ChapterRail active={active} onSelect={goTo} />

            {/* Progress bar */}
            <ProgressBar active={active} />

            {/* Workspace container */}
            <div className="evo-workspace-container">
                <AnimatePresence mode="wait" custom={direction}>
                    <ChapterWorkspace
                        key={chapter.id}
                        chapter={chapter}
                        direction={direction}
                    />
                </AnimatePresence>
            </div>

            {/* Mobile navigation */}
            <MobileChapterNav active={active} onPrev={goPrev} onNext={goNext} />

            {/* Keyboard hint (desktop) */}
            <div className="evo-kb-hint" aria-hidden="true">
                <span>←</span>
                <span>→</span>
                <span className="evo-kb-hint-text">Navigate chapters</span>
            </div>
        </section>
    );
}
