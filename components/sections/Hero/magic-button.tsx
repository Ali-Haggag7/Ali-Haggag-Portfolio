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
                "group relative inline-flex h-12 md:h-14 items-center justify-center overflow-hidden rounded-full p-0.5 font-bold",
                "transition-[transform,box-shadow] duration-200 will-change-transform",
                "hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                className
            )}
        >
            {/* Spinning conic gradient border — GPU composited, no layout cost */}
            <span
                aria-hidden="true"
                className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#8b5cf6_50%,#3b82f6_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />

            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-3 rounded-full px-8 py-2 text-sm md:text-base font-bold backdrop-blur-3xl bg-white text-black dark:bg-neutral-950 dark:text-white transition-colors duration-200 group-hover:bg-white/90 dark:group-hover:bg-neutral-900/90">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-500 transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-110" aria-hidden="true" />
                Download CV
            </span>
        </a>
    );
});

export default MagicButton;