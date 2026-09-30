"use client";

import { useEffect, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { X, Swords, Terminal, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
    Skill,
    getStatusConfig,
    SCAR_TITLES,
    handleJumpToScar,
} from "./skills.data";
import { useRouter } from "next/navigation";

const isRaster = (src: string) => /\.(png|jpe?g|webp)$/i.test(src);

export const SkillInspector = memo(function SkillInspector({
    skill,
    onClose,
}: {
    skill: Skill | null;
    onClose: () => void;
}) {
    const router = useRouter();
    const drawerRef = useRef<HTMLDivElement>(null);

    // Escape key listener for keyboard accessibility
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (skill) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [skill, onClose]);

    if (!skill) return null;

    const statusConfig = getStatusConfig(skill.status);
    const StatusIcon = statusConfig.icon;
    const raster = isRaster(skill.icon);
    const scarTitle = skill.scarId ? SCAR_TITLES[skill.scarId] : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md cursor-pointer"
            role="dialog"
            aria-modal="true"
            aria-label={`${skill.name} Architecture Telemetry`}
            onClick={onClose}
        >
            <motion.div
                ref={drawerRef}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden text-left cursor-default"
            >
                {/* Background subtle radial gradient */}
                <div
                    className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
                    style={{ background: "radial-gradient(circle, hsl(var(--accent-blue)), transparent 70%)" }}
                    aria-hidden="true"
                />

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close Inspector"
                    className="absolute top-5 right-5 h-9 w-9 rounded-full flex items-center justify-center border border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6 pr-10">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-background/80 p-2.5 shadow-sm">
                        {skill.themeable ? (
                            <div
                                className="w-full h-full bg-foreground"
                                style={{
                                    maskImage: `url(${skill.icon})`,
                                    WebkitMaskImage: `url(${skill.icon})`,
                                    maskSize: "contain",
                                    maskRepeat: "no-repeat",
                                    maskPosition: "center",
                                }}
                            />
                        ) : raster ? (
                            <Image
                                src={skill.icon}
                                alt={skill.name}
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        ) : (
                            <img
                                src={skill.icon}
                                alt={skill.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                            />
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                                "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                                statusConfig.bg,
                                statusConfig.color,
                                statusConfig.border
                            )}>
                                {statusConfig.badge}
                            </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                            {skill.name}
                        </h3>
                    </div>
                </div>

                {/* Architecture Deployment & Stability Card */}
                <div className="grid grid-cols-2 gap-3 bg-muted/20 border border-border/40 rounded-xl p-3.5 sm:p-4 mb-5">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 mb-1">
                            Deployment Tier
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className={cn(
                                "h-2 w-2 rounded-full shrink-0",
                                skill.status === "Battle-Tested"
                                    ? "bg-[hsl(var(--accent-purple))]"
                                    : skill.status === "Production Ready"
                                    ? "bg-[hsl(var(--accent-emerald))]"
                                    : "bg-[hsl(var(--accent-blue))]"
                            )} />
                            <span className="text-xs font-display font-bold text-foreground">
                                {skill.status}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 mb-1">
                            Incident History
                        </span>
                        <div className="flex items-center gap-1.5">
                            {skill.scarId ? (
                                <span className="text-xs font-display font-bold text-[hsl(var(--destructive))]">
                                    Post-Mortem Logged
                                </span>
                            ) : (
                                <span className="text-xs font-display font-bold text-[hsl(var(--accent-emerald))]">
                                    Zero Active Incidents
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Production Deployments */}
                <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        <Terminal className="w-3.5 h-3.5 text-[hsl(var(--accent-blue))]" />
                        <span>Production Deployments & Shipments</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skill.projects.map((project) => (
                            <span
                                key={project}
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-background/80 border border-border/60 text-foreground"
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-emerald))]" />
                                {project}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Battle Scar Callout (If Applicable) */}
                {skill.scarId && (
                    <div className="bg-[hsl(var(--destructive)/0.08)] border border-[hsl(var(--destructive)/0.3)] rounded-xl p-4 mb-5">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[hsl(var(--destructive))]">
                                <Swords className="w-4 h-4" />
                                <span>INCIDENT POST-MORTEM DOCUMENTED</span>
                            </div>
                        </div>
                        {scarTitle && (
                            <p className="text-xs font-display font-semibold text-foreground mb-3">
                                &ldquo;{scarTitle}&rdquo;
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => handleJumpToScar(skill.scarId!, onClose, router)}
                            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[hsl(var(--destructive))] hover:underline min-h-[44px] cursor-pointer"
                        >
                            <span>Inspect Incident Post-Mortem</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Footer notes */}
                <div className="pt-4 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground/60">
                    <span>STATUS: ACTIVE RUNTIME</span>
                    <span>PRESS ESC TO CLOSE</span>
                </div>
            </motion.div>
        </div>
    );
});
