"use client";

import { useState, useTransition } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

export interface Review {
    id: string;
    customer_name: string;
    rating: number;
    content: string;
    created_at: string;
    status: string;
    vehicles?: {
        year: number;
        make: string;
        model: string;
    } | null;
}

interface ReviewSwipeDeckProps {
    reviews: Review[];
    onAction: (id: string, status: 'approved' | 'rejected') => Promise<void>;
}

function SwipeCard({ review, onApprove, onReject }: { review: Review; onApprove: () => void; onReject: () => void }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-300, 300], [-30, 30]);
    const opacity = useTransform(x, [-400, -250, 0, 250, 400], [0, 1, 1, 1, 0]);
    const scale = useTransform(x, [-400, 0, 400], [0.5, 1, 0.5]);
    
    const approveOpacity = useTransform(x, [50, 150], [0, 1]);
    const rejectOpacity = useTransform(x, [-150, -50], [1, 0]);

    const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
        if (info.offset.x > 180 || info.velocity.x > 800) {
            onApprove();
        } else if (info.offset.x < -180 || info.velocity.x < -800) {
            onReject();
        }
    };

    const vehicleName = review.vehicles 
        ? `${review.vehicles.year} ${review.vehicles.make} ${review.vehicles.model}`
        : "General Review";

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, rotate, opacity, scale }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: "grabbing" }}
            className="absolute inset-0 cursor-grab z-10"
        >
            {/* Visual Indicators */}
            <motion.div 
                style={{ opacity: approveOpacity }}
                className="absolute top-16 left-16 border-4 border-primary text-primary px-8 py-3 rounded-2xl font-heading font-black text-4xl uppercase tracking-tighter -rotate-12 z-20 pointer-events-none shadow-[0_0_50px_rgba(255,191,41,0.5)]"
            >
                AUTHORIZE
            </motion.div>
            <motion.div 
                style={{ opacity: rejectOpacity }}
                className="absolute top-16 right-16 border-4 border-red-500 text-red-500 px-8 py-3 rounded-2xl font-heading font-black text-4xl uppercase tracking-tighter rotate-12 z-20 pointer-events-none shadow-[0_0_50px_rgba(239,68,68,0.5)]"
            >
                REDACT
            </motion.div>

            {/* Main Card */}
            <div className="h-full w-full bg-surface-dark/60 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-12 flex flex-col shadow-[0_60px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] group-hover:bg-primary/20 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-teal/5 blur-[80px]" />
                
                {/* ID & Star Rating */}
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-[10px] font-black font-mono text-slate-500 tracking-[0.4em] uppercase">SECURE_LOG_{review.id.substring(0, 8)}</p>
                        </div>
                        <p className="text-[10px] font-black font-mono text-slate-600 tracking-[0.2em] uppercase">{new Date(review.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex gap-1.5 bg-background-dark/50 p-2 rounded-2xl border border-white/5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`material-symbols-outlined text-xl ${i < review.rating ? 'text-primary fill-1' : 'text-slate-800'}`}>
                                star
                            </span>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-8 relative z-10">
                    <div className="space-y-2">
                        <h3 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter leading-none">{review.customer_name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">directions_car</span>
                            <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] font-mono">{vehicleName}</p>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <span className="material-symbols-outlined absolute -top-12 -left-6 text-8xl text-white opacity-5 select-none">format_quote</span>
                        <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-medium relative z-10 italic tracking-tight">
                            &quot;{review.content}&quot;
                        </p>
                    </div>
                </div>

                {/* Footer Interaction Hints */}
                <div className="pt-10 border-t border-white/5 flex justify-between items-center text-slate-600 relative z-10">
                    <div className="flex items-center gap-3 group/hint">
                        <motion.span 
                            animate={{ x: [-5, 5, -5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="material-symbols-outlined text-sm"
                        >
                            west
                        </motion.span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Reject</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black font-mono text-slate-700 tracking-[0.5em] mb-2 uppercase">Decision Protocol</span>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 group/hint">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Approve</span>
                        <motion.span 
                            animate={{ x: [5, -5, 5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="material-symbols-outlined text-sm text-primary"
                        >
                            east
                        </motion.span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function ReviewSwipeDeck({ reviews: initialReviews, onAction }: ReviewSwipeDeckProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const [, startTransition] = useTransition();

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        startTransition(async () => {
            await onAction(id, status);
            setReviews(prev => prev.filter(r => r.id !== id));
        });
    };

    if (reviews.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-24 bg-surface-dark/20 rounded-[4rem] border border-dashed border-white/10 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />
                <motion.div 
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-28 h-28 rounded-full bg-surface-dark flex items-center justify-center mb-8 border border-white/5 shadow-2xl relative"
                >
                    <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                    <span className="material-symbols-outlined text-primary text-5xl">verified</span>
                </motion.div>
                <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tighter mb-4">Registry Clear</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] text-center max-w-xs leading-loose">
                    All incoming transmissions have been processed and encrypted.
                </p>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className="mt-12 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-primary hover:border-primary/50 transition-all"
                >
                    REFRESH FEED
                </motion.button>
            </motion.div>
        );
    }

    const progress = (1 - reviews.length / initialReviews.length) * 100;

    return (
        <div className="relative w-full max-w-2xl mx-auto h-[600px] perspective-2000">
            <AnimatePresence mode="popLayout" initial={false}>
                {reviews.slice(0, 3).reverse().map((review, reversedIndex) => {
                    const i = Math.min(2, reviews.length - 1) - reversedIndex;
                    return (
                        <motion.div
                            key={review.id}
                            initial={{ scale: 0.8, y: 50, opacity: 0 }}
                            animate={{ 
                                scale: 1 - i * 0.08, 
                                y: i * 25, 
                                opacity: 1 - i * 0.2,
                                zIndex: 10 - i,
                                filter: `blur(${i * 2}px)`
                            }}
                            exit={{ 
                                x: 600, 
                                opacity: 0,
                                scale: 0.5,
                                rotate: 45,
                                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                            }}
                            className="absolute inset-0"
                        >
                            {i === 0 ? (
                                <SwipeCard
                                    review={review}
                                    onApprove={() => handleAction(review.id, 'approved')}
                                    onReject={() => handleAction(review.id, 'rejected')}
                                />
                            ) : (
                                <div className="h-full w-full bg-surface-dark/40 backdrop-blur-md border border-white/10 rounded-[3.5rem] shadow-2xl" />
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Progress Telemetry */}
            <div className="absolute -bottom-24 left-0 right-0 px-8">
                <div className="flex justify-between items-end mb-4 px-2">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Moderation_Velocity</span>
                        <span className="text-sm font-mono text-primary">{Math.round(progress)}% COMPLETE</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Remaining_Logs</span>
                        <span className="text-sm font-mono text-slate-400">{reviews.length} / {initialReviews.length}</span>
                    </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-linear-to-r from-primary to-accent-teal shadow-[0_0_20px_rgba(255,191,41,0.5)]"
                    />
                </div>
            </div>
        </div>
    );
}
