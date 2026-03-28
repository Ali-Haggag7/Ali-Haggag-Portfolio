// Globe.tsx
"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Globe({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // useRef instead of useState — width changes never trigger re-renders.
    const widthRef = useRef(0);
    const { resolvedTheme } = useTheme();

    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);

    // Stable mask style object — created once, never reassigned.
    const maskStyle = useRef({
        maskImage: "radial-gradient(circle at center, black 60%, transparent 100%)",
        WebkitMaskImage:
            "radial-gradient(circle at center, black 60%, transparent 100%)",
    }).current;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let phi = 0;
        let globe: ReturnType<typeof createGlobe> | null = null;

        const buildGlobe = () => {
            globe?.destroy();
            const w = widthRef.current;
            if (w === 0) return;

            const isLight = resolvedTheme === "light";

            globe = createGlobe(canvas, {
                devicePixelRatio: Math.min(window.devicePixelRatio, 2),
                width: w * 2,
                height: w * 2,
                phi: 0,
                theta: 0.2,
                dark: isLight ? 0 : 1,
                diffuse: 1.2,
                mapSamples: w < 600 ? 8000 : 12000,
                mapBrightness: isLight ? 2.5 : 6,
                baseColor: isLight ? [0.95, 0.95, 0.95] : [0.05, 0.05, 0.05],
                markerColor: isLight ? [0.1, 0.5, 0.9] : [0.1, 0.8, 1],
                glowColor: isLight ? [0.9, 0.9, 0.9] : [0.1, 0.2, 0.4],
                markers: [
                    { location: [26.1642, 32.7267], size: 0.12 },
                    { location: [30.0444, 31.2357], size: 0.09 },
                    { location: [51.5074, -0.1278], size: 0.04 },
                    { location: [25.2048, 55.2708], size: 0.05 },
                    { location: [40.7128, -74.006], size: 0.04 },
                ],
                onRender: (state) => {
                    if (pointerInteracting.current === null) phi += 0.003;
                    state.phi = phi + pointerInteractionMovement.current;
                },
            });

            // Fade in after first paint
            requestAnimationFrame(() => {
                canvas.style.opacity = "1";
            });
        };

        // ResizeObserver fires only when size actually changes — no debounce needed.
        const ro = new ResizeObserver(([entry]) => {
            const newWidth = entry.contentRect.width;
            if (newWidth === widthRef.current) return;
            widthRef.current = newWidth;
            buildGlobe();
        });

        ro.observe(canvas);

        return () => {
            ro.disconnect();
            globe?.destroy();
        };
    }, [resolvedTheme]);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
        pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current * 100;
        if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    }, []);

    const handlePointerUp = useCallback(() => {
        pointerInteracting.current = null;
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
        if (pointerInteracting.current === null) return;
        const delta = e.clientX - pointerInteracting.current;
        pointerInteractionMovement.current = delta * 0.01;
    }, []);

    return (
        <div className={cn("flex items-center justify-center z-10 w-full", className)}>
            <canvas
                ref={canvasRef}
                className="w-full h-auto aspect-square cursor-grab active:cursor-grabbing touch-none"
                style={{
                    ...maskStyle,
                    opacity: 0,
                    transition: "opacity 1s ease-in-out",
                }}
                onContextMenu={(e) => e.preventDefault()}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerOut={handlePointerUp}
                onPointerMove={handlePointerMove}
            />
        </div>
    );
}