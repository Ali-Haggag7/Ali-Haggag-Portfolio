"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw, ShieldAlert } from "lucide-react";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Unhandleable application error:", error);
    }, [error]);

    return (
        <main className="flex flex-col justify-end sm:justify-center items-center min-h-screen bg-slate-950/80 backdrop-blur-md text-slate-300 p-0 sm:p-4 font-mono z-50">
            {/* Native iOS Bottom Sheet on Mobile / Centered Cyberpunk Dialog on Desktop */}
            <div className="w-full sm:max-w-lg p-6 sm:p-8 border-t sm:border border-red-500/30 dark:border-red-900/50 rounded-t-[32px] sm:rounded-2xl bg-slate-900/95 dark:bg-[#161B22]/95 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(239,68,68,0.2)] sm:shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col items-center text-center relative overflow-hidden animate-in slide-in-from-bottom duration-300">
                
                {/* iOS Native Drag Handle Pill (Mobile Only) */}
                <div aria-hidden="true" className="w-12 h-1.5 bg-red-500/40 rounded-full mb-6 sm:hidden" />

                {/* Visual scanline layer */}
                <div 
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
                        backgroundSize: "100% 4px",
                    }}
                />

                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <AlertOctagon className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" aria-hidden="true" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-red-500/15 border border-red-500/30 text-red-400 mb-3 tracking-widest uppercase font-mono">
                    <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                    SYSTEM CRASH
                </span>

                <h1 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                    An unexpected kernel panic has occurred
                </h1>

                <p className="text-xs text-slate-400 mb-6 max-w-md leading-relaxed font-mono">
                    The rendering engine encountered an unhandled exception. State dump:{" "}
                    <span className="text-red-400 block mt-2 bg-black/60 p-3 rounded-xl border border-red-900/40 break-all text-[11px] font-mono text-left max-h-32 overflow-y-auto">
                        {error.message || "Unknown execution fault"}
                    </span>
                </p>

                <button
                    type="button"
                    onClick={reset}
                    className="group flex min-h-[44px] items-center justify-center gap-2 px-6 py-3 w-full bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all active:scale-95 outline-none focus:ring-2 focus:ring-red-500 shadow-[0_0_25px_rgba(239,68,68,0.4)] cursor-pointer"
                >
                    <RotateCcw className="w-4.5 h-4.5 transition-transform group-hover:rotate-180 duration-500" aria-hidden="true" />
                    <span>Reboot Application Context</span>
                </button>
            </div>
        </main>
    );
}
