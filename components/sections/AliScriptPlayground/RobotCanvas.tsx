"use client";

import { useEffect, useRef, memo, useState } from "react";
import { useTheme } from "next-themes";
import { Activity, Zap } from "lucide-react";
import type { RobotState, TargetState } from "./interpreter";

interface RobotCanvasProps {
    robot: RobotState;
    target: TargetState;
}

// ── Stat Bar component ────────────────────────────────────────────────────────
interface StatBarProps {
    value: number;
    max: number;
    color: string;
    glowColor: string;
}

function StatBar({ value, max, color, glowColor }: StatBarProps) {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return (
        <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800/90 border border-slate-300/70 dark:border-slate-700/80 overflow-hidden shadow-inner">
            <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                    width:           `${pct}%`,
                    backgroundColor: color,
                    boxShadow:       pct > 0 ? `0 0 8px ${glowColor}` : "none",
                }}
            />
        </div>
    );
}

// ── Entity stats panel ────────────────────────────────────────────────────────
interface EntityPanelProps {
    label: string;
    position: string;
    hp: number;
    energy?: number;
    dotColor: string;
    icon: React.ReactNode;
}

function EntityPanel({ label, position, hp, energy, dotColor, icon }: EntityPanelProps) {
    const hpColor     = hp > 50 ? "#10b981" : hp > 25 ? "#f59e0b" : "#ef4444";
    const hpGlow      = hp > 50 ? "rgba(16,185,129,0.5)" : hp > 25 ? "rgba(245,158,11,0.5)" : "rgba(239,68,68,0.5)";
    const energyColor = "#3b82f6";
    const energyGlow  = "rgba(59,130,246,0.5)";

    return (
        <div className="flex-1 rounded-xl p-3 space-y-2 bg-card border border-border/80 shadow-sm">
            {/* Header row */}
            <div className="flex items-center justify-between gap-1 pb-1 border-b border-border/40">
                <div className="flex items-center gap-1.5">
                    <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
                    />
                    <span className="text-[11px] font-mono font-bold text-foreground">{label}</span>
                </div>
                <span
                    className="text-[10px] text-muted-foreground font-mono font-medium"
                    style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
                >
                    {position}
                </span>
            </div>

            {/* HP bar */}
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {icon}
                        <span
                            className="text-[10px] font-semibold text-foreground"
                            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                        >
                            HP
                        </span>
                    </div>
                    <span
                        className="text-[10px] font-bold font-mono tabular-nums"
                        style={{ color: hpColor }}
                    >
                        {hp} / 100
                    </span>
                </div>
                <StatBar
                    value={hp}
                    max={100}
                    color={hpColor}
                    glowColor={hpGlow}
                />
            </div>

            {/* Energy bar (only for robot) */}
            {energy !== undefined && (
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 shrink-0 text-blue-500" aria-hidden="true" />
                            <span
                                className="text-[10px] font-semibold text-foreground"
                                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                            >
                                Energy
                            </span>
                        </div>
                        <span
                            className="text-[10px] font-bold font-mono tabular-nums text-blue-500"
                        >
                            {energy} / 100
                        </span>
                    </div>
                    <StatBar
                        value={energy}
                        max={100}
                        color={energyColor}
                        glowColor={energyGlow}
                    />
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Renderer
// ─────────────────────────────────────────────────────────────────────────────

export const RobotCanvas = memo(function RobotCanvas({ robot, target }: RobotCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();
    const [themeTick, setThemeTick] = useState(0);

    // Real-time MutationObserver to catch every single <html> class toggle (light <-> dark)
    useEffect(() => {
        if (typeof document === "undefined") return;

        const observer = new MutationObserver(() => {
            setThemeTick((t) => t + 1);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width    = canvas.width;
        const height   = canvas.height;
        const cellSize = width / 8;

        const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

        // ── Background ────────────────────────────────────────────────────────
        ctx.fillStyle = isDark ? "#070b14" : "#f8fafc";
        ctx.fillRect(0, 0, width, height);

        // ── Grid lines ────────────────────────────────────────────────────────
        ctx.strokeStyle = isDark ? "rgba(59, 130, 246, 0.12)" : "rgba(37, 99, 235, 0.22)";
        ctx.lineWidth   = 1;
        for (let i = 0; i <= 8; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(width, i * cellSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, height);
            ctx.stroke();
        }

        // ── Target (Enemy) ────────────────────────────────────────────────────
        if (target.hp > 0) {
            const tx = target.x * cellSize + cellSize / 2;
            const ty = target.y * cellSize + cellSize / 2;
            const tr = cellSize * 0.35;

            // Outer glow
            const targetGlow = ctx.createRadialGradient(tx, ty, 2, tx, ty, tr * 1.8);
            targetGlow.addColorStop(0, isDark ? "rgba(239, 68, 68, 0.45)" : "rgba(239, 68, 68, 0.25)");
            targetGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
            ctx.fillStyle = targetGlow;
            ctx.beginPath();
            ctx.arc(tx, ty, tr * 1.8, 0, Math.PI * 2);
            ctx.fill();

            // HP ring — shows remaining health as arc
            const hpFraction = target.hp / 100;
            const arcColor   = target.hp > 50 ? "#34d399" : target.hp > 25 ? "#fbbf24" : "#ef4444";
            ctx.strokeStyle  = arcColor;
            ctx.lineWidth    = 2;
            ctx.globalAlpha  = 0.6;
            ctx.beginPath();
            ctx.arc(tx, ty, tr * 0.95, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hpFraction);
            ctx.stroke();
            ctx.globalAlpha = 1;

            // Core dot
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(tx, ty, tr * 0.5, 0, Math.PI * 2);
            ctx.fill();

            // Crosshair
            ctx.strokeStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.7)";
            ctx.lineWidth   = 1.5;
            ctx.beginPath();
            ctx.moveTo(tx - tr * 0.8, ty);
            ctx.lineTo(tx + tr * 0.8, ty);
            ctx.moveTo(tx, ty - tr * 0.8);
            ctx.lineTo(tx, ty + tr * 0.8);
            ctx.stroke();
        }

        // ── Robot ─────────────────────────────────────────────────────────────
        const rx = robot.x * cellSize + cellSize / 2;
        const ry = robot.y * cellSize + cellSize / 2;
        const rr = cellSize * 0.32;

        ctx.save();
        ctx.translate(rx, ry);

        const angles     = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]; // N E S W
        const faceAngle  = angles[robot.dir];

        // FOV Cone
        const coneGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, cellSize * 3);
        coneGrad.addColorStop(0, "rgba(16, 185, 129, 0.28)");
        coneGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, cellSize * 3, faceAngle - Math.PI / 6, faceAngle + Math.PI / 6);
        ctx.closePath();
        ctx.fill();

        // Robot body glow
        const robotGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, rr * 1.8);
        robotGlow.addColorStop(0, "rgba(16, 185, 129, 0.5)");
        robotGlow.addColorStop(1, "rgba(16, 185, 129, 0)");
        ctx.fillStyle = robotGlow;
        ctx.beginPath();
        ctx.arc(0, 0, rr * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // HP arc ring on robot
        const robotHpFraction = robot.hp / 100;
        const robotHpColor    = robot.hp > 50 ? "#34d399" : robot.hp > 25 ? "#fbbf24" : "#ef4444";
        ctx.strokeStyle = robotHpColor;
        ctx.lineWidth   = 2;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(0, 0, rr * 1.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * robotHpFraction);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Energy arc (outer ring, dotted style — fill only partial)
        const energyFraction = robot.energy / 100;
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth   = 1.5;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(0, 0, rr * 1.35, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * energyFraction);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Triangle chassis
        ctx.rotate(faceAngle);
        ctx.fillStyle   = "#10b981";
        ctx.strokeStyle = "#6ee7b7";
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.moveTo(rr, 0);
        ctx.lineTo(-rr * 0.7, -rr * 0.7);
        ctx.lineTo(-rr * 0.4, 0);
        ctx.lineTo(-rr * 0.7, rr * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        // ── Laser beam ────────────────────────────────────────────────────────
        if (robot.laserFired) {
            const targetX = (robot.laserTarget?.x ?? robot.x) * cellSize + cellSize / 2;
            const targetY = (robot.laserTarget?.y ?? robot.y) * cellSize + cellSize / 2;

            ctx.strokeStyle = "#38bdf8";
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur  = 14;
            ctx.lineWidth   = 3;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }, [robot, target, resolvedTheme, themeTick]);

    const dirNames = ["N", "E", "S", "W"];

    return (
        <div className="relative flex flex-col rounded-xl border border-border/80 overflow-hidden bg-card shadow-sm">
            {/* Canvas Arena Header */}
            <div className="w-full bg-slate-100/90 dark:bg-[#070b14] flex items-center justify-center p-3 border-b border-border/40 shadow-inner transition-colors">
                <canvas
                    ref={canvasRef}
                    width={340}
                    height={340}
                    className="w-full max-w-[340px] aspect-square rounded-lg"
                />
            </div>

            {/* Entity stats below canvas */}
            <div className="flex gap-2.5 p-3">
                {/* Robot */}
                <EntityPanel
                    label="Robot"
                    position={`(${robot.x}, ${robot.y}) · ${dirNames[robot.dir]}`}
                    hp={robot.hp}
                    energy={robot.energy}
                    dotColor="#10b981"
                    icon={<Activity className="h-3 w-3 shrink-0 text-emerald-500" aria-hidden="true" />}
                />
                {/* Target */}
                <EntityPanel
                    label="Target"
                    position={`(${target.x}, ${target.y})`}
                    hp={target.hp}
                    dotColor="#ef4444"
                    icon={<Activity className="h-3 w-3 shrink-0 text-red-500" aria-hidden="true" />}
                />
            </div>
        </div>
    );
});
