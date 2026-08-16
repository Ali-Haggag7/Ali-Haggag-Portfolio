"use client";

import { useState, useCallback, useRef, memo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { projectsData, ProjectFeature } from "./projects.data";
import { BentoCard } from "./BentoCard";
import { ProjectModal } from "./ProjectModal";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { SplitFlapText } from "@/components/ui/SplitFlapText";

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
    const searchParams = useSearchParams();
    const [selectedProject, setSelectedProject] = useState<ProjectFeature | null>(null);

    // Deep linking for ?project=<id>
    useEffect(() => {
        const projId = searchParams.get("project");
        if (projId) {
            const target = projectsData.find((p) => p.id === projId);
            if (target) {
                setSelectedProject(target);
                setTimeout(() => {
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }, 300);
            }
        }
    }, [searchParams]);

    const handleClose = useCallback(() => setSelectedProject(null), []);

    const handleSelect = useCallback((feature: ProjectFeature) => {
        setSelectedProject(feature);
    }, []);

    const getHandler = useStableHandlers(handleSelect);

    return (
        <section
            aria-label="Projects Portfolio"
            id="projects"
            className="relative flex w-full max-w-5xl flex-col items-center justify-center mt-16 scroll-mt-24 mx-auto"
        >
            {/* ── Section Header ─────────────────────────────────── */}
            <div className="flex flex-col items-center text-center mb-8 px-4 w-full max-w-3xl mx-auto">
                <p className="section-eyebrow mb-3">
                    <DecryptedText text="Production Shipments" speed={30} sequential={true} animateOn="view" />
                </p>
                <h2 className="section-title text-4xl md:text-5xl mb-3 flex items-center justify-center gap-3 flex-wrap">
                    <span>Featured</span>
                    <SplitFlapText text="SYSTEMS" speed={35} charClassName="text-[hsl(var(--accent-blue))] text-2xl md:text-3xl" />
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                    High-throughput architectures, distributed engines, and mission-critical full-stack applications.
                </p>
            </div>

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