"use client";

import { useState } from "react";
import { ReviewSwipeDeck } from "./ReviewSwipeDeck";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MotionButton from "@/components/ui/MotionButton";
import MotionBadge from "@/components/ui/MotionBadge";

interface Review {
    id: string;
    customer_name: string;
    rating: number;
    content: string;
    status: string;
    created_at: string;
    vehicles?: {
        year: number;
        make: string;
        model: string;
    } | null;
}

interface ReviewsClientProps {
    initialReviews: Review[];
    pendingReviews: Review[];
}

export default function ReviewsClient({ initialReviews, pendingReviews }: ReviewsClientProps) {
    const [viewMode, setViewMode] = useState<'list' | 'focus'>(pendingReviews.length > 0 ? 'focus' : 'list');
    const [reviews, setReviews] = useState(initialReviews);
    const [localPending, setLocalPending] = useState(pendingReviews);

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('customer_reviews')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            
            // Update states
            setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            setLocalPending(prev => prev.filter(r => r.id !== id));
            
            if (localPending.length <= 1 && viewMode === 'focus') {
                setTimeout(() => setViewMode('list'), 1000);
            }
        } catch (err) {
            console.error("Failed to update review status:", err);
        }
    };

    return (
        <div className="space-y-12">
            {/* Command Toggle */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b border-white/5 pb-10"
            >
                <div className="flex bg-surface-dark/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <button
                        onClick={() => setViewMode('focus')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                            viewMode === 'focus' 
                            ? 'bg-primary text-black shadow-2xl shadow-primary/20' 
                            : 'text-slate-500 hover:text-slate-200'
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg">target</span>
                        Focus_Decider
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                            viewMode === 'list' 
                            ? 'bg-primary text-black shadow-2xl shadow-primary/20' 
                            : 'text-slate-500 hover:text-slate-200'
                        }`}
                    >
                        <span className="material-symbols-outlined text-lg">database</span>
                        Tactical_Archive
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${localPending.length > 0 ? 'bg-primary animate-pulse' : 'bg-slate-800'}`} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Packets: {localPending.length}</span>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {viewMode === 'focus' ? (
                    <motion.div
                        key="focus-view"
                        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="py-12"
                    >
                        {localPending.length > 0 ? (
                            <ReviewSwipeDeck 
                                reviews={localPending} 
                                onAction={handleAction} 
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-40">
                                <span className="material-symbols-outlined text-7xl animate-bounce">inventory_2</span>
                                <h3 className="text-2xl font-heading font-black text-white uppercase italic">DECISION_QUEUE_CLEAR</h3>
                                <MotionButton variant="outline" onClick={() => setViewMode('list')}>Return to Archive</MotionButton>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list-view"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="bg-surface-dark/40 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/[0.02] border-b border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.4em]">
                                        <th className="px-10 py-6">Registry_ID</th>
                                        <th className="px-10 py-6">Identity</th>
                                        <th className="px-10 py-6">Asset_Link</th>
                                        <th className="px-10 py-6 text-center">Sentiment_Metric</th>
                                        <th className="px-10 py-6">Protocol_State</th>
                                        <th className="px-10 py-6 text-right">Access</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review, index) => (
                                        <motion.tr 
                                            key={review.id} 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-all group cursor-pointer"
                                        >
                                            <td className="px-10 py-6 font-mono text-[10px] text-slate-600 uppercase tracking-tighter">
                                                {review.id.substring(0, 8)}
                                            </td>
                                            <td className="px-10 py-6">
                                                <p className="font-heading font-black text-white uppercase tracking-tight text-lg group-hover:text-primary transition-colors">
                                                    {review.customer_name}
                                                </p>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">
                                                    Verified Client
                                                </p>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest italic">
                                                    {review.vehicles ? `${review.vehicles.year} ${review.vehicles.make} ${review.vehicles.model}` : "GENERAL_INQUIRY"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex justify-center gap-0.5 text-primary">
                                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                                        <span key={starIndex} className={`material-symbols-outlined text-sm ${starIndex < review.rating ? 'fill-1' : 'opacity-10'}`}>
                                                            star
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <MotionBadge 
                                                    color={review.status === 'approved' ? 'primary' : 'neutral'}
                                                    className={`uppercase tracking-widest ${
                                                        review.status === 'approved' ? 'bg-primary/10 text-primary border-primary/20' :
                                                        review.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}
                                                >
                                                    {review.status}
                                                </MotionBadge>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <Link 
                                                    href={`/admin/reviews/${review.id}`}
                                                    className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-white transition-all group/link"
                                                >
                                                    EXAMINE_LOG
                                                    <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">east</span>
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
