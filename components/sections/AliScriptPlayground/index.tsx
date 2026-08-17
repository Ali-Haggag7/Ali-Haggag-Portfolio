"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { PlaygroundEditor } from "./PlaygroundEditor";
import { Code, ChevronRight, Cpu, Zap, Shield, GitBranch } from "lucide-react";
import { FlowingGrid } from "@/components/ui/FlowingGrid";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { BorderBeam } from "@/components/ui/BorderBeam";

// ── Compilation Pipeline ──────────────────────────────────────────────────────
const PIPELINE: { label: string; sub: string; accent: string }[] = [
    { label: "Source Code", sub: ".ali file", accent: "var(--ali-accent-src)" },
    { label: "Lexer", sub: "tokenize", accent: "var(--ali-accent-lex)" },
    { label: "AST Parser", sub: "tree build", accent: "var(--ali-accent-ast)" },
    { label: "TLE Guard", sub: "2,000-op quota", accent: "var(--ali-accent-tle)" },
    { label: "Sandbox", sub: "2D arena", accent: "var(--ali-accent-sbx)" },
];

// ── Language Fact Cards ───────────────────────────────────────────────────────
const LANG_FACTS: { icon: React.ElementType; label: string; desc: string; accent: string }[] = [
    {
        icon: Zap,
        label: "Deterministic",
        desc: "Hardware-independent ops budget. Same rules on every server.",
        accent: "var(--ali-accent-det)",
    },
    {
        icon: Shield,
        label: "Sandboxed AST",
        desc: "Zero file/network access. Pure syntax tree evaluated in-browser.",
        accent: "var(--ali-accent-shield)",
    },
    {
        icon: Cpu,
        label: "2,000 ops / tick",
        desc: "Every IF, WHILE, FOR and CALL draws from a shared quota.",
        accent: "var(--ali-accent-cpu)",
    },
    {
        icon: GitBranch,
        label: "Full Control Flow",
        desc: "IF · THEN · ELSE · WHILE · DO · FOR · FUNCTION · CALL",
        accent: "var(--ali-accent-flow)",
    },
];

// ── Mobile Code Preview ───────────────────────────────────────────────────────
// Hard-coded syntax-coloured HTML rendered via inline styles — no runtime tokenizer needed.
const MOBILE_PREVIEW_LINES: { indent: number; tokens: { text: string; color: string }[] }[] = [
    { indent: 0, tokens: [{ text: "// AliScript v2.4 — Target Hunt", color: "#94a3b8" }] },
    { indent: 0, tokens: [] },
    { indent: 0, tokens: [{ text: "WHILE ", color: "#60a5fa" }, { text: "distance ", color: "#a78bfa" }, { text: "> ", color: "#94a3b8" }, { text: "1 ", color: "#67e8f9" }, { text: "DO", color: "#60a5fa" }] },
    { indent: 2, tokens: [{ text: "IF ", color: "#60a5fa" }, { text: "CAN_SEE_ENEMY ", color: "#a78bfa" }, { text: "THEN", color: "#60a5fa" }] },
    { indent: 4, tokens: [{ text: "FIRE", color: "#34d399" }] },
    { indent: 2, tokens: [{ text: "END", color: "#60a5fa" }] },
    { indent: 2, tokens: [{ text: "PATHFIND", color: "#34d399" }] },
    { indent: 0, tokens: [{ text: "END", color: "#60a5fa" }] },
    { indent: 0, tokens: [] },
    { indent: 0, tokens: [{ text: "FIRE", color: "#34d399" }] },
];

export default function AliScriptPlaygroundSection() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    return (
        <section
            id="aliscript-playground"
            className="relative w-full py-20 bg-transparent overflow-hidden"
        >
            {/* React Bits 3D Perspective Flowing Grid */}
            <FlowingGrid className="opacity-20 dark:opacity-30" horizon={0.3} speed={0.4} gridColor="rgba(16, 185, 129, 0.25)" />

            {/* Radial emerald glow */}
            <div
                className="absolute inset-0 pointer-events-none -z-10 opacity-70 dark:opacity-100"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)",
                }}
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* ── Section Header ───────────────────────────────────────── */}
                <div className="flex flex-col items-center text-center mb-12 max-w-4xl mx-auto">
                    <p className="section-eyebrow mb-3">
                        <DecryptedText text="Custom DSL Compiler & VM" speed={30} sequential={true} animateOn="view" />
                    </p>

                    <h2 className="section-title text-4xl md:text-5xl mb-4">
                        AliScript{" "}
                        <span className="accent-word-emerald">v2.4</span>
                    </h2>

                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mb-10">
                        A scripting language Ali engineered from scratch — a hand-written Lexer,
                        recursive-descent AST parser, and a deterministic 2,000-ops/tick TLE quota
                        evaluator — all running entirely in the browser, zero dependencies.
                    </p>

                    {/* ── Compilation Pipeline ───────────────────────────── */}
                    <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-2 w-full px-2 mb-10">
                        {PIPELINE.map((stage, i) => (
                            <div key={stage.label} className="flex items-center gap-2 shrink-0">
                                <div
                                    className="group flex flex-col items-center px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-center min-w-[85px] sm:min-w-[90px] transition-all duration-300 hover:-translate-y-0.5"
                                    style={{
                                        background: `color-mix(in srgb, ${stage.accent} 7%, hsl(var(--card)))`,
                                        border: `1px solid color-mix(in srgb, ${stage.accent} 22%, hsl(var(--border) / 0.4))`,
                                        boxShadow: `0 4px 12px -2px color-mix(in srgb, ${stage.accent} 10%, transparent), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`,
                                    }}
                                >
                                    <span
                                        className="font-mono font-bold"
                                        style={{ fontSize: "11px", color: stage.accent }}
                                    >
                                        {stage.label}
                                    </span>
                                    <span
                                        className="mt-0.5 font-medium"
                                        style={{
                                            fontSize: "9.5px",
                                            color: "hsl(var(--muted-foreground))",
                                            fontFamily: "'Inter', system-ui, sans-serif",
                                            letterSpacing: "0.04em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {stage.sub}
                                    </span>
                                </div>
                                {i < PIPELINE.length - 1 && (
                                    <ChevronRight
                                        className="h-3.5 w-3.5 shrink-0"
                                        style={{ color: `color-mix(in srgb, ${stage.accent} 50%, hsl(var(--muted-foreground)))` }}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Language Fact Cards ────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 w-full max-w-4xl">
                        {LANG_FACTS.map(({ icon: Icon, label, desc, accent }) => (
                            <div
                                key={label}
                                className="group relative flex flex-col items-center gap-2.5 px-4 py-4.5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                style={{
                                    background: `color-mix(in srgb, ${accent} 6%, hsl(var(--card)))`,
                                    border: `1px solid color-mix(in srgb, ${accent} 20%, hsl(var(--border) / 0.4))`,
                                    boxShadow: `0 4px 16px -4px color-mix(in srgb, ${accent} 10%, transparent), inset 0 1px 0 0 color-mix(in srgb, ${accent} 15%, transparent)`,
                                }}
                            >
                                {/* Top subtle glow accent line */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                                    }}
                                />

                                {/* Icon badge */}
                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        background: `color-mix(in srgb, ${accent} 14%, hsl(var(--card)))`,
                                        border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
                                        boxShadow: `0 2px 8px color-mix(in srgb, ${accent} 15%, transparent)`,
                                    }}
                                >
                                    <Icon className="h-4.5 w-4.5" style={{ color: accent }} aria-hidden="true" />
                                </div>

                                <span
                                    className="font-bold"
                                    style={{
                                        fontSize: "12px",
                                        color: accent,
                                        fontFamily: "'Inter', system-ui, sans-serif",
                                        letterSpacing: "0.01em",
                                    }}
                                >
                                    {label}
                                </span>

                                <span
                                    className="leading-relaxed"
                                    style={{
                                        fontSize: "10.5px",
                                        color: "hsl(var(--muted-foreground))",
                                        fontFamily: "'Inter', system-ui, sans-serif",
                                    }}
                                >
                                    {desc}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Interactive Editor or Mobile Fallback ─────────────── */}
                {isMobile ? (
                    <div className="max-w-sm mx-auto rounded-2xl border border-border bg-card p-6 text-center shadow-lg space-y-5">
                        {/* Icon */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mx-auto">
                            <Code className="h-6 w-6" aria-hidden="true" />
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-foreground">AliScript v2.4</h3>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                Open on desktop to interactively compile and run AliScript programs
                                inside the 2D sandbox arena.
                            </p>
                        </div>

                        {/* Syntax-coloured code preview */}
                        <div
                            className="rounded-xl border border-border/60 p-4 text-left font-mono text-xs"
                            style={{ backgroundColor: "var(--scar-code-bg, #070b14)" }}
                        >
                            {MOBILE_PREVIEW_LINES.map((line, li) => (
                                <div key={li} style={{ minHeight: "1.4rem", lineHeight: "1.4rem" }}>
                                    {line.tokens.length === 0 ? (
                                        "\u00a0"
                                    ) : (
                                        <>
                                            {"\u00a0".repeat(line.indent)}
                                            {line.tokens.map((tok, ti) => (
                                                <span key={ti} style={{ color: tok.color }}>
                                                    {tok.text}
                                                </span>
                                            ))}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <PlaygroundEditor />
                )}
            </div>
        </section>
    );
}
