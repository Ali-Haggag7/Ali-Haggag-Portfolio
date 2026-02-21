"use client";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function Globe({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [width, setWidth] = useState(0);

    // 1. Theme Detection to fix the Light Mode "Black Hole" issue
    const { resolvedTheme } = useTheme();

    // 2. Interaction state refs for Drag & Drop functionality
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const onResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (canvasRef.current) {
                    setWidth(canvasRef.current.offsetWidth);
                }
            }, 100);
        };

        window.addEventListener("resize", onResize);
        onResize();

        return () => {
            window.removeEventListener("resize", onResize);
            clearTimeout(timeoutId);
        }
    }, []);

    useEffect(() => {
        if (width === 0 || !canvasRef.current) return;

        let phi = 0;
        const isLight = resolvedTheme === "light";

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.2, // Tilted slightly

            // Masterclass Light/Dark Mode Color Swapping
            dark: isLight ? 0 : 1,
            diffuse: 1.2,
            mapSamples: 25000,
            mapBrightness: isLight ? 2.5 : 6,
            baseColor: isLight ? [0.95, 0.95, 0.95] : [0.05, 0.05, 0.05],
            markerColor: isLight ? [0.1, 0.5, 0.9] : [0.1, 0.8, 1],
            glowColor: isLight ? [0.9, 0.9, 0.9] : [0.1, 0.2, 0.4],

            markers: [
                { location: [26.1642, 32.7267], size: 0.12 },

                { location: [30.0444, 31.2357], size: 0.09 },

                { location: [51.5074, -0.1278], size: 0.04 }, // London (Remote Target)
                { location: [25.2048, 55.2708], size: 0.05 }, // Dubai (Remote Target)
                { location: [40.7128, -74.0060], size: 0.04 }, // NY (Remote Target)
            ],
            onRender: (state) => {
                // Auto-rotate ONLY if the user is not holding/dragging
                if (pointerInteracting.current === null) {
                    phi += 0.003;
                }
                // Apply the combined rotation (auto + manual drag)
                state.phi = phi + pointerInteractionMovement.current;
            },
        });

        return () => {
            globe.destroy();
        };
    }, [width, resolvedTheme]); // Re-initialize globe seamlessly if theme or width changes

    return (
        <div className={cn("flex items-center justify-center z-10 w-full", className)}>
            <canvas
                ref={canvasRef}
                // touch-none is crucial here so mobile users don't scroll the page while rotating the globe
                className="w-full h-auto aspect-square opacity-0 transition-opacity duration-1000 ease-in-out cursor-grab active:cursor-grabbing touch-none"
                onContextMenu={(e) => e.preventDefault()}

                // === Masterclass Drag Interaction Handlers ===
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current * 100;
                    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
                }}
                onPointerMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta * 0.01;
                    }
                }}

                style={{
                    opacity: 1,
                    maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
                }}
            />
        </div>
    );
}