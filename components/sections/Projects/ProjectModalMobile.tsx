"use client";

import { Github, ExternalLink, Target, Zap, Activity, X } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ProjectFeature } from "./projects.data";

export const ProjectModalMobile = ({ feature, onClose }: { feature: ProjectFeature; onClose: () => void; }) => {
    const { id, name, description, videoSrc, imageSrc, isGradientBg, gradientClass, autopsy, demoHref, href, cta } = feature;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-auto">

            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.03, ease: "easeOut" }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transform-gpu"
                aria-hidden="true"
            />

            {/* Draggable Bottom Sheet */}
            <motion.article
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-title-${id}`}
                // Slides up fast from the bottom
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ duration: 0.03, ease: "easeOut" }}

                // --- سحر السحب لتحت (Swipe to Dismiss) ---
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }} // يمنع السحب لفوق
                dragElastic={{ top: 0, bottom: 0.5 }} // مقاومة خفيفة للسحب
                onDragEnd={(e, info) => {
                    // لو اليوزر سحبها 100 بيكسل لتحت أو سحبها بسرعة، اقفل المودال
                    if (info.offset.y > 100 || info.velocity.y > 500) {
                        onClose();
                    }
                }}
                // ------------------------------------------

                className="relative w-full h-[100dvh] bg-white dark:bg-slate-950 rounded-t-3xl shadow-2xl flex flex-col z-10 overflow-hidden transform-gpu"
            >
                {/* Mobile Drag Indicator (الشَرطة اللي فوق اللي بتعرفه إنه يقدر يسحب) */}
                <div className="w-full flex justify-center py-3 absolute top-0 z-50 pointer-events-none">
                    <div className="w-12 h-1.5 bg-white/40 backdrop-blur-md rounded-full" />
                </div>

                {/* زرار الإغلاق العادي (احتياطي) */}
                <button
                    type="button"
                    aria-label="Close details"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 transform-gpu active:scale-95"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* --- الجزء المرن (الفيديو والوصف) اللي بيتمدد بناءً على المساحة المتبقية --- */}
                <div className="relative w-full flex-1 flex flex-col justify-end bg-slate-100 dark:bg-black overflow-hidden rounded-t-3xl min-h-[30vh]">

                    {/* Media container taking full absolute space of the flexible header */}
                    <div className="absolute inset-0 w-full h-full">
                        {videoSrc ? (
                            <video autoPlay muted playsInline loop className="w-full h-full object-cover">
                                <source src={videoSrc} type="video/mp4" />
                            </video>
                        ) : isGradientBg ? (
                            <div className={`h-full w-full bg-gradient-to-br ${gradientClass}`}></div>
                        ) : imageSrc ? (
                            <Image src={imageSrc} alt={name} className="w-full h-full object-cover" placeholder="blur" />
                        ) : null}

                        {/* Gradient عشان الكلام يبان بوضوح */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 dark:from-slate-950 dark:via-slate-950/60 to-transparent pointer-events-none" />
                    </div>

                    <div className="relative z-10 p-6 w-full flex flex-col gap-3">
                        <div>
                            <h3 id={`modal-title-${id}`} className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                                {name}
                            </h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-3">
                                {description}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            {demoHref && (
                                <Link href={demoHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 rounded-full transition-colors active:scale-95">
                                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Live Demo
                                </Link>
                            )}
                            {href && (
                                <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full transition-colors active:scale-95">
                                    <Github className="w-3.5 h-3.5" aria-hidden="true" /> {cta || "Source"}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- الجزء الثابت (كروت الداتا) اللي بيفضل لازق في القاع --- */}
                {/* shrink-0 بتأكد إن الكروت مش هتنكمش ولا هتصغر، وهتاخد حجمها الطبيعي */}
                <div className="p-6 pb-8 bg-white dark:bg-slate-950 shrink-0 relative z-20">
                    {autopsy && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <h4 className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-2 uppercase text-[10px] tracking-wider">
                                    <Target className="w-3.5 h-3.5" /> The Challenge
                                </h4>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{autopsy.challenge}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <h4 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2 uppercase text-[10px] tracking-wider">
                                    <Activity className="w-3.5 h-3.5" /> Architecture
                                </h4>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{autopsy.architecture}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <h4 className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-2 uppercase text-[10px] tracking-wider">
                                    <Zap className="w-3.5 h-3.5" /> The Impact
                                </h4>
                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{autopsy.impact}</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.article>
        </div>
    );
};