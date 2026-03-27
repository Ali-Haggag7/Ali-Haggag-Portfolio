"use client";

import { useEffect, useState } from "react";
import { ProjectFeature } from "./projects.data";
import { ProjectModalDesktop } from "./ProjectModalDesktop";
import { ProjectModalMobile } from "./ProjectModalMobile";

export const ProjectModal = ({
    feature,
    onClose
}: {
    feature: ProjectFeature;
    onClose: () => void;
}) => {
    const [isMobile, setIsMobile] = useState(false);

    // Smart detection for mobile view
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        setIsMobile(mql.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    // Performance & UX Fix: Lock body scroll to prevent nested scrolling issues
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    // Render the appropriate component
    if (isMobile) {
        return <ProjectModalMobile feature={feature} onClose={onClose} />;
    }

    return <ProjectModalDesktop feature={feature} onClose={onClose} />;
};