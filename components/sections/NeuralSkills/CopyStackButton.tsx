"use client";

import { memo, useState, useCallback } from "react";
import { Copy, Check, FileText } from "lucide-react";

const STACK_SUMMARY_TEXT = `ALI HAGGAG — TECHNICAL STACK SUMMARY (AUGUST 2026)
--------------------------------------------------
Frontend: Next.js 16/15, React 19/18, TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, PWA Workbox
Backend: NestJS 11, Node.js, Express, PostgreSQL, MongoDB, Redis, Prisma ORM, Socket.io
AI & Real-Time: Groq (Llama 3.3 70B), Playwright (worker_threads), WebRTC P2P, Tauri v2
DevOps & Security: Docker, Nginx, DigitalOcean, JWT HttpOnly, AES-256-GCM, Zod ACL
Custom DSL: AliScript v2.4 Lexer & AST Parser Engine`;

export const CopyStackButton = memo(function CopyStackButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(STACK_SUMMARY_TEXT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    return (
        <button
            type="button"
            onClick={handleCopy}
            title="Copy formatted tech stack summary for recruitment"
            aria-label="Copy tech stack summary"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-mono font-bold text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
            {copied ? (
                <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    <span className="text-emerald-400">Stack Copied to Clipboard!</span>
                </>
            ) : (
                <>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    <span>Copy Tech Stack (Text/Markdown)</span>
                </>
            )}
        </button>
    );
});
