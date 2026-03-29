"use client";

import dynamic from "next/dynamic";

const Particles = dynamic(() => import("@/components/ui/particles"), { ssr: false });
const FloatingDock = dynamic(() => import("@/components/layout/floating-dock").then(m => ({ default: m.FloatingDock })), { ssr: false });
const Chatbot = dynamic(() => import("@/components/layout/Chatbot"), { ssr: false });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: false });
const ModeToggle = dynamic(() => import("@/components/layout/mode-toggle").then(m => ({ default: m.ModeToggle })), { ssr: false });

export default function ClientShell() {
    return (
        <>
            <Particles />
            <ModeToggle />
            <FloatingDock />
            <Chatbot />
            <Footer />
        </>
    );
}