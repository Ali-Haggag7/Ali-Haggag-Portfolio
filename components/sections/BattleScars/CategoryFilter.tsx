"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { useStableMap } from "@/hooks/useStableMap";

interface Props {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

export const CategoryFilter = memo(function CategoryFilter({ categories, activeCategory, onSelect }: Props) {
    const getHandler = useStableMap(onSelect);

    return (
        <div role="group" aria-label="Filter by category" className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                    <button
                        key={category}
                        type="button"
                        onClick={getHandler(category)}
                        aria-pressed={isActive}
                        className={cn(
                            // py-3 = 48px total height — WCAG 2.5.5 touch target compliance
                            "px-5 py-3 rounded-full text-sm font-bold border",
                            "transition-[box-shadow,background-color,color,border-color] duration-200 hover:scale-105",
                            isActive
                                ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/30"
                                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                        )}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
});