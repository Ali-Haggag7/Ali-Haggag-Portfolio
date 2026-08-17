"use client";

import { useCallback, useRef, memo } from "react";
import { motion, useSpring } from "framer-motion";

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  maxDistance?: number;
  className?: string;
}

export const Magnet = memo(function Magnet({
  children,
  padding = 12,
  disabled = false,
  magnetStrength = 5,
  maxDistance = 8,
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);
  const lastRectTimeRef = useRef<number>(0);

  const springX = useSpring(0, { damping: 20, stiffness: 250, mass: 0.1 });
  const springY = useSpring(0, { damping: 20, stiffness: 250, mass: 0.1 });

  const handlePointerEnter = useCallback(() => {
    if (disabled || !ref.current) return;
    cachedRectRef.current = ref.current.getBoundingClientRect();
    lastRectTimeRef.current = performance.now();
  }, [disabled]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || !ref.current) return;

      const now = performance.now();
      if (!cachedRectRef.current || now - lastRectTimeRef.current > 300) {
        cachedRectRef.current = ref.current.getBoundingClientRect();
        lastRectTimeRef.current = now;
      }

      const rect = cachedRectRef.current;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rawOffsetX = (e.clientX - centerX) / magnetStrength;
      const rawOffsetY = (e.clientY - centerY) / magnetStrength;

      // Clamp translation strictly to prevent elements from drifting too far
      const clampedX = Math.max(-maxDistance, Math.min(maxDistance, rawOffsetX));
      const clampedY = Math.max(-maxDistance, Math.min(maxDistance, rawOffsetY));

      springX.set(clampedX);
      springY.set(clampedY);
    },
    [disabled, magnetStrength, maxDistance, springX, springY]
  );

  const handlePointerLeave = useCallback(() => {
    cachedRectRef.current = null;
    springX.set(0);
    springY.set(0);
  }, [springX, springY]);

  return (
    <motion.div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
});

export default Magnet;
