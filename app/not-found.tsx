import Link from "next/link";
import { Terminal, Home } from "lucide-react";

export default function NotFound() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-[#0D1117] text-slate-300 px-4 font-mono">
            {/* Terminal-like container for the error message */}
            <div className="w-full max-w-md p-8 border border-slate-800 rounded-2xl bg-[#161B22] shadow-2xl flex flex-col items-center text-center">

                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <Terminal className="w-8 h-8" aria-hidden="true" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">404: Endpoint Not Found</h1>

                <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                    The requested route is offline, archived, or does not exist within the current system architecture.
                </p>

                <Link
                    href="/"
                    className="group flex items-center justify-center gap-2 px-6 py-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all active:scale-95 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <Home className="w-4 h-4 transition-transform group-hover:-translate-y-1" aria-hidden="true" />
                    cd ~/home
                </Link>
            </div>
        </main>
    );
}