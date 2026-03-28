// data.ts — Icon components stored as references, NOT as pre-rendered JSX nodes.
// Reason: Storing ReactNode in a config array defeats memoization — React can't
// tell two <Home /> instances apart across renders. Component refs are stable values.

import {
    Home, Terminal, Briefcase, Mail,
    Github, Linkedin, Layers, type LucideIcon,
} from "lucide-react";

export interface DockItem {
    title: string;
    Icon: LucideIcon;          // Component ref, not ReactNode
    iconClassName: string;     // Tailwind classes baked in per item
    href: string;
    glowColor: string;
}

// Defined OUTSIDE any component — allocated once, never re-allocated.
export const DOCK_ITEMS: DockItem[] = [
    { title: "Home", Icon: Home, iconClassName: "group-hover:text-foreground", href: "#", glowColor: "#888888" },
    { title: "Projects", Icon: Terminal, iconClassName: "group-hover:text-blue-500   text-blue-500/80", href: "#projects", glowColor: "#3B82F6" },
    { title: "Journey", Icon: Briefcase, iconClassName: "group-hover:text-green-500  text-green-500/80", href: "#timeline", glowColor: "#22C55E" },
    { title: "Services", Icon: Layers, iconClassName: "group-hover:text-yellow-500 text-yellow-500/80", href: "#services", glowColor: "#EAB308" },
    { title: "Contact", Icon: Mail, iconClassName: "group-hover:text-red-500    text-red-500/80", href: "#contact", glowColor: "#EF4444" },
    { title: "GitHub", Icon: Github, iconClassName: "group-hover:text-foreground", href: "https://github.com/Ali-Haggag7", glowColor: "#888888" },
    { title: "LinkedIn", Icon: Linkedin, iconClassName: "group-hover:text-[#0A66C2]  text-[#0A66C2]/80", href: "https://www.linkedin.com/in/ali-haggag7/", glowColor: "#0A66C2" },
];

// Kept as a standalone utility — no closure over component state,
// so it never needs to be wrapped in useCallback at the call site.
export function smoothScrollTo(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    onAfterClick?: () => void,
): void {
    if (href.startsWith("#")) {
        e.preventDefault();
        const id = href.slice(1);
        if (!id) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
    }
    onAfterClick?.();
}