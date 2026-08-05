"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import createGlobe from "cobe";
import { DEPLOYMENT_NODES, type DeploymentNode } from "./deploymentsData";
import { Globe, Server, CheckCircle2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const DeploymentGlobe = memo(function DeploymentGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);

    const [selectedNodeId, setSelectedNodeId] = useState<string>("do-frankfurt");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    const selectedNode = DEPLOYMENT_NODES.find((n) => n.id === selectedNodeId) || DEPLOYMENT_NODES[0];

    useEffect(() => {
        if (isMobile) return;
        let phi = 0;
        let width = 0;
        const currentCanvas = canvasRef.current;
        if (!currentCanvas) return;

        const onResize = () => {
            if (currentCanvas) {
                width = currentCanvas.offsetWidth;
            }
        };
        window.addEventListener("resize", onResize);
        onResize();

        const globe = createGlobe(currentCanvas, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.25,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 12000,
            mapBrightness: 6,
            baseColor: [0.1, 0.15, 0.25],
            markerColor: [0.1, 0.8, 0.5],
            glowColor: [0.2, 0.4, 0.8],
            markers: DEPLOYMENT_NODES.map((n) => ({
                location: [n.lat, n.lng],
                size: 0.08,
            })),
            onRender: (state) => {
                if (!pointerInteracting.current) {
                    phi += 0.005;
                }
                state.phi = phi + pointerInteractionMovement.current;
            },
        });

        setTimeout(() => {
            if (currentCanvas) currentCanvas.style.opacity = "1";
        }, 100);

        return () => {
            globe.destroy();
            window.removeEventListener("resize", onResize);
        };
    }, [isMobile]);

    return (
        <div className="w-full max-w-4xl mx-auto my-12 p-6 rounded-2xl border border-border bg-card shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                        <Globe className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-mono text-foreground flex items-center gap-2">
                            Global Production Deployment Map
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono">
                            Multi-region distributed infrastructure &amp; edge nodes
                        </p>
                    </div>
                </div>

                {/* Provider Selector Tabs */}
                <div className="flex flex-wrap gap-1.5">
                    {DEPLOYMENT_NODES.map((node) => (
                        <button
                            key={node.id}
                            type="button"
                            onClick={() => setSelectedNodeId(node.id)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer min-h-[44px]",
                                selectedNodeId === node.id
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                                    : "bg-background border border-border text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {node.provider}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Body: Interactive Globe + Node Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Globe Canvas or Mobile Static fallback */}
                <div className="md:col-span-6 flex justify-center relative aspect-square max-w-[340px] mx-auto w-full">
                    {isMobile ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-border/60 bg-muted/20 w-full">
                            <MapPin className="h-10 w-10 text-blue-400 mb-2" aria-hidden="true" />
                            <span className="text-xs font-mono font-bold text-foreground">
                                Active Region: {selectedNode.location}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono mt-1">
                                {selectedNode.provider} Edge Network
                            </span>
                        </div>
                    ) : (
                        <canvas
                            ref={canvasRef}
                            onPointerDown={(e) => {
                                pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                            }}
                            onPointerUp={() => {
                                pointerInteracting.current = null;
                            }}
                            onPointerOut={() => {
                                pointerInteracting.current = null;
                            }}
                            onMouseMove={(e) => {
                                if (pointerInteracting.current !== null) {
                                    const delta = e.clientX - pointerInteracting.current;
                                    pointerInteractionMovement.current = delta * 0.005;
                                }
                            }}
                            onTouchMove={(e) => {
                                if (pointerInteracting.current !== null && e.touches[0]) {
                                    const delta = e.touches[0].clientX - pointerInteracting.current;
                                    pointerInteractionMovement.current = delta * 0.005;
                                }
                            }}
                            className="w-full h-full opacity-0 transition-opacity duration-500 cursor-grab active:cursor-grabbing"
                        />
                    )}
                </div>

                {/* Selected Node Details Card */}
                <div className="md:col-span-6 space-y-4 font-mono text-xs">
                    <div className="rounded-xl border border-border/80 bg-[var(--scar-code-bg)] p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-border/30 pb-2">
                            <span className="text-blue-400 font-bold text-sm">
                                {selectedNode.provider} — {selectedNode.location}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                {selectedNode.status}
                            </span>
                        </div>

                        <div>
                            <span className="text-muted-foreground block mb-1">Coordinates:</span>
                            <span className="text-slate-300">
                                Lat {selectedNode.lat}° · Lng {selectedNode.lng}°
                            </span>
                        </div>

                        <div>
                            <span className="text-muted-foreground block mb-1.5">Deployed Systems:</span>
                            <ul className="space-y-1 text-slate-200">
                                {selectedNode.projects.map((proj) => (
                                    <li key={proj} className="flex items-center gap-2">
                                        <Server className="h-3.5 w-3.5 text-blue-400 shrink-0" aria-hidden="true" />
                                        <span>{proj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
