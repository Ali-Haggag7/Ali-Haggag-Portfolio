import { Activity, ListChecks, ShieldAlert, FolderGit2 } from "lucide-react";

export function BattleScarsSkeleton() {
    return (
        <section
            id="battle-scars-skeleton"
            className="py-24 px-4 md:px-8 w-full max-w-5xl mx-auto animate-pulse"
        >
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center gap-2 mb-4">
                    <span className="h-px w-8 bg-blue-500/20 block" />
                    <span className="text-blue-500/40 font-mono text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500/30" />
                        Engineering Logs
                    </span>
                    <span className="h-px w-8 bg-blue-500/20 block" />
                </div>
                <div className="h-10 w-64 bg-muted/30 rounded-xl mx-auto mb-4" />
                <div className="h-5 w-full max-w-2xl bg-muted/20 rounded-lg mx-auto mb-2" />
                <div className="h-5 w-3/4 max-w-lg bg-muted/20 rounded-lg mx-auto" />
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 py-4 px-2 text-center h-[100px]">
                    <ListChecks className="w-5 h-5 mb-2 text-muted-foreground/30" />
                    <div className="h-4 w-12 bg-muted/30 rounded mb-1" />
                    <div className="h-3 w-16 bg-muted/20 rounded" />
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 py-4 px-2 text-center h-[100px]">
                    <ShieldAlert className="w-5 h-5 mb-2 text-muted-foreground/30" />
                    <div className="h-4 w-12 bg-muted/30 rounded mb-1" />
                    <div className="h-3 w-16 bg-muted/20 rounded" />
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/40 py-4 px-2 text-center h-[100px]">
                    <FolderGit2 className="w-5 h-5 mb-2 text-muted-foreground/30" />
                    <div className="h-4 w-20 bg-muted/30 rounded mb-1" />
                    <div className="h-3 w-16 bg-muted/20 rounded" />
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-11 w-20 sm:w-24 rounded-full bg-muted/30 border border-border/30" />
                ))}
            </div>

            {/* Cards List Skeleton */}
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="w-full h-16 rounded-xl border border-border/50 bg-card/40 p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded bg-muted/30" />
                            <div className="space-y-1.5">
                                <div className="h-4 w-32 bg-muted/30 rounded" />
                                <div className="h-3 w-48 bg-muted/20 rounded" />
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted/30" />
                    </div>
                ))}
            </div>
        </section>
    );
}
