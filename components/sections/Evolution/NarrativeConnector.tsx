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
        <div className="relative flex items-center gap-3 max-w-md mx-auto px-5 py-4 rounded-xl bg-card/50 border border-border/40 backdrop-blur-sm">
            <ArrowDown
                className="h-4 w-4 shrink-0 text-muted-foreground/60"
                aria-hidden="true"
            />
            <p className="text-sm italic text-muted-foreground leading-relaxed">
                {text}
            </p>
        </div>
    );

    if (isMobile) {
        return (
            <div className="my-4 ml-20 md:ml-0" aria-hidden="true">
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
            className="my-4"
            aria-hidden="true"
        >
            {content}
        </motion.div>
    );
});
