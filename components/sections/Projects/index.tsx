"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { projectsData, ProjectFeature } from "./projects.data";
import { BentoCard } from "./BentoCard";
import { ProjectModal } from "./ProjectModal";

export default function ProjectsSection() {
    const [selectedProject, setSelectedProject] = useState<ProjectFeature | null>(null);

    // useCallback - stable references so memo on BentoCard works correctly
    const handleClose = useCallback(() => setSelectedProject(null), []);
    const handleSelect = useCallback((feature: ProjectFeature) => setSelectedProject(feature), []);

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
                        // Only first card gets priority loading - rest are lazy
                        priority={index === 0}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        feature={selectedProject}
                        onClose={handleClose}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}