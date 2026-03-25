"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

interface Review {
    id: string;
    reviewer_name: string;
    rating: number;
    content: string;
    created_at: string;
}

interface ReviewSwipeDeckProps {
    reviews: Review[];
    approveAction: (id: string) => Promise<void>;
    rejectAction: (id: string) => Promise<void>;
}

function SwipeCard({ review, onApprove, onReject }: { review: Review, onApprove: () => void, onReject: () => void }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-20, 20]);
    const swipeIndicatorRight = useTransform(x, [20, 80], [0, 1]);
    const swipeIndicatorLeft  = useTransform(x, [-80, -20], [1, 0]);

    const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
        if (info.offset.x > 120) onApprove();
        else if (info.offset.x < -120) onReject();
    };

    return (
        <motion.div
            drag="x"
            style={{ x, rotate }}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
            whileTap={{ scale: 0.98 }}
        >
            {/* Approve indicator */}
            <motion.div style={{ opacity: swipeIndicatorRight }} className="absolute top-6 left-6 bg-green-500 text-white font-bold text-xl px-4 py-2 rounded border-2 border-green-400 -rotate-15 z-10">
                APPROVE ✓
            </motion.div>
            {/* Reject indicator */}
            <motion.div style={{ opacity: swipeIndicatorLeft }} className="absolute top-6 right-6 bg-red-500 text-white font-bold text-xl px-4 py-2 rounded border-2 border-red-400 rotate-15 z-10">
                REJECT ✕
            </motion.div>

            <div className="bg-surface-container border border-white/10 rounded-lg p-6 h-full flex flex-col gap-4 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-headline font-bold text-on-surface">{review.reviewer_name}</p>
                        <p className="text-zinc-500 font-mono text-[10px]">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-lg ${i < review.rating ? 'text-primary' : 'text-zinc-700'}`}>★</span>
                        ))}
                    </div>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed flex-1">{review.content}</p>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">← Drag to approve or reject →</p>
            </div>
        </motion.div>
    );
}

export function ReviewSwipeDeck({ reviews: initialReviews, approveAction, rejectAction }: ReviewSwipeDeckProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const [status, setStatus] = useState<string | null>(null);

    const handleApprove = async (id: string) => {
        setStatus("APPROVED ✓");
        await approveAction(id);
        setReviews(r => r.filter(x => x.id !== id));
        setTimeout(() => setStatus(null), 1200);
    };
    const handleReject = async (id: string) => {
        setStatus("REJECTED ✕");
        await rejectAction(id);
        setReviews(r => r.filter(x => x.id !== id));
        setTimeout(() => setStatus(null), 1200);
    };

    if (reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 font-mono text-sm gap-2">
                <span className="material-symbols-outlined text-4xl">verified</span>
                <p>NO PENDING REVIEWS</p>
            </div>
        );
    }

    return (
        <div className="relative">
            <AnimatePresence>
                {status && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 font-mono font-bold text-sm bg-surface-container-high px-4 py-1 border border-white/10 z-50"
                    >
                        {status}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="relative h-64">
                {reviews.slice(0, 3).map((review, i) => (
                    <motion.div
                        key={review.id}
                        initial={{ scale: 1 - i * 0.04, y: i * 6 }}
                        style={{ zIndex: 3 - i }}
                        className="absolute inset-0"
                    >
                        {i === 0 && (
                            <SwipeCard
                                review={review}
                                onApprove={() => handleApprove(review.id)}
                                onReject={() => handleReject(review.id)}
                            />
                        )}
                        {i > 0 && (
                            <div className="bg-surface-container border border-white/8 rounded-lg h-full opacity-50" />
                        )}
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-3 font-mono text-[10px] text-zinc-500">
                <span>{reviews.length} PENDING REVIEW{reviews.length !== 1 ? 'S' : ''}</span>
            </div>
        </div>
    );
}
