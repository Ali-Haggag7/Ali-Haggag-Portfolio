"use client";

import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { useState } from "react";
import { X, Quote } from "lucide-react";

const reviews = [
    {
        name: "Jack",
        username: "@jack",
        body: "I've never seen anything like this. Ali's code is clean, scalable, and the architecture is just mind-blowing. Highly recommended for any complex project.",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "Jill",
        username: "@jill",
        body: "He delivered the MVP in record time. The backend architecture is solid, and the communication was seamless throughout the whole process.",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "John",
        username: "@john",
        body: "Flurry Super App is mind-blowing. The real-time features are seamless. I didn't expect WebRTC to work this smoothly on mobile networks!",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Jane",
        username: "@jane",
        body: "Professional, communicative, and technically gifted. Ali solved a database bottleneck we were struggling with for months in just two days.",
        img: "https://avatar.vercel.sh/jane",
    },
    {
        name: "Jenny",
        username: "@jenny",
        body: "The Gemini AI integration was perfect. Ali knows his stuff! He fine-tuned the prompts and the response time is incredibly fast.",
        img: "https://avatar.vercel.sh/jenny",
    },
    {
        name: "James",
        username: "@james",
        body: "Best full-stack developer I've worked with on Upwork. The code quality is top-notch and the documentation is very clear. A++",
        img: "https://avatar.vercel.sh/james",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
    onClick,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
    onClick: () => void;
}) => {
    return (
        <figure
            onClick={onClick}
            className={cn(
                // Masterclass Base: Grouping, Glassmorphism, and larger padding
                "group relative w-64 sm:w-72 md:w-80 cursor-pointer overflow-hidden rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-500",
                "bg-card/40 backdrop-blur-md border-border/50",
                // Super Senior Hover: Float effect + Neon Glow Shadow
                "hover:bg-card/80 hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] hover:-translate-y-2 dark:hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)]"
            )}
        >
            {/* Subtle Watermark Icon in the background */}
            <Quote className="absolute top-4 right-4 h-12 w-12 text-foreground/[0.03] dark:text-white/[0.02] rotate-180 transition-transform duration-500 group-hover:scale-125 group-hover:text-blue-500/10" />

            <div className="flex flex-row items-center gap-4 relative z-10">
                <img
                    className="rounded-full border-2 border-background shadow-md transition-transform duration-500 group-hover:scale-110"
                    width="44"
                    height="44"
                    alt={`${name}'s avatar`}
                    src={img}
                />
                <div className="flex flex-col">
                    <figcaption className="text-base font-bold text-foreground tracking-tight">
                        {name}
                    </figcaption>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{username}</p>
                </div>
            </div>

            <blockquote className="relative z-10 text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground/90 transition-colors duration-300">
                "{body}"
            </blockquote>
        </figure>
    );
};

export default function Reviews() {
    const [selectedReview, setSelectedReview] = useState<typeof reviews[0] | null>(null);

    return (
        <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-24 bg-background">
            <div className="text-center mb-16 px-4 relative z-20">
                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter mb-4">
                    Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Testimonials</span>
                </h2>
                <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
                    Trusted by startups and businesses worldwide. Here's what they have to say.
                </p>
            </div>

            {/* Marquees with adjusted spacing */}
            <div className="relative w-full z-10">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {firstRow.map((review, i) => (
                        <ReviewCard
                            key={i}
                            {...review}
                            onClick={() => setSelectedReview(review)}
                        />
                    ))}
                </Marquee>

                <Marquee reverse pauseOnHover className="[--duration:40s] mt-6">
                    {secondRow.map((review, i) => (
                        <ReviewCard
                            key={i}
                            {...review}
                            onClick={() => setSelectedReview(review)}
                        />
                    ))}
                </Marquee>

                {/* Smoother Gradient Fades for the edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background via-background/80 to-transparent z-20 hidden md:block" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background via-background/80 to-transparent z-20 hidden md:block" />
            </div>

            {/* Premium Cinematic Modal */}
            {selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* High-quality backdrop blur */}
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-xl transition-opacity"
                        onClick={() => setSelectedReview(null)}
                    />

                    <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl border border-white/10 bg-card/95 text-card-foreground p-8 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        {/* Elegant Close Button */}
                        <button
                            type="button"
                            aria-label="Close modal"
                            onClick={() => setSelectedReview(null)}
                            className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col items-center text-center mt-2">
                            {/* Animated Gradient Avatar Ring */}
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 animate-spin-slow blur-[2px] opacity-70" />
                                <img
                                    className="relative rounded-full border-4 border-card h-24 w-24 object-cover"
                                    alt={selectedReview.name}
                                    src={selectedReview.img}
                                />
                            </div>

                            <h3 className="text-3xl font-extrabold text-foreground mb-1 tracking-tight">
                                {selectedReview.name}
                            </h3>
                            <p className="text-blue-500 font-mono text-sm mb-8 bg-blue-500/10 px-3 py-1 rounded-full">
                                {selectedReview.username}
                            </p>

                            <div className="relative">
                                <Quote className="absolute -top-6 -left-6 text-blue-500/20 h-12 w-12 rotate-180" />
                                <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed relative z-10 font-medium">
                                    {selectedReview.body}
                                </p>
                                <Quote className="absolute -bottom-8 -right-6 text-blue-500/20 h-12 w-12" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}