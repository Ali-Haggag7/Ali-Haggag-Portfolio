"use client";

import { memo } from "react";
import { SkillCategory, Skill } from "./skills.data";
import { SkillBadge } from "./SkillBadge";

export const CategoryRow = memo(function CategoryRow({
    category,
    index,
    onSelect
}: {
    category: SkillCategory;
    index: number;
    onSelect: (skill: Skill) => void;
}) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 p-4 rounded-2xl transition-colors hover:bg-muted/10 border border-transparent hover:border-border/30">
            <div className="w-full md:w-48 shrink-0">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-l-2 border-blue-500 pl-3">
                    {category.title}
                </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {category.skills.map((skill, idx) => (
                    <SkillBadge
                        key={`${category.title}-${idx}`}
                        skill={skill}
                        onClick={() => onSelect(skill)}
                    />
                ))}
            </div>
        </div>
    );
});