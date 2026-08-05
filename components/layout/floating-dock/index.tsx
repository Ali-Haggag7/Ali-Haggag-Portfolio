"use client";

// FloatingDock — Top-level positional shell.
import { memo, useState, useCallback } from "react";
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

    const handleOpenLiveCv = useCallback(() => setIsLiveCvOpen(true), []);
    const handleCloseLiveCv = useCallback(() => setIsLiveCvOpen(false), []);

    return (
        <>
            <div className="fixed z-50 bottom-4 right-4 md:bottom-8 md:left-1/2 md:right-auto md:-translate-x-1/2">
                <FloatingDockDesktop className={desktopClassName} onOpenLiveCv={handleOpenLiveCv} />
                <FloatingDockMobile className={mobileClassName} onOpenLiveCv={handleOpenLiveCv} />
            </div>
            <LiveCvModal isOpen={isLiveCvOpen} onClose={handleCloseLiveCv} />
        </>
    );
});