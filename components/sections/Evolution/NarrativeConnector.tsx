"use client";

import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";

const connectorVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut", delay: 0.1 },
    },
};

const VIEWPORT = { once: true, margin: "-30px" } as const;

interface NarrativeConnectorProps {
    text: string;
    isMobile: boolean;
}

export const NarrativeConnector = memo(function NarrativeConnector({
    text,
    isMobile,
}: NarrativeConnectorProps) {
    const content = (
        <div className="relative z-10 max-w-md mx-auto">
            {/* Top edge blend gradient: smoothly dissolves neon line entry */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 left-0 right-0 h-12 bg-gradient-to-b from-transparent via-card/75 to-card/95 rounded-t-xl z-10"
            />

            {/* Bottom edge blend gradient: smoothly dissolves neon line exit */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-b from-card/95 via-card/75 to-transparent rounded-b-xl z-10"
            />

            {/* Main card */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-4 rounded-xl bg-card/95 border border-border/60 backdrop-blur-md shadow-md">
                <ArrowDown
                    className="h-4 w-4 shrink-0 text-muted-foreground/60"
                    aria-hidden="true"
                />
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                    {text}
                </p>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className="my-4 ml-20 md:ml-0 relative z-10" aria-hidden="true">
                {content}
            </div>
        );
    }

    return (
        <motion.div
            variants={connectorVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="my-4 relative z-10"
            aria-hidden="true"
        >
            {content}
        </motion.div>
    );
});
