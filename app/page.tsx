import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Marquee from "@/components/magicui/marquee";
import Timeline from "@/components/magicui/timeline";
import Services from "@/components/magicui/services";
import Globe from "@/components/magicui/globe";
import Reviews from "@/components/magicui/reviews";
import Footer from "@/components/magicui/footer";
import { FloatingDock } from "@/components/magicui/floating-dock";
import Particles from "@/components/magicui/particles";
import MagicButton from "@/components/magicui/magic-button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Code2,
  MessageSquare,
  BarChart3,
  Bot,
  LayoutTemplate,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import flurryImg from "@/public/flurry.png";
import blogImg from "@/public/blog-pro.jpeg";
import geminiImg from "@/public/gemini-clone-1.jpeg";
import portfolioImg from "@/public/portfolio-1.jpeg";
import realTimeChatImg from "@/public/chat-firebase-1.jpeg";
import Image from "next/image";

const skills = [
  "https://cdn.simpleicons.org/react/61DAFB",
  "https://cdn.simpleicons.org/nextdotjs/default",
  "https://cdn.simpleicons.org/nodedotjs/339933",
  "https://cdn.simpleicons.org/nestjs/E0234E",
  "https://cdn.simpleicons.org/bootstrap/7952B3",
  "https://cdn.simpleicons.org/webrtc/303030",
  "https://cdn.simpleicons.org/mongodb/47A248",
  "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  "https://cdn.simpleicons.org/typescript/3178C6",
  "https://cdn.simpleicons.org/socketdotio/default",
  "https://cdn.simpleicons.org/firebase/FFCA28",
  "https://cdn.simpleicons.org/google/4285F4",
];

const features = [
  {
    Icon: MessageSquare,
    name: "Flurry Super App",
    description: "Real-time Social Super App merging Socket.io, WebRTC, and AI features.",
    href: "https://github.com/Ali-Haggag7/Flurry-Super-App",
    cta: "View Source",
    demoHref: "https://flurry-app.vercel.app/",
    background: <Image src={flurryImg} alt="Flurry App" className="h-full w-full object-cover object-top" placeholder="blur" priority />,
    className: "col-span-1 md:col-span-2",
  },
  {
    Icon: LayoutTemplate,
    name: "Blog Pro Platform",
    description: "Secure MERN CMS with Role-Based Access Control and Enterprise Security.",
    href: "https://github.com/Ali-Haggag7/Blog-Pro-Platform",
    cta: "View Source",
    background: <Image src={blogImg} alt="Blog Pro Platform" className="h-full w-full object-cover object-top" placeholder="blur" priority />,
    className: "col-span-1",
  },
  {
    Icon: BarChart3,
    name: "Admin Pro Dashboard",
    description: "Robust CRM Backend API with MVC Architecture & JWT Authentication.",
    href: "https://github.com/Ali-Haggag7/Admin-Pro-Dashboard",
    cta: "View Source",
    background: <div className="h-full w-full bg-gradient-to-br from-blue-500/80 to-purple-600/80 backdrop-blur-sm"></div>,
    className: "col-span-1",
  },
  {
    Icon: MessageSquare,
    name: "Realtime Chat Engine",
    description: "Serverless Chat Architecture powered by Firebase, Vite, and Cloudinary.",
    href: "https://github.com/Ali-Haggag7/Realtime-Chat-Engine",
    cta: "View Source",
    demoHref: "https://realtime-chat-engine.vercel.app/",
    background: <Image src={realTimeChatImg} alt="Realtime Chat Engine" className="h-full w-full object-cover object-center" placeholder="blur" loading="eager" />,
    className: "col-span-1 md:col-span-2",
  },
  {
    Icon: Bot,
    name: "Gemini AI Clone",
    description: "Pixel-perfect Google Gemini Clone integrated with Generative AI SDK.",
    href: "https://github.com/Ali-Haggag7/Gemini-AI-Clone",
    cta: "View Source",
    demoHref: "https://gemini-clone-ali.vercel.app/",
    background: <Image src={geminiImg} alt="Gemini AI Clone" className="h-full w-full object-cover object-top" placeholder="blur" loading="eager" />,
    className: "col-span-1 md:col-span-2",
  },
  {
    Icon: Briefcase,
    name: "React Portfolio",
    description: "Modern Portfolio Template with Mailchimp integration and animations.",
    href: "https://github.com/Ali-Haggag7/React-Portfolio-Template",
    cta: "View Source",
    demoHref: "https://react-portfolio-template-ali.vercel.app/",
    background: <Image src={portfolioImg} alt="React Portfolio Template" className="h-full w-full object-cover object-center" placeholder="blur" loading="eager" />,
    className: "col-span-1",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden relative selection:bg-blue-500/30">

      {/* 1. Background Particles */}
      <Particles />

      {/* 2. Theme Toggle */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <ModeToggle />
      </div>

      {/* =========================================
          HERO SECTION - MASTERCLASS UI 
          ========================================= */}
      <div className="relative z-10 flex min-h-[85vh] w-full flex-col items-center justify-center pt-32 pb-12 text-center px-4">

        {/* Ambient background glow for the Hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10 dark:from-blue-600/20 dark:to-purple-600/20"></div>

        {/* Live Status Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-md px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-all hover:bg-muted/50 cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Available for new opportunities
        </div>

        {/* Masterpiece Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-foreground mb-6 leading-tight">
          Ali Haggag <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
            Full-Stack Dev
          </span>
        </h1>

        {/* Polished Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Architecting scalable MERN applications and crafting pixel-perfect, high-performance web experiences from UI to Database.
        </p>

        {/* Premium Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-5 mb-16 relative z-20">

          <a
            href="https://github.com/Ali-Haggag7"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.6)] active:scale-95"
          >
            <Code2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/ali-haggag7/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-8 py-4 border-2 border-border bg-card/50 backdrop-blur-sm text-foreground rounded-full font-bold transition-all duration-300 hover:bg-blue-500/5 hover:border-blue-500/50 hover:text-blue-500 active:scale-95 shadow-sm"
          >
            <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            LinkedIn
          </a>

          {/* Download CV (MagicButton Wrapper) */}
          <div className="active:scale-95 transition-transform duration-300 hover:scale-105">
            <MagicButton />
          </div>

        </div>
      </div>

      {/* =========================================
          SKILLS MARQUEE - MASTERCLASS UI 
          ========================================= */}
      <div className="relative flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden py-10 mb-20">

        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">
          Powered by Modern Technologies
        </p>

        <Marquee pauseOnHover className="[--duration:35s]">
          {skills.map((logo, index) => (
            <div
              key={index}
              // Masterclass Mobile Fix: tabIndex={0} to make it tappable
              tabIndex={0}
              // Masterclass Bug Fix: Named group "group/skill" isolates the hover effect from the Marquee's global group
              className="group/skill relative mx-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md transition-all duration-300 focus:outline-none hover:scale-110 focus:scale-110 hover:border-blue-500/50 focus:border-blue-500/50 hover:bg-card focus:bg-card hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] focus:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] dark:focus:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] cursor-pointer"
            >
              <img
                src={logo}
                alt="Tech Skill Logo"
                // Connected exactly to "group/skill" for both hover (desktop) and focus (mobile tap)
                className="h-12 w-12 opacity-50 transition-all duration-500 group-hover/skill:opacity-100 group-focus/skill:opacity-100 grayscale group-hover/skill:grayscale-0 group-focus/skill:grayscale-0 dark:invert dark:group-hover/skill:invert-0 dark:group-focus/skill:invert-0"
              />
            </div>
          ))}
        </Marquee>

        {/* Smooth Gradient Fades for the Marquee edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background via-background/80 to-transparent"></div>
      </div>

      {/* Projects Grid */}
      <div id="projects" className="relative flex w-full max-w-5xl flex-col items-center justify-center mt-8 scroll-mt-24">
        <BentoGrid className="lg:grid-rows-3 p-4 md:p-8">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>

      <Timeline />

      <Services />

      {/* <Reviews /> 
        TODO: Uncomment this section when I get my first freelance client reviews on Upwork.
      */}

      {/* Global Connection Section - Masterclass UI */}
      <section id="contact" className="py-32 w-full relative overflow-hidden flex items-center justify-center">
        {/* Ambient glowing background behind the text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">

          {/* Left Side: Typography & Call to Action */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* Live Availability Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 text-sm font-semibold tracking-wide">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              Available for Remote Opportunities
            </div>

            <h2 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tighter mb-6 leading-[1.1]">
              Working <br />
              {/* Beautiful Gradient Text */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600">
                Worldwide.
              </span>
            </h2>

            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-medium">
              Based in Egypt 🇪🇬. Architecting high-performance MERN applications, real-time systems, and AI-driven solutions for clients across the globe. Distance is just a detail.
            </p>

            {/* Premium Animated Contact Button */}
            <a
              href="mailto:ali.haggag2005@gmail.com"
              className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-foreground px-8 text-base font-bold text-background transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] active:scale-95"
            >
              <span>Let's Build Together</span>
              <div className="h-2 w-2 rounded-full bg-blue-500 transition-transform duration-300 group-hover:scale-150 group-hover:bg-cyan-400"></div>
            </a>
          </div>

          {/* Right Side: The Holographic Globe */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative mt-10 lg:mt-0">
            <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
              {/* Subtle back-light for the globe */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
              <Globe className="w-full h-full relative z-10" />
            </div>
          </div>

        </div>
      </section>

      <Footer />

      <div className="fixed z-50 bottom-4 right-4 md:bottom-8 md:left-1/2 md:right-auto md:-translate-x-1/2">
        <FloatingDock />
      </div>

    </main>
  );
}