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
    { title: "Home", Icon: Home, iconClassName: "group-hover:text-foreground", href: "#", glowColor: "hsl(var(--muted-foreground))" },
    { title: "Projects", Icon: Terminal, iconClassName: "group-hover:text-[hsl(var(--accent-blue))] text-[hsl(var(--accent-blue))]/80", href: "#projects", glowColor: "hsl(var(--accent-blue))" },
    { title: "Journey", Icon: Briefcase, iconClassName: "group-hover:text-[hsl(var(--accent-emerald))] text-[hsl(var(--accent-emerald))]/80", href: "#timeline", glowColor: "hsl(var(--accent-emerald))" },
    { title: "Services", Icon: Layers, iconClassName: "group-hover:text-[var(--tl-accent-yellow)] text-[var(--tl-accent-yellow)]/80", href: "#services", glowColor: "var(--tl-accent-yellow)" },
    { title: "Contact", Icon: Mail, iconClassName: "group-hover:text-[var(--scar-critical)] text-[var(--scar-critical)]/80", href: "#contact", glowColor: "var(--scar-critical)" },
    { title: "GitHub", Icon: Github, iconClassName: "group-hover:text-foreground", href: "https://github.com/Ali-Haggag7", glowColor: "hsl(var(--muted-foreground))" },
    { title: "LinkedIn", Icon: Linkedin, iconClassName: "group-hover:text-[var(--brand-linkedin)] text-[var(--brand-linkedin)]/80", href: "https://www.linkedin.com/in/ali-haggag7/", glowColor: "var(--brand-linkedin)" },
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