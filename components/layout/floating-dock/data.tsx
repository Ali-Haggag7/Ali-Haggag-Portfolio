import { Home, Terminal, Briefcase, Mail, Github, Linkedin, Layers } from "lucide-react";

export const dockItems = [
    { title: "Home", icon: <Home className="h-full w-full group-hover:text-foreground" />, href: "#", glowColor: "#888888" },
    { title: "Projects", icon: <Terminal className="h-full w-full group-hover:text-blue-500 text-blue-500/80" />, href: "#projects", glowColor: "#3B82F6" },
    { title: "Journey", icon: <Briefcase className="h-full w-full group-hover:text-green-500 text-green-500/80" />, href: "#timeline", glowColor: "#22C55E" },
    { title: "Services", icon: <Layers className="h-full w-full group-hover:text-yellow-500 text-yellow-500/80" />, href: "#services", glowColor: "#EAB308" },
    { title: "Contact", icon: <Mail className="h-full w-full group-hover:text-red-500 text-red-500/80" />, href: "#contact", glowColor: "#EF4444" },
    { title: "GitHub", icon: <Github className="h-full w-full group-hover:text-foreground" />, href: "https://github.com/Ali-Haggag7", glowColor: "#888888" },
    { title: "LinkedIn", icon: <Linkedin className="h-full w-full group-hover:text-[#0A66C2] text-[#0A66C2]/80" />, href: "https://www.linkedin.com/in/ali-haggag7/", glowColor: "#0A66C2" },
];

export const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string, onAfterClick?: () => void) => {
    if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.replace("#", "");
        if (targetId === "") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const elem = document.getElementById(targetId);
            if (elem) {
                elem.scrollIntoView({ behavior: "smooth" });
            }
        }
    }
    if (onAfterClick) {
        onAfterClick();
    }
};