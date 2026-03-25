"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

// memo - only re-renders when activeCategory or categories change
export const CategoryFilter = memo(function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((category) => (
                <button
                    key={category}
                    type="button"
                    onClick={() => onSelect(category)}
                    aria-pressed={activeCategory === category}
                    className={cn(
                        "px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 transform-gpu will-change-transform",
                        activeCategory === category
                            ? "bg-blue-600 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] scale-105"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:scale-105 border border-border"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    );
});