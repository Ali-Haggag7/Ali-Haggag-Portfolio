"use client";

import { useState, useEffect, useRef, memo } from "react";
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
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const springX = useSpring(0, { damping: 20, stiffness: 250, mass: 0.1 });
  const springY = useSpring(0, { damping: 20, stiffness: 250, mass: 0.1 });

  useEffect(() => {
    if (disabled) {
      springX.set(0);
      springY.set(0);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Check if mouse is directly over or immediately adjacent to button (within small padding)
      if (
        e.clientX >= left - padding &&
        e.clientX <= left + width + padding &&
        e.clientY >= top - padding &&
        e.clientY <= top + height + padding
      ) {
        setIsActive(true);
        const rawOffsetX = (e.clientX - centerX) / magnetStrength;
        const rawOffsetY = (e.clientY - centerY) / magnetStrength;

        // Clamp translation strictly to prevent adjacent buttons from overlapping
        const clampedX = Math.max(-maxDistance, Math.min(maxDistance, rawOffsetX));
        const clampedY = Math.max(-maxDistance, Math.min(maxDistance, rawOffsetY));

        springX.set(clampedX);
        springY.set(clampedY);
      } else {
        setIsActive(false);
        springX.set(0);
        springY.set(0);
      }
    };

    const handleMouseLeave = () => {
      setIsActive(false);
      springX.set(0);
      springY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [padding, disabled, magnetStrength, maxDistance, springX, springY]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
});

export default Magnet;
