"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

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
                        "px-5 py-2 rounded-full text-sm font-bold transition-all duration-200",
                        activeCategory === category
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105 border border-transparent"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105 border border-border/50"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    );
});