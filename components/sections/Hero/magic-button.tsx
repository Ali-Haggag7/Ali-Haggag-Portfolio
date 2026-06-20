import { Download } from "lucide-react";
import { memo } from "react";
import { cn } from "@/lib/utils";

const MagicButton = memo(function MagicButton({ className }: { className?: string }) {
    return (
        <a
            href="/Ali_Haggag_CV.pdf"
            download="Ali_Haggag_FullStack_CV.pdf"
            aria-label="Download CV"
            className={cn(
                "group relative inline-flex h-12 md:h-14 min-h-[44px] items-center justify-center overflow-hidden rounded-full p-0.5 font-bold cursor-pointer",
                // Force GPU compositing for transforms to prevent main-thread blocking
                "transition-[transform,box-shadow] duration-200 will-change-transform transform-gpu",
                "hover:shadow-[0_0_20px_-5px_hsl(var(--accent-blue)/0.5)] hover:scale-105 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-blue))] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                className
            )}
        >
            {/* Spinning conic gradient:
                inset-[-1000%] combined with hardware acceleration ensures the spin happens 
                entirely on the compositor thread. Zero layout cost.
            */}
            <span
                aria-hidden="true"
                className={cn(
                    "absolute inset-[-1000%] animate-[spin_3s_linear_infinite]",
                    "bg-[conic-gradient(from_90deg_at_50%_50%,var(--tl-accent-blue)_0%,var(--tl-accent-purple)_50%,var(--tl-accent-blue)_100%)]",
                    "opacity-80 group-hover:opacity-100 transition-opacity duration-500 transform-gpu"
                )}
            />

            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-3 rounded-full px-8 py-2 text-sm md:text-base font-bold backdrop-blur-3xl bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors duration-200 group-hover:bg-[hsl(var(--background))/0.9]">
                <Download
                    className="w-5 h-5 text-[hsl(var(--accent-blue))] transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-110 transform-gpu"
                    aria-hidden="true"
                />
                Download CV
            </span>
        </a>
    );
});

export default MagicButton;