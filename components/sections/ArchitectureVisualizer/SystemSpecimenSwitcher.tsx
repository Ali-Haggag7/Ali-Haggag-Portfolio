"use client";

import { memo } from "react";
import { ARCHITECTURE_MAPS, type ArchitectureMap } from "./architectureData";
import { Server, Bot, MessageSquare, ShieldAlert, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemSpecimenSwitcherProps {
    activeMapId: ArchitectureMap["id"];
    onSelectMap: (mapId: ArchitectureMap["id"]) => void;
}

const SPECIMEN_ICONS: Record<ArchitectureMap["id"], typeof Server> = {
    "logic-arena": Server,
    scout: Bot,
    flurry: MessageSquare,
};

export const SystemSpecimenSwitcher = memo(function SystemSpecimenSwitcher({
    activeMapId,
    onSelectMap,
}: SystemSpecimenSwitcherProps) {
    return (
        <div
            className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-lg"
            role="tablist"
            aria-label="Architecture System Specimens"
        >
            <div className="flex items-center gap-2 px-3 py-1 text-xs font-mono text-muted-foreground shrink-0">
                <Cpu className="w-4 h-4 text-foreground/70" />
                <span className="font-semibold uppercase tracking-wider text-foreground">
                    SPECIMEN DECK:
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                {ARCHITECTURE_MAPS.map((specimen, idx) => {
                    const isActive = activeMapId === specimen.id;
                    const Icon = SPECIMEN_ICONS[specimen.id];
                    const scarCount = specimen.nodes.filter((n) => n.scarId).length;

                    return (
                        <button
                            key={specimen.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onSelectMap(specimen.id)}
                            className={cn(
                                "cursor-pointer group min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-3 focus-visible:ring-2 focus-visible:ring-ring outline-none",
                                isActive
                                    ? "bg-foreground text-background font-bold shadow-md border-foreground"
                                    : "bg-muted/20 border-border/60 hover:bg-muted/40 hover:border-border text-foreground/90"
                            )}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                    className={cn(
                                        "w-7 h-7 rounded-lg flex items-center justify-center p-1 shrink-0 transition-colors",
                                        isActive
                                            ? "bg-background text-foreground"
                                            : "bg-card border border-border/80 text-muted-foreground group-hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] font-mono tracking-wider uppercase opacity-75">
                                        0{idx + 1} — SPECIMEN
                                    </div>
                                    <div className="text-xs font-bold font-display truncate">
                                        {specimen.title}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                                <span
                                    className={cn(
                                        "px-1.5 py-0.5 rounded text-[9px] font-semibold border",
                                        isActive
                                            ? "bg-background/20 text-background border-background/30"
                                            : "bg-muted/60 text-muted-foreground border-border/60"
                                    )}
                                >
                                    {specimen.nodes.length} NODES
                                </span>
                                {scarCount > 0 && (
                                    <span
                                        className={cn(
                                            "flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-semibold",
                                            isActive
                                                ? "bg-red-500/20 text-red-200"
                                                : "bg-red-500/10 text-red-400"
                                        )}
                                        title={`${scarCount} engineering scars documented`}
                                    >
                                        <ShieldAlert className="w-2.5 h-2.5" />
                                        <span>{scarCount}</span>
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});
