"use client";

import { memo, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

// Stable per-category handler factory — same reference per category string
// across renders, so memo bail-out on each button is never defeated.
function useStableHandlers(onSelect: (category: string) => void) {
    const handlersRef = useRef<Map<string, () => void>>(new Map());

    return useCallback(
        (category: string): (() => void) => {
            if (!handlersRef.current.has(category)) {
                handlersRef.current.set(category, () => onSelect(category));
            }
            return handlersRef.current.get(category)!;
        },
        [onSelect]
    );
}

export const CategoryFilter = memo(function CategoryFilter({
    categories,
    activeCategory,
    onSelect,
}: CategoryFilterProps) {
    const getHandler = useStableHandlers(onSelect);

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
                            "px-5 py-2 rounded-full text-sm font-bold border",
                            "transition-[transform,box-shadow,background-color,color,border-color] duration-200",
                            isActive
                                ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/30 scale-105"
                                : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground hover:scale-105"
                        )}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
});