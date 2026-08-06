"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { useStableMap } from "@/hooks/useStableMap";

interface Props {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
    categoryCounts: Record<string, number>;
}

export const CategoryFilter = memo(function CategoryFilter({ categories, activeCategory, onSelect, categoryCounts }: Props) {
    const getHandler = useStableMap(onSelect);

    return (
        <div 
            role="group" 
            aria-label="Filter by category" 
            className="flex overflow-x-auto no-scrollbar items-center md:justify-center gap-2 mb-10 py-1 -mx-4 px-4 md:mx-0 md:px-0 snap-x"
        >
            {categories.map((category) => {
                const isActive = activeCategory === category;
                const count = categoryCounts[category] ?? 0;
                return (
                    <button
                        key={category}
                        type="button"
                        onClick={getHandler(category)}
                        aria-pressed={isActive}
                        className={cn(
                            "flex-shrink-0 snap-center px-4 py-2.5 rounded-full text-[13px] font-semibold border cursor-pointer",
                            "transition-all duration-200",
                            isActive
                                ? "bg-[hsl(var(--accent-blue))] text-white border-transparent shadow-md shadow-[hsl(var(--accent-blue))]/20"
                                : "bg-slate-100/80 dark:bg-background/40 text-slate-700 dark:text-muted-foreground border-slate-200 dark:border-border/50 hover:bg-slate-200/80 dark:hover:bg-muted/80 hover:text-foreground"
                        )}
                    >
                        {category} <span className="opacity-70 font-normal">({count})</span>
                    </button>
                );
            })}
        </div>
    );
});