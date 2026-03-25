"use client";

import { X, Quote } from "lucide-react";
import { Review } from "./reviews.data";

export function ReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-xl transition-opacity will-change-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl border border-white/10 bg-card/95 text-card-foreground p-8 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 transform-gpu will-change-[opacity,transform]">
                <button
                    type="button"
                    aria-label="Close modal"
                    onClick={onClose}
                    className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-[transform,background-color] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 transform-gpu will-change-transform"
                >
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className="mb-6 relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 animate-spin-slow blur-[2px] opacity-70 transform-gpu" />
                        <img
                            className="relative rounded-full border-4 border-card h-24 w-24 object-cover transform-gpu"
                            alt={review.name}
                            src={review.img}
                        />
                    </div>

                    <h3 className="text-3xl font-extrabold text-foreground mb-1 tracking-tight">
                        {review.name}
                    </h3>
                    <p className="text-blue-500 font-mono text-sm mb-8 bg-blue-500/10 px-3 py-1 rounded-full">
                        {review.username}
                    </p>

                    <div className="relative">
                        <Quote className="absolute -top-6 -left-6 text-blue-500/20 h-12 w-12 rotate-180 transform-gpu" aria-hidden="true" />
                        <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed relative z-10 font-medium">
                            {review.body}
                        </p>
                        <Quote className="absolute -bottom-8 -right-6 text-blue-500/20 h-12 w-12 transform-gpu" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </div>
    );
}