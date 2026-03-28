"use client";

import { useState, useCallback, useRef, memo } from "react";
import { AnimatePresence } from "framer-motion";
import { projectsData, ProjectFeature } from "./projects.data";
import { BentoCard } from "./BentoCard";
import { ProjectModal } from "./ProjectModal";

/**
 * Factory for stable click handlers to ensure BentoCard's memo works perfectly.
 * Stores function references in a Map to avoid recreation on parent re-renders.
 */
function useStableHandlers(onSelect: (f: ProjectFeature) => void) {
    const handlersRef = useRef<Map<string, () => void>>(new Map());

    return useCallback(
        (feature: ProjectFeature): (() => void) => {
            if (!handlersRef.current.has(feature.id)) {
                handlersRef.current.set(feature.id, () => onSelect(feature));
            }
            return handlersRef.current.get(feature.id)!;
        },
        [onSelect]
    );
}

export default function ProjectsSection() {
    const [selectedProject, setSelectedProject] = useState<ProjectFeature | null>(null);

    const handleClose = useCallback(() => setSelectedProject(null), []);

    const handleSelect = useCallback((feature: ProjectFeature) => {
        setSelectedProject(feature);
    }, []);

    const getHandler = useStableHandlers(handleSelect);

    return (
        <section
            aria-label="Projects Portfolio"
            id="projects"
            className="relative flex w-full max-w-5xl flex-col items-center justify-center mt-8 scroll-mt-24 mx-auto"
        >
            {/* Bento Grid Layout */}
            <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 relative p-4 md:p-8">
                {projectsData.map((feature, index) => (
                    <BentoCard
                        key={feature.id}
                        feature={feature}
                        onClick={getHandler(feature)}
                        priority={index === 0}
                    />
                ))}
            </div>

            {/* Modal Orchestration with Framer Motion lifecycle */}
            <AnimatePresence mode="wait">
                {selectedProject && (
                    <ProjectModal
                        key={selectedProject.id}
                        feature={selectedProject}
                        onClose={handleClose}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}