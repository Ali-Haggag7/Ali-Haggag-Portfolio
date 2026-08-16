"use client";

import { useEffect, useState, useCallback } from "react";
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
        const html = document.documentElement;
        const scrollbarWidth = window.innerWidth - html.clientWidth;
        if (scrollbarWidth > 0) {
            html.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
        }
        html.classList.add("modal-open");
        return () => {
            html.classList.remove("modal-open");
            html.style.removeProperty("--scrollbar-width");
        };
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

    return isMobile ? (
        <ProjectModalMobile key="mobile" feature={feature} onClose={onClose} />
    ) : (
        <ProjectModalDesktop key="desktop" feature={feature} onClose={onClose} />
    );
};