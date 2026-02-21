"use client";

import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import {
    Home,
    Terminal,
    Briefcase,
    User,
    Mail,
    Github,
    Linkedin,
    Layers,
} from "lucide-react";

// Masterclass Smooth Scroll Function
const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string, onAfterClick?: () => void) => {
    // Only intercept if it's an internal hash link
    if (href.startsWith("#")) {
        e.preventDefault();

        const targetId = href.replace("#", "");

        // If it's just "#" (Home), scroll to the very top
        if (targetId === "") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            // Find the section and scroll to it smoothly
            const elem = document.getElementById(targetId);
            if (elem) {
                elem.scrollIntoView({ behavior: "smooth" });
            }
        }
    }

    // Execute any additional actions (like closing mobile menu)
    if (onAfterClick) {
        onAfterClick();
    }
};

export const FloatingDock = ({
    desktopClassName,
    mobileClassName,
}: {
    desktopClassName?: string;
    mobileClassName?: string;
}) => {
    return (
        <>
            <FloatingDockDesktop className={desktopClassName} />
            <FloatingDockMobile className={mobileClassName} />
        </>
    );
};

const FloatingDockMobile = ({ className }: { className?: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={cn("relative block md:hidden z-50", className)}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        layoutId="nav"
                        className="absolute bottom-full mb-4 inset-x-0 flex flex-col gap-3 items-center"
                    >
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.9, transition: { delay: idx * 0.05 } }}
                                transition={{ delay: (items.length - 1 - idx) * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <Link
                                    href={item.href}
                                    key={item.title}
                                    // Smooth scroll + Auto close menu on mobile
                                    onClick={(e) => handleSmoothScroll(e, item.href, () => setOpen(false))}
                                    className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center transition-all active:scale-90"
                                    style={{
                                        boxShadow: `0 4px 20px -5px ${item.glowColor}40`
                                    }}
                                >
                                    <div className="h-5 w-5">{item.icon}</div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setOpen(!open)}
                className="h-14 w-14 rounded-full bg-foreground text-background shadow-2xl flex items-center justify-center transition-transform active:scale-90"
            >
                <motion.div
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex flex-col gap-1 items-center justify-center"
                >
                    {open ? (
                        <div className="h-6 w-6 text-xl leading-none flex items-center justify-center -translate-y-0.5">×</div>
                    ) : (
                        <>
                            <div className="h-0.5 w-5 bg-current rounded-full" />
                            <div className="h-0.5 w-5 bg-current rounded-full" />
                            <div className="h-0.5 w-5 bg-current rounded-full" />
                        </>
                    )}
                </motion.div>
            </button>
        </div>
    );
};

const FloatingDockDesktop = ({ className }: { className?: string }) => {
    let mouseX = useMotionValue(Infinity);
    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto hidden md:flex h-[72px] gap-4 items-end rounded-full bg-background/40 backdrop-blur-xl border border-border/50 px-6 pb-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]",
                className
            )}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.title} {...item} />
            ))}
        </motion.div>
    );
};

function IconContainer({
    mouseX,
    title,
    icon,
    href,
    glowColor
}: {
    mouseX: MotionValue;
    title: string;
    icon: React.ReactNode;
    href: string;
    glowColor: string;
}) {
    let ref = useRef<HTMLDivElement>(null);

    let distance = useTransform(mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    let widthTransform = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
    let heightTransform = useTransform(distance, [-150, 0, 150], [48, 80, 48]);

    let width = useSpring(widthTransform, { mass: 0.1, stiffness: 200, damping: 15 });
    let height = useSpring(heightTransform, { mass: 0.1, stiffness: 200, damping: 15 });

    let iconScale = useTransform(distance, [-150, 0, 150], [1, 1.4, 1]);

    const [hovered, setHovered] = useState(false);

    return (
        <Link
            href={href}
            onClick={(e) => handleSmoothScroll(e, href)}
        >
            <motion.div
                ref={ref}
                style={{
                    width,
                    height,
                    "--glow-bg": `${glowColor}15`,
                    "--glow-border": glowColor,
                    "--glow-shadow": `0 10px 20px -5px ${glowColor}50`
                } as any}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className={cn(
                    "aspect-square rounded-full flex items-center justify-center relative transition-[background-color,border-color,box-shadow] duration-300",
                    hovered
                        ? "bg-[var(--glow-bg)] border-[var(--glow-border)] shadow-[var(--glow-shadow)]"
                        : "bg-card/80 border-border shadow-sm"
                )}
            >
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 15, x: "-50%", scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                            exit={{ opacity: 0, y: 5, x: "-50%", scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="px-3 py-1.5 whitespace-pre rounded-lg bg-foreground text-background border-border border absolute left-1/2 -translate-x-1/2 -top-12 w-fit text-sm font-semibold shadow-xl z-50 flex items-center gap-2"
                        >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: glowColor }}></span>
                            {title}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    style={{ scale: iconScale }}
                    className="flex items-center justify-center text-muted-foreground transition-colors duration-300"
                >
                    {icon}
                </motion.div>
            </motion.div>
        </Link>
    );
}

const items = [
    { title: "Home", icon: <Home className="h-full w-full group-hover:text-foreground" />, href: "#", glowColor: "#888888" },
    { title: "Projects", icon: <Terminal className="h-full w-full group-hover:text-blue-500 text-blue-500/80" />, href: "#projects", glowColor: "#3B82F6" },
    { title: "Journey", icon: <Briefcase className="h-full w-full group-hover:text-green-500 text-green-500/80" />, href: "#timeline", glowColor: "#22C55E" },
    { title: "Services", icon: <Layers className="h-full w-full group-hover:text-yellow-500 text-yellow-500/80" />, href: "#about", glowColor: "#EAB308" },
    // Changed "Contact" href to point to "#contact" or whatever ID you gave to your footer/contact section
    { title: "Contact", icon: <Mail className="h-full w-full group-hover:text-red-500 text-red-500/80" />, href: "#contact", glowColor: "#EF4444" },
    { title: "GitHub", icon: <Github className="h-full w-full group-hover:text-foreground" />, href: "https://github.com/Ali-Haggag7", glowColor: "#888888" },
    { title: "LinkedIn", icon: <Linkedin className="h-full w-full group-hover:text-[#0A66C2] text-[#0A66C2]/80" />, href: "https://www.linkedin.com/in/ali-haggag7/", glowColor: "#0A66C2" },
];