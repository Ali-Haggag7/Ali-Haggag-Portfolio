"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { ProjectFeature } from "./projects.data";
import { ProjectModalDesktop } from "./ProjectModalDesktop";
import { ProjectModalMobile } from "./ProjectModalMobile";

// Sync check to prevent layout flash on mount
const getIsMobile = (): boolean =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

export const ProjectModal = ({
    feature,
    onClose,
}: {
    feature: ProjectFeature;
    onClose: () => void;
}) => {
    const [isMobile, setIsMobile] = useState(getIsMobile);

    // Sync state with viewport changes
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    // Handle body scroll lock
    useEffect(() => {
        document.documentElement.classList.add("modal-open");
        return () => document.documentElement.classList.remove("modal-open");
    }, []);

    // Accessibility: Close on Escape key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <AnimatePresence mode="wait">
            {isMobile ? (
                <ProjectModalMobile key="mobile" feature={feature} onClose={onClose} />
            ) : (
                <ProjectModalDesktop key="desktop" feature={feature} onClose={onClose} />
            )}
        </AnimatePresence>
    );
};