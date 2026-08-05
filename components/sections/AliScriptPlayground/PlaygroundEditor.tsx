"use client";

import { memo, useState, useCallback, useMemo } from "react";
import {
    Play, RotateCcw, Cpu, AlertTriangle, CheckCircle2,
    Code2, Lock, Crosshair, RefreshCw, Zap, Sigma,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRESET_SCRIPTS, runAliScript, MAX_OPS_QUOTA, type ExecutionStep } from "./interpreter";
import { RobotCanvas } from "./RobotCanvas";

// ─────────────────────────────────────────────────────────────────────────────
// Syntax Highlighter
// ─────────────────────────────────────────────────────────────────────────────

type TokenType =
    | "keyword"    // IF THEN ELSE END WHILE DO FOR TO NOT AND OR FUNCTION CALL RETURN BREAK CONTINUE
    | "command"    // MOVE FIRE BURST_FIRE PATHFIND SCAN WAIT SET STOP …
    | "sensor"     // CAN_SEE_ENEMY distance NEAREST_VISIBLE_X …
    | "mathfn"     // ATAN2 SQRT ABS MIN MAX GET_ALL_VISIBLE_ENEMIES …
    | "comment"    // // …
    | "string"     // "…"
    | "number"     // 0  1.57  …
    | "operator"   // = > < + - * / == != >=
    | "identifier" // user-defined identifiers
    | "space";     // whitespace runs

interface Token { type: TokenType; value: string }

const PATTERNS: Array<[RegExp, TokenType]> = [
    [/^(\/\/.*)/, "comment"],
    [/^("[^"]*")/, "string"],
    [/^(\d+(?:\.\d+)?)(?![a-zA-Z_])/, "number"],
    [/^(IF|THEN|ELSE|END|WHILE|DO|FOR|TO|NOT|AND|OR|FUNCTION|CALL|RETURN|BREAK|CONTINUE)(?![a-zA-Z0-9_])/i, "keyword"],
    [/^(MOVE_FAST|BURST_FIRE|MOVE|BACKUP|PATHFIND|STOP|FIRE|SCAN|WAIT|SET|TELEPORT|SHIELD|CLOAK|MINE|DASH)(?![a-zA-Z0-9_])/i, "command"],
    [/^(CAN_SEE_ENEMY|CAN_SEE_OBSTACLE|NEAREST_VISIBLE_X|NEAREST_VISIBLE_Y|POSITION_X|POSITION_Y|health|rotation|distance|spotted|MY_ENERGY|ENERGY_PCT|IN_STASIS|VISIBLE_ENEMY_COUNT|FOV_ANGLE|target_vx|target_vy|bullet_speed)(?![a-zA-Z0-9_])/, "sensor"],
    [/^(GET_ALL_VISIBLE_ENEMIES|ATAN2|SQRT|ABS|POW|SIN|COS|TAN|MIN|MAX|FLOOR|CEIL|ROUND|LOG|RANDOM|LENGTH|PUSH|POP|RAYCAST|BROADCAST|RECEIVE)(?![a-zA-Z0-9_])/i, "mathfn"],
    [/^([=<>!+\-*/]+)/, "operator"],
    [/^([a-zA-Z_]\w*)/, "identifier"],
    [/^(\s+)/, "space"],
    [/^(.)/, "identifier"],
];

/** Per-token inline styles — theme-aware CSS variables */
const TOKEN_STYLE: Record<TokenType, React.CSSProperties> = {
    keyword:    { color: "var(--ali-tok-keyword)" },
    command:    { color: "var(--ali-tok-command)", fontWeight: "600" },
    sensor:     { color: "var(--ali-tok-sensor)" },
    mathfn:     { color: "var(--ali-tok-mathfn)" },
    comment:    { color: "var(--ali-tok-comment)", fontStyle: "italic" },
    string:     { color: "var(--ali-tok-string)" },
    number:     { color: "var(--ali-tok-number)" },
    operator:   { color: "var(--ali-tok-operator)" },
    identifier: { color: "var(--ali-tok-ident)" },
    space:      {},
};

function tokenizeLine(line: string): Token[] {
    const tokens: Token[] = [];
    let pos = 0;
    while (pos < line.length) {
        const sub = line.slice(pos);
        let matched = false;
        for (const [re, type] of PATTERNS) {
            const m = sub.match(re);
            if (m) {
                tokens.push({ type, value: m[0] });
                pos += m[0].length;
                if (type === "comment") pos = line.length;
                matched = true;
                break;
            }
        }
        if (!matched) { tokens.push({ type: "identifier", value: line[pos] }); pos++; }
    }
    return tokens;
}

const LINE_H = "1.5rem";

function SyntaxHighlightedCode({ code }: { code: string }) {
    const lines = useMemo(() => code.split("\n"), [code]);
    return (
        <div style={{ whiteSpace: "pre", fontFamily: "inherit" }}>
            {lines.map((line, i) => (
                <div key={i} style={{ minHeight: LINE_H, lineHeight: LINE_H }}>
                    {line.length === 0
                        ? "\u00a0"
                        : tokenizeLine(line).map((tok, j) => (
                            <span key={j} style={TOKEN_STYLE[tok.type]}>{tok.value}</span>
                        ))}
                </div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Preset icon map — Lucide icons instead of emoji
// ─────────────────────────────────────────────────────────────────────────────

const PRESET_ICON_MAP: Record<string, React.ElementType> = {
    "target-hunt":     Crosshair,
    "patrol-perimeter": RefreshCw,
    "tactical-combat": Zap,
};

// ─────────────────────────────────────────────────────────────────────────────
// Language Feature Chips — redesigned with category icons + layered depth
// ─────────────────────────────────────────────────────────────────────────────

interface LangChip {
    label: string;
    color: string;
    dotColor: string;
}

const LANG_CHIPS: LangChip[] = [
    { label: "IF · THEN · ELSE · END",  color: "var(--ali-chip-keyword)", dotColor: "var(--ali-chip-keyword)" },
    { label: "WHILE cond DO · END",     color: "var(--ali-chip-keyword)", dotColor: "var(--ali-chip-keyword)" },
    { label: "FOR i = 0 TO n DO · END", color: "var(--ali-chip-keyword)", dotColor: "var(--ali-chip-keyword)" },
    { label: "CAN_SEE_ENEMY",           color: "var(--ali-chip-sensor)",  dotColor: "var(--ali-chip-sensor)" },
    { label: "distance",                color: "var(--ali-chip-sensor)",  dotColor: "var(--ali-chip-sensor)" },
    { label: "ATAN2(y, x)",             color: "var(--ali-chip-mathfn)",  dotColor: "var(--ali-chip-mathfn)" },
    { label: "BURST_FIRE",              color: "var(--ali-chip-command)", dotColor: "var(--ali-chip-command)" },
    { label: "PATHFIND",                color: "var(--ali-chip-command)", dotColor: "var(--ali-chip-command)" },
    { label: "2,000 ops / tick",        color: "var(--ali-chip-quota)",   dotColor: "var(--ali-chip-quota)" },
    { label: "Deterministic AST",       color: "var(--ali-chip-ast)",     dotColor: "var(--ali-chip-ast)" },
];

// Complexity badge — styled with subtle gradient ring
function ComplexityBadge({ value }: { value: string }) {
    return (
        <div
            className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 overflow-hidden"
            style={{
                background:    "color-mix(in srgb, var(--ali-chip-mathfn) 12%, hsl(var(--card)))",
                border:        "1px solid color-mix(in srgb, var(--ali-chip-mathfn) 30%, transparent)",
                boxShadow:     "inset 0 1px 0 color-mix(in srgb, var(--ali-chip-mathfn) 15%, transparent)",
            }}
        >
            <Sigma className="h-3 w-3 shrink-0" style={{ color: "var(--ali-chip-mathfn)" }} aria-hidden="true" />
            <span
                className="text-[10px] font-semibold tracking-wide"
                style={{
                    color:       "var(--ali-chip-mathfn)",
                    fontFamily:  "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
                    letterSpacing: "0.04em",
                }}
            >
                {value}
            </span>
        </div>
    );
}

// "Sandboxed AST" badge in header
function SandboxedBadge() {
    return (
        <span
            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium tracking-wide"
            style={{
                background:    "color-mix(in srgb, var(--ali-chip-command) 12%, hsl(var(--card)))",
                border:        "1px solid color-mix(in srgb, var(--ali-chip-command) 30%, transparent)",
                color:         "var(--ali-chip-command)",
                boxShadow:     "inset 0 1px 0 color-mix(in srgb, var(--ali-chip-command) 15%, transparent)",
                letterSpacing: "0.05em",
                fontFamily:    "'SF Mono', 'Fira Code', monospace",
            }}
        >
            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--ali-chip-command)", boxShadow: "0 0 4px var(--ali-chip-command)" }}
            />
            Sandboxed AST
        </span>
    );
}

// Single language chip
function LangChipItem({ chip }: { chip: LangChip }) {
    return (
        <span
            className="shrink-0 inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-md font-mono"
            style={{
                color:           chip.color,
                background:      `color-mix(in srgb, ${chip.color} 10%, hsl(var(--card)))`,
                border:          `1px solid color-mix(in srgb, ${chip.color} 25%, transparent)`,
                boxShadow:       `inset 0 1px 0 color-mix(in srgb, ${chip.color} 15%, transparent)`,
                letterSpacing:   "0.02em",
            }}
        >
            <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: chip.dotColor }}
            />
            {chip.label}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const PlaygroundEditor = memo(function PlaygroundEditor() {
    const [selectedPresetId, setSelectedPresetId] = useState("target-hunt");
    const [steps, setSteps]                       = useState<ExecutionStep[]>([]);
    const [currentStepIdx, setCurrentStepIdx]     = useState(0);
    const [isPlaying, setIsPlaying]               = useState(false);

    const selectedPreset = useMemo(
        () => PRESET_SCRIPTS.find((p) => p.id === selectedPresetId) ?? PRESET_SCRIPTS[0],
        [selectedPresetId],
    );

    const code      = selectedPreset.code;
    const lineCount = useMemo(() => code.split("\n").length, [code]);

    const currentStep = useMemo(() => {
        if (steps.length === 0) return {
            robot:  { x: 1, y: 6, dir: 0 as const, energy: 100, hp: 100, laserFired: false },
            target: { x: 1, y: 1, hp: 100 },
            opsUsed: 0,
            log: "Press 'Compile & Execute' to run AliScript",
        };
        return steps[Math.min(currentStepIdx, steps.length - 1)];
    }, [steps, currentStepIdx]);

    const handlePresetChange = useCallback((presetId: string) => {
        setSelectedPresetId(presetId);
        setSteps([]);
        setCurrentStepIdx(0);
        setIsPlaying(false);
    }, []);

    const handleExecute = useCallback(() => {
        const result = runAliScript(code);
        setSteps(result);
        setCurrentStepIdx(0);
        setIsPlaying(true);
    }, [code]);

    const handleReset = useCallback(() => {
        setSteps([]);
        setCurrentStepIdx(0);
        setIsPlaying(false);
    }, []);

    const handleNextStep = useCallback(() => {
        if (currentStepIdx < steps.length - 1) setCurrentStepIdx((p) => p + 1);
        else setIsPlaying(false);
    }, [currentStepIdx, steps.length]);

    const opsPercentage = useMemo(
        () => Math.min(100, (currentStep.opsUsed / MAX_OPS_QUOTA) * 100),
        [currentStep.opsUsed],
    );

    const dotsWindow = useMemo(() => {
        if (steps.length === 0) return [];
        const half  = 3;
        const start = Math.max(0, currentStepIdx - half);
        const end   = Math.min(steps.length - 1, start + 6);
        const result: number[] = [];
        for (let i = start; i <= end; i++) result.push(i);
        return result;
    }, [steps.length, currentStepIdx]);

    return (
        <div className="w-full max-w-5xl mx-auto rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">

            {/* ── Header Toolbar ──────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-border/60 bg-gradient-to-r from-card to-background">
                {/* Logo + title */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-inner shadow-emerald-900/20">
                        <Code2 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-foreground font-mono flex items-center gap-2 flex-wrap">
                            AliScript v2.4 IDE
                            <SandboxedBadge />
                        </h3>
                        <p
                            className="text-muted-foreground mt-0.5"
                            style={{ fontSize: "11px", letterSpacing: "0.01em", fontFamily: "'Inter', system-ui, sans-serif" }}
                        >
                            Deterministic TLE Quota Evaluator · 2,000 Ops limit
                        </p>
                    </div>
                </div>

                {/* Preset buttons */}
                <div className="flex items-center gap-2">
                    <span
                        className="text-muted-foreground/60 hidden sm:inline"
                        style={{ fontSize: "11px", letterSpacing: "0.04em", fontFamily: "'Inter', system-ui, sans-serif", textTransform: "uppercase" }}
                    >
                        Presets
                    </span>
                    <div className="flex gap-1.5">
                        {PRESET_SCRIPTS.map((preset) => {
                            const Icon = PRESET_ICON_MAP[preset.id] ?? Zap;
                            const isActive = selectedPresetId === preset.id;
                            return (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => handlePresetChange(preset.id)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center gap-1 leading-tight",
                                        isActive
                                            ? "text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 bg-emerald-500/10"
                                            : "border border-border text-muted-foreground hover:text-foreground hover:border-border/80 bg-background",
                                    )}
                                >
                                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>{preset.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Language Feature Chips Strip ────────────────────────────── */}
            <div className="flex items-center gap-1.5 px-5 py-2 border-b border-border/40 bg-background/10 overflow-x-auto scrollbar-none">
                <span
                    className="text-muted-foreground/60 shrink-0 pr-1 uppercase font-semibold"
                    style={{ fontSize: "9px", letterSpacing: "0.08em", fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                    syntax
                </span>
                {LANG_CHIPS.map((chip) => (
                    <LangChipItem key={chip.label} chip={chip} />
                ))}
            </div>

            {/* ── Main Two-Panel Grid ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12">

                {/* ── LEFT: Code Editor Panel ─────────────────────────────── */}
                <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-border/40">

                    {/* Terminal header bar */}
                    <div
                        className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 shrink-0"
                        style={{ backgroundColor: "var(--scar-code-bg)" }}
                    >
                        {/* Traffic-light dots */}
                        <div className="flex gap-1.5">
                            <span className="h-3 w-3 rounded-full bg-red-500/80" />
                            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <span
                            className="text-muted-foreground flex-1 truncate font-mono font-medium"
                            style={{ fontSize: "11px" }}
                        >
                            main.ali — AliScript DSL
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <Lock className="h-3 w-3 text-muted-foreground/60" aria-hidden="true" />
                            <span
                                className="text-muted-foreground/70 font-medium"
                                style={{ fontSize: "10px", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "0.01em" }}
                            >
                                read-only preset
                            </span>
                            <span className="text-muted-foreground/50 ml-1 font-mono" style={{ fontSize: "10px" }}>
                                {lineCount} lines
                            </span>
                        </div>
                    </div>

                    {/* Code display area */}
                    <div
                        className="relative flex flex-1 overflow-auto"
                        style={{ minHeight: 240, backgroundColor: "var(--scar-code-bg)" }}
                    >
                        {/* Line gutter */}
                        <div
                            className="select-none text-right pl-3 pr-3 border-r border-border/30 py-4 font-mono shrink-0 font-medium"
                            style={{ color: "var(--muted-foreground)", opacity: 0.6, fontSize: "0.75rem" }}
                        >
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div key={i} style={{ minHeight: LINE_H, lineHeight: LINE_H }}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Syntax-highlighted code */}
                        <div className="flex-1 px-4 py-4 overflow-auto text-xs md:text-sm font-mono font-medium">
                            <SyntaxHighlightedCode code={code} />
                        </div>
                    </div>

                    {/* Quota bar + action buttons */}
                    <div
                        className="p-4 border-t border-border/40 space-y-3 shrink-0"
                        style={{ backgroundColor: "var(--scar-code-bg)" }}
                    >
                        {/* TLE Ops Quota Bar */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="flex items-center gap-1.5 text-muted-foreground font-mono font-medium" style={{ fontSize: "11px" }}>
                                    <Cpu className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
                                    TLE Ops Quota:
                                </span>
                                <span
                                    className={cn("font-bold tabular-nums font-mono", opsPercentage > 80 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")}
                                    style={{ fontSize: "11px" }}
                                >
                                    {currentStep.opsUsed} / {MAX_OPS_QUOTA} ops ({Math.round(opsPercentage)}%)
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/60">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-500",
                                        opsPercentage > 80 ? "bg-red-500" : "bg-emerald-500",
                                    )}
                                    style={{ width: `${opsPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleExecute}
                                className="flex-1 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-900/30 cursor-pointer"
                            >
                                <Play className="h-4 w-4" aria-hidden="true" />
                                Compile &amp; Execute
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex min-h-[44px] items-center justify-center gap-2 px-4 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Canvas + Console ──────────────────────────────── */}
                <div className="lg:col-span-5 flex flex-col divide-y divide-border/40">

                    {/* 2D Arena Canvas */}
                    <div className="p-4">
                        <RobotCanvas robot={currentStep.robot} target={currentStep.target} />
                    </div>

                    {/* Preset details strip */}
                    <div className="px-4 py-2.5 flex items-center gap-3 bg-background/10">
                        {(() => {
                            const Icon = PRESET_ICON_MAP[selectedPreset.id] ?? Zap;
                            return (
                                <div
                                    className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.08) 100%)",
                                        border:     "1px solid rgba(16,185,129,0.25)",
                                        color:      "#34d399",
                                    }}
                                >
                                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                </div>
                            );
                        })()}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground font-mono">{selectedPreset.title}</p>
                            <p
                                className="text-muted-foreground truncate"
                                style={{ fontSize: "10px", fontFamily: "'Inter', system-ui, sans-serif" }}
                            >
                                {selectedPreset.description}
                            </p>
                        </div>
                        <ComplexityBadge value={selectedPreset.complexity} />
                    </div>

                    {/* Execution Log */}
                    <div className="p-4 font-mono text-xs flex flex-col gap-2 flex-1">
                        <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-border/30">
                            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "11px", fontWeight: 500 }}>
                                Execution Log
                            </span>
                            <span className="tabular-nums text-muted-foreground/60 font-mono" style={{ fontSize: "10px" }}>
                                Step {currentStepIdx + 1} / {Math.max(1, steps.length)}
                            </span>
                        </div>

                        {/* Log message */}
                        <div className="min-h-[44px] flex items-start gap-2 py-1">
                            {currentStep.error ? (
                                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                            )}
                            <span className={cn("leading-relaxed break-words font-semibold",
                                currentStep.error ? "text-red-600 dark:text-red-300" : "text-emerald-600 dark:text-emerald-300",
                            )}>
                                {currentStep.log}
                            </span>
                        </div>

                        {/* Step navigator */}
                        {steps.length > 0 && (
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/30">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
                                    disabled={currentStepIdx === 0}
                                    className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs disabled:opacity-30 min-h-[44px] cursor-pointer hover:text-foreground transition-colors"
                                >
                                    ← Prev
                                </button>

                                {/* Progress dots */}
                                <div className="flex items-center gap-1">
                                    {dotsWindow.map((idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setCurrentStepIdx(idx)}
                                            className="cursor-pointer transition-all rounded-full"
                                            style={{
                                                height:          "6px",
                                                width:           idx === currentStepIdx ? "16px" : "6px",
                                                backgroundColor: idx === currentStepIdx ? "#34d399" : "rgba(148,163,184,0.25)",
                                            }}
                                            aria-label={`Go to step ${idx + 1}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    disabled={currentStepIdx >= steps.length - 1}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-30 min-h-[44px] cursor-pointer transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});
