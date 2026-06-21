// footer.data.ts
import { Github, Linkedin, Mail } from "lucide-react";

export const footerLinks = [
    { name: "Home", href: "#" },
    { name: "Projects", href: "#projects" },
    { name: "My Journey", href: "#timeline" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
];

export const socialLinks = [
    {
        icon: Github,
        href: "https://github.com/Ali-Haggag7",
        label: "GitHub Profile",
        hoverClass:
            "hover:bg-foreground/10 hover:border-foreground/20 hover:text-foreground",
    },
    {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/ali-haggag7/",
        label: "LinkedIn Profile",
        hoverClass:
            "hover:bg-[hsl(var(--accent-blue))]/10 hover:border-[hsl(var(--accent-blue))]/30 hover:text-[hsl(var(--accent-blue))]",
    },
    {
        icon: Mail,
        href: "mailto:ali.haggag2005@gmail.com",
        label: "Email Me",
        hoverClass:
            "hover:bg-[hsl(var(--accent-emerald))]/10 hover:border-[hsl(var(--accent-emerald))]/30 hover:text-[hsl(var(--accent-emerald))]",
    },
];

// Computed once at module load — never recalculated on re-renders.
export const currentYear = new Date().getFullYear();

export const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
) => {
    e.preventDefault();
    if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
};