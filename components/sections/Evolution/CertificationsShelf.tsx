"use client";

import { memo } from "react";
import { CERTIFICATIONS_DATA } from "./certificationsData";
import { Award, CheckCircle2 } from "lucide-react";

export const CertificationsShelf = memo(function CertificationsShelf() {
    return (
        <div className="w-full max-w-4xl mx-auto my-12 p-6 rounded-2xl border border-border bg-card shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-foreground">
                    <Award className="h-5 w-5 text-amber-400" aria-hidden="true" />
                    <span>Verified Diplomas &amp; Certifications</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full border border-border/40">
                    4 Verified Credentials
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CERTIFICATIONS_DATA.map((cert) => (
                    <div
                        key={cert.id}
                        className="flex flex-col justify-between rounded-xl border border-border/70 bg-background/50 p-4 transition-all hover:border-amber-500/40 hover:bg-card"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-mono font-bold text-amber-400">
                                    {cert.issuer}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                    VERIFIED
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-foreground font-mono">
                                {cert.title}
                            </h4>
                            <p className="text-xs text-muted-foreground font-mono mt-1.5 leading-relaxed">
                                {cert.focus}
                            </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-border/30 text-[10px] font-mono text-muted-foreground/80 flex items-center justify-between">
                            <span>Issued: {cert.date}</span>
                            <span>Credential Verified ✓</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
