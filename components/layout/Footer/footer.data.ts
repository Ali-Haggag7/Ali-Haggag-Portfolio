// footer.data.ts
import { Github, Linkedin, Mail } from "lucide-react";

export const footerLinks = [
    { name: "Home", href: "#" },
    { name: "Projects", href: "#projects" },
    { name: "My Journey", href: "#timeline" },
    { name: "Contact", href: "#contact" },
];

export const socialLinks = [
    {
        icon: Github,
        href: "https://github.com/Ali-Haggag7",
        label: "GitHub Profile",
        hoverClass:
            "hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:text-white dark:hover:text-black hover:border-transparent",
    },
    {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/ali-haggag7/",
        label: "LinkedIn Profile",
        hoverClass:
            "hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 hover:text-[#0A66C2]",
    },
    {
        icon: Mail,
        href: "mailto:ali.haggag2005@gmail.com",
        label: "Email Me",
        hoverClass:
            "hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-500",
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