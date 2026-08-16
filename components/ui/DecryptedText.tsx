"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover";
}

export function DecryptedText({
  text,
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~`|}{[]:;?><,./-=",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "view",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const availableChars = useOriginalCharsOnly
    ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
    : characters.split("");

  const shuffleText = useCallback(
    (originalText: string, currentRevealed: Set<number>) => {
      if (useOriginalCharsOnly) {
        const positions = originalText.split("").map((char, i) => ({
          char,
          isSpace: char === " ",
          index: i,
          isRevealed: currentRevealed.has(i),
        }));

        const nonSpaceChars = positions
          .filter((p) => !p.isSpace && !p.isRevealed)
          .map((p) => p.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }

        let charIndex = 0;
        return positions
          .map((p) => {
            if (p.isSpace) return " ";
            if (p.isRevealed) return originalText[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join("");
      } else {
        return originalText
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (currentRevealed.has(i)) return originalText[i];
            return availableChars[Math.floor(Math.random() * availableChars.length)];
          })
          .join("");
      }
    },
    [availableChars, useOriginalCharsOnly]
  );

  const triggerAnimation = useCallback(() => {
    let currentIteration = 0;
    const totalLength = text.length;
    setIsScrambling(true);

    const getNextIndex = (revealed: Set<number>) => {
      const unrevealed = Array.from({ length: totalLength }, (_, i) => i).filter(
        (i) => !revealed.has(i)
      );
      if (unrevealed.length === 0) return null;

      if (revealDirection === "start") return unrevealed[0];
      if (revealDirection === "end") return unrevealed[unrevealed.length - 1];
      if (revealDirection === "center") {
        const middle = totalLength / 2;
        return unrevealed.reduce((prev, curr) =>
          Math.abs(curr - middle) < Math.abs(prev - middle) ? curr : prev
        );
      }
      return unrevealed[Math.floor(Math.random() * unrevealed.length)];
    };

    const interval = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        if (sequential) {
          if (prevRevealed.size < totalLength) {
            const nextIndex = getNextIndex(prevRevealed);
            const newRevealed = new Set(prevRevealed);
            if (nextIndex !== null) newRevealed.add(nextIndex);
            setDisplayText(shuffleText(text, newRevealed));
            return newRevealed;
          } else {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
            return prevRevealed;
          }
        } else {
          setDisplayText(shuffleText(text, prevRevealed));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
          }
          return prevRevealed;
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, sequential, revealDirection, shuffleText]);

  useEffect(() => {
    if (animateOn === "view" && !hasAnimated) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            triggerAnimation();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }
  }, [animateOn, hasAnimated, triggerAnimation]);

  const handleHover = () => {
    if (animateOn === "hover" && !isScrambling) {
      setIsHovering(true);
      setRevealedIndices(new Set());
      triggerAnimation();
    }
  };

  return (
    <motion.span
      ref={containerRef}
      onMouseEnter={handleHover}
      className={`inline-block whitespace-pre-wrap font-mono ${parentClassName}`}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealed = revealedIndices.has(index) || !isScrambling;
          return (
            <span
              key={index}
              className={isRevealed ? className : `${encryptedClassName} text-[hsl(var(--accent-blue))] opacity-80`}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}

export default DecryptedText;
