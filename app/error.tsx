"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

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
        <main className="flex flex-col items-center justify-center min-h-screen bg-[#0D1117] text-slate-300 px-4 font-mono">
            {/* Terminal-like container for the error message */}
            <div className="w-full max-w-lg p-8 border border-red-900/50 rounded-2xl bg-[#161B22] shadow-[0_0_50px_rgba(239,68,68,0.1)] flex flex-col items-center text-center relative overflow-hidden">
                {/* Visual scanline layer */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
                        backgroundSize: "100% 4px",
                    }}
                />

                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
                    <AlertOctagon className="w-8 h-8 animate-pulse" aria-hidden="true" />
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-500 mb-4 tracking-wider uppercase">
                    SYSTEM CRASH
                </span>

                <h1 className="text-xl font-bold text-white mb-2 leading-tight">
                    An unexpected kernel panic has occurred
                </h1>

                <p className="text-xs text-slate-400 mb-8 max-w-md leading-relaxed font-mono">
                    The rendering engine encountered an unhandled exception. State dump:{" "}
                    <span className="text-red-400 block mt-2 bg-black/40 p-2.5 rounded border border-slate-800 break-all text-[10px] text-left">
                        {error.message || "Unknown execution fault"}
                    </span>
                </p>

                <button
                    type="button"
                    onClick={reset}
                    className="group flex items-center justify-center gap-2 px-6 py-3 w-full bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all active:scale-95 outline-none focus:ring-2 focus:ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] cursor-pointer"
                >
                    <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-45" aria-hidden="true" />
                    Reboot Application Context
                </button>
            </div>
        </main>
    );
}
