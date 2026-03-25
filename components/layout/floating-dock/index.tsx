import { FloatingDockDesktop } from "./DesktopDock";
import { FloatingDockMobile } from "./MobileDock";

export const FloatingDock = ({
    desktopClassName,
    mobileClassName,
}: {
    desktopClassName?: string;
    mobileClassName?: string;
}) => {
    return (
        <div className="fixed z-50 bottom-4 right-4 md:bottom-8 md:left-1/2 md:right-auto md:-translate-x-1/2 transform-gpu">
            <FloatingDockDesktop className={desktopClassName} />
            <FloatingDockMobile className={mobileClassName} />
        </div>
    );
};