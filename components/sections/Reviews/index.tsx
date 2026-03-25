"use client";

import { useState } from "react";
import Marquee from "@/components/ui/marquee";
import { reviewsData, Review } from "./reviews.data";
import { ReviewCard } from "./ReviewCard";
import { ReviewModal } from "./ReviewModal";

export default function Reviews() {
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const firstRow = reviewsData.slice(0, reviewsData.length / 2);
    const secondRow = reviewsData.slice(reviewsData.length / 2);

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

            <div className="relative w-full z-10">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {firstRow.map((review, i) => (
                        <ReviewCard key={i} {...review} onClick={() => setSelectedReview(review)} />
                    ))}
                </Marquee>

                <Marquee reverse pauseOnHover className="[--duration:40s] mt-6">
                    {secondRow.map((review, i) => (
                        <ReviewCard key={i} {...review} onClick={() => setSelectedReview(review)} />
                    ))}
                </Marquee>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background via-background/80 to-transparent z-20 hidden md:block transform-gpu will-change-transform" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background via-background/80 to-transparent z-20 hidden md:block transform-gpu will-change-transform" />
            </div>

            {selectedReview && (
                <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
            )}
        </section>
    );
}