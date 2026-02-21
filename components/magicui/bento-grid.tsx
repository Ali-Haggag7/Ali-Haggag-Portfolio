import { ReactNode } from "react";
// Import extra icons for the new logic
import { ArrowRightIcon, Github, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full grid-cols-1 md:grid-cols-3 gap-6",
                className
            )}
        >
            {children}
        </div>
    );
};

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
    demoHref,
    demoCta = "Live Demo",
}: {
    name: string;
    className: string;
    background: ReactNode;
    Icon: any;
    description: string;
    href?: string;
    cta?: string;
    demoHref?: string;
    demoCta?: string;
}) => {
    return (
        <div
            key={name}
            // Masterclass Mobile Fix: tabIndex={0} makes the div tappable/focusable on mobile!
            tabIndex={0}
            className={cn(
                "group relative flex flex-col justify-end overflow-hidden rounded-2xl min-h-[22rem]",
                "border border-black/10 dark:border-white/10 shadow-sm transition-all duration-300",
                // Remove the default browser outline when tapped, but add a soft custom ring
                "focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                // Add hover/focus scale effect
                "hover:shadow-lg focus:shadow-lg focus:-translate-y-1 hover:-translate-y-1",
                className
            )}
        >
            <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-black">
                {/* Notice we added group-focus:scale-110 here as well */}
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-110 group-focus:scale-110 opacity-90">
                    {background}
                </div>
            </div>

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />

            <div className="relative z-20 flex flex-col gap-2 p-6 mt-auto transition-transform duration-300">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                    <Icon className="h-5 w-5 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white">
                    {name}
                </h3>

                <p className="text-sm text-white/70 font-medium max-w-lg leading-relaxed">
                    {description}
                </p>

                {/* Masterclass Mobile Reveal Logic */}
                {/* Changed to trigger on group-hover AND group-focus (when tapped on mobile) */}
                <div className="flex items-center gap-4 overflow-hidden h-0 opacity-0 transition-all duration-300 ease-in-out group-hover:h-6 group-hover:opacity-100 group-hover:mt-3 group-focus:h-6 group-focus:opacity-100 group-focus:mt-3">

                    {demoHref && (
                        <Link href={demoHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                            <ExternalLink className="h-4 w-4" />
                            {demoCta}
                        </Link>
                    )}

                    {demoHref && href && <div className="h-4 w-[1px] bg-white/20"></div>}

                    {href && (
                        <Link href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-bold text-white/60 hover:text-white transition-colors">
                            <Github className="h-4 w-4" />
                            {cta || "Source"}
                        </Link>
                    )}

                </div>
            </div>
        </div>
    );
};

export { BentoGrid, BentoCard };