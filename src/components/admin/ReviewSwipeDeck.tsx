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
    const rotate = useTransform(x, [-300, 300], [-25, 25]);
    const opacity = useTransform(x, [-400, -250, 0, 250, 400], [0, 1, 1, 1, 0]);
    const scale = useTransform(x, [-400, 0, 400], [0.8, 1, 0.8]);
    
    // Indicator Opacity
    const approveOpacity = useTransform(x, [50, 150], [0, 1]);
    const rejectOpacity = useTransform(x, [-150, -50], [1, 0]);

    const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
        if (info.offset.x > 150) {
            onApprove();
        } else if (info.offset.x < -150) {
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
                className="absolute top-12 left-12 border-4 border-primary text-primary px-6 py-2 rounded-xl font-black text-2xl uppercase tracking-tighter -rotate-12 z-20 pointer-events-none"
            >
                Authorize
            </motion.div>
            <motion.div 
                style={{ opacity: rejectOpacity }}
                className="absolute top-12 right-12 border-4 border-red-500 text-red-500 px-6 py-2 rounded-xl font-black text-2xl uppercase tracking-tighter rotate-12 z-20 pointer-events-none"
            >
                Redact
            </motion.div>

            {/* Main Card */}
            <div className="h-full w-full bg-surface-container-highest/80 backdrop-blur-xl border border-zinc-700/50 rounded-[2.5rem] p-10 flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
                
                {/* ID & Date */}
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black font-mono text-zinc-600 tracking-widest uppercase">Registry ID: {review.id.substring(0, 8)}</p>
                        <p className="text-[10px] font-black font-mono text-zinc-400 tracking-widest uppercase">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`material-symbols-outlined text-lg ${i < review.rating ? 'text-primary' : 'text-zinc-800'}`}>
                                {i < review.rating ? 'star' : 'star_outline'}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-3xl font-black font-headline text-on-surface uppercase tracking-tight">{review.customer_name}</h3>
                        <p className="text-primary text-xs font-bold uppercase tracking-widest">{vehicleName}</p>
                    </div>
                    
                    <div className="relative">
                        <span className="absolute -top-4 -left-2 text-6xl text-zinc-800 font-serif opacity-50">&quot;</span>
                        <p className="text-lg text-zinc-300 leading-relaxed font-medium relative z-10 italic">
                            {review.content}
                        </p>
                    </div>
                </div>

                {/* Footer Interaction Hints */}
                <div className="pt-8 border-t border-zinc-800 flex justify-between items-center text-zinc-600">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm animate-pulse">west</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">Reject</span>
                    </div>
                    <span className="text-[9px] font-bold font-mono">DRAG TO DECIDE</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">Approve</span>
                        <span className="material-symbols-outlined text-sm text-primary animate-pulse">east</span>
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
            <div className="flex flex-col items-center justify-center p-20 bg-surface-container/20 rounded-[3rem] border border-dashed border-zinc-800">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6"
                >
                    <span className="material-symbols-outlined text-zinc-600 text-4xl">inventory_2</span>
                </motion.div>
                <h3 className="text-xl font-black text-zinc-500 uppercase tracking-widest mb-2">Queue Depleted</h3>
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">All pending logs have been processed</p>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto h-[500px] perspective-1000">
            <AnimatePresence mode="popLayout">
                {reviews.slice(0, 3).map((review, i) => (
                    <motion.div
                        key={review.id}
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ 
                            scale: 1 - i * 0.05, 
                            y: i * 15, 
                            opacity: 1,
                            zIndex: 10 - i 
                        }}
                        exit={{ 
                            x: reviews[0].id === review.id ? (i === 0 ? 500 : -500) : 0, 
                            opacity: 0,
                            scale: 0.5,
                            transition: { duration: 0.4 }
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
                            <div className="h-full w-full bg-surface-container-highest/40 backdrop-blur-sm border border-zinc-800 rounded-[2.5rem] pointer-events-none" />
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="absolute -bottom-12 left-0 right-0 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: `${(reviews.length / initialReviews.length) * 100}%` }}
                    className="h-full bg-primary"
                />
            </div>
        </div>
    );
}
