import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MagicButton({ className }: { className?: string }) {
    return (
        <a
            href="/Ali_Haggag_CV.pdf"
            download="Ali_Haggag_FullStack_CV.pdf"
            className={cn(
                "group relative inline-flex h-12 md:h-14 items-center justify-center overflow-hidden rounded-full p-[2px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background active:scale-95 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]",
                className
            )}
        >
            {/* Masterclass Animated Border Gradient matching your theme */}
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#8b5cf6_50%,#3b82f6_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Button Content - Explicitly fixed for Light/Dark Mode */}
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white text-black dark:bg-neutral-950 dark:text-white px-8 py-2 text-sm md:text-base font-bold backdrop-blur-3xl transition-all duration-300 group-hover:bg-white/90 dark:group-hover:bg-neutral-900/90 gap-3">
                {/* Icon color adjusted slightly for better contrast in both modes */}
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-500 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
                <span>Download CV</span>
            </span>
        </a>
    );
}