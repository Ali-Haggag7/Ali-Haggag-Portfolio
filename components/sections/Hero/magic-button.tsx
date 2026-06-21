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
                "transition-all duration-300 ease-out",
                "hover:shadow-[0_0_20px_hsl(var(--accent-purple)/0.4)] hover:scale-105 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-purple))] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
                    "bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--accent-blue))_0%,hsl(var(--accent-purple))_50%,hsl(var(--accent-blue))_100%)]",
                    "opacity-80 group-hover:opacity-100 transition-opacity duration-500 transform-gpu"
                )}
            />

            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-3 rounded-full px-8 py-2 text-sm md:text-base font-bold backdrop-blur-3xl bg-background text-foreground transition-all duration-200 group-hover:bg-background/80">
                <Download
                    className="w-5 h-5 text-[hsl(var(--accent-purple))] transition-transform duration-200 group-hover:translate-y-0.5 group-hover:scale-110 transform-gpu"
                    aria-hidden="true"
                />
                Download CV
            </span>
        </a>
    );
});

export default MagicButton;