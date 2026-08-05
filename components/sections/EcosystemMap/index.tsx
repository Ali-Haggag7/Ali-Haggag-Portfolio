"use client";

import { EcosystemMap } from "./EcosystemMap";

export default function EcosystemMapSection() {
    return (
        <section id="ecosystem" className="relative w-full py-20 bg-transparent overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto">
                    <p className="section-eyebrow mb-3">Interconnected Stack Universe</p>
                    <h2 className="section-title text-4xl md:text-5xl mb-3">
                        Project &amp; Tech{" "}
                        <span className="accent-word-emerald">Ecosystem Map</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
                        Hover or select any project or technology node to visualize cross-project architecture links and shared infrastructure hubs.
                    </p>
                </div>

                <EcosystemMap />
            </div>
        </section>
    );
}
