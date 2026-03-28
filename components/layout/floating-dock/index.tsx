// FloatingDock — Top-level positional shell.
// memo: this never has local state; re-renders only if className props change.
import { memo } from "react";
import { FloatingDockDesktop } from "./DesktopDock";
import { FloatingDockMobile } from "./MobileDock";

interface FloatingDockProps {
    desktopClassName?: string;
    mobileClassName?: string;
}

export const FloatingDock = memo(function FloatingDock({
    desktopClassName,
    mobileClassName,
}: FloatingDockProps) {
    return (
        // Positioned shell has no motion — pure CSS layout, zero JS overhead.
        <div className="fixed z-50 bottom-4 right-4 md:bottom-8 md:left-1/2 md:right-auto md:-translate-x-1/2">
            <FloatingDockDesktop className={desktopClassName} />
            <FloatingDockMobile className={mobileClassName} />
        </div>
    );
});