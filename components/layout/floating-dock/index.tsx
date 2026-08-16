"use client";

// FloatingDock — Top-level positional shell.
import { memo, useState, useCallback, useEffect } from "react";
import { FloatingDockDesktop } from "./DesktopDock";
import { FloatingDockMobile } from "./MobileDock";
import { LiveCvModal } from "./LiveCvModal";

interface FloatingDockProps {
    desktopClassName?: string;
    mobileClassName?: string;
}

export const FloatingDock = memo(function FloatingDock({
    desktopClassName,
    mobileClassName,
}: FloatingDockProps) {
    const [isLiveCvOpen, setIsLiveCvOpen] = useState(false);
    // Render only the correct variant — avoids mounting Desktop spring physics on mobile.
    // Default null prevents SSR hydration mismatch; syncs after mount.
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    const handleOpenLiveCv = useCallback(() => setIsLiveCvOpen(true), []);
    const handleCloseLiveCv = useCallback(() => setIsLiveCvOpen(false), []);

    return (
        <>
            <div className="fixed z-50 bottom-4 right-4 md:bottom-8 md:left-1/2 md:right-auto md:-translate-x-1/2">
                {isMobile === true && (
                    <FloatingDockMobile className={mobileClassName} onOpenLiveCv={handleOpenLiveCv} />
                )}
                {isMobile === false && (
                    <FloatingDockDesktop className={desktopClassName} onOpenLiveCv={handleOpenLiveCv} />
                )}
            </div>
            <LiveCvModal isOpen={isLiveCvOpen} onClose={handleCloseLiveCv} />
        </>
    );
});