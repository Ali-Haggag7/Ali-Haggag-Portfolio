"use client";

import { useRef, memo, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxAngle?: number;
  scale?: number;
}

export const TiltedCard = memo(function TiltedCard({
  children,
  className = "",
  maxAngle = 8,
  scale = 1.02,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxAngle, -maxAngle]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxAngle, maxAngle]);

  const cachedRectRef = useRef<DOMRect | null>(null);
  const lastRectTimeRef = useRef<number>(0);

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      cachedRectRef.current = ref.current.getBoundingClientRect();
      lastRectTimeRef.current = performance.now();
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;

      const now = performance.now();
      if (!cachedRectRef.current || now - lastRectTimeRef.current > 300) {
        cachedRectRef.current = ref.current.getBoundingClientRect();
        lastRectTimeRef.current = now;
      }

      const rect = cachedRectRef.current;
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    cachedRectRef.current = null;
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale }}
      transition={{ duration: 0.2 }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
});

export default TiltedCard;
