"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { projectsData, ProjectFeature } from "./projects.data";
import { BentoCard } from "./BentoCard";
import { ProjectModal } from "./ProjectModal";

export default function ProjectsSection() {
    const [selectedProject, setSelectedProject] = useState<ProjectFeature | null>(null);

    const handleClose = useCallback(() => {
        setSelectedProject(null);
        if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, []);

    const handleSelect = useCallback((feature: ProjectFeature) => {
        setSelectedProject(feature);
        if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, []);

    return (
        <section
            aria-label="Projects Portfolio"
            id="projects"
            className="relative flex w-full max-w-5xl flex-col items-center justify-center mt-8 scroll-mt-24 mx-auto"
        >
            <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 relative p-4 md:p-8">
                {projectsData.map((feature, index) => (
                    <BentoCard
                        key={feature.id}
                        feature={feature}
                        onClick={() => handleSelect(feature)}
                        priority={index === 0}
                    />
                ))}
            </div>

            {/* mode="wait" ensures clean unmounting of the modal before a new one opens */}
            <AnimatePresence mode="wait">
                {selectedProject && (
                    <ProjectModal
                        key="project-modal"
                        feature={selectedProject}
                        onClose={handleClose}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}