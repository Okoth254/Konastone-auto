"use client";

import { useState } from "react";
import { ReviewSwipeDeck } from "./ReviewSwipeDeck";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
    };
}

interface ReviewsClientProps {
    initialReviews: Review[];
    pendingReviews: Review[];
}

export default function ReviewsClient({ initialReviews, pendingReviews }: ReviewsClientProps) {
    const [viewMode, setViewMode] = useState<'list' | 'focus'>('list');
    const [reviews, setReviews] = useState(initialReviews);

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('customer_reviews')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            
            // Update local state if in list view
            setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        } catch (err) {
            console.error("Failed to update review status:", err);
            alert("Security Override Failed: Unable to synchronize with database.");
        }
    };

    return (
        <div className="space-y-8">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-8">
                <div className="flex bg-surface-container-high/40 p-1.5 rounded-2xl border border-zinc-700/50">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            viewMode === 'list' 
                            ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' 
                            : 'text-zinc-500 hover:text-white'
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">list_alt</span>
                        Tactical View
                    </button>
                    <button
                        onClick={() => setViewMode('focus')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            viewMode === 'focus' 
                            ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' 
                            : 'text-zinc-500 hover:text-white'
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">target</span>
                        Focus Decider
                    </button>
                </div>

                {viewMode === 'focus' && (
                    <div className="flex items-center gap-4">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Live Decider Active</span>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'focus' ? (
                    <motion.div
                        key="focus-view"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="py-12"
                    >
                        <ReviewSwipeDeck 
                            reviews={pendingReviews} 
                            onAction={handleAction} 
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="list-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-surface-container-high border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">
                                        <th className="p-6">Registry ID</th>
                                        <th className="p-6">Client Name</th>
                                        <th className="p-6">Vehicle Asset</th>
                                        <th className="p-6">Rating</th>
                                        <th className="p-6">Status Capsule</th>
                                        <th className="p-6 text-right">Access</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review) => {
                                        const vehicleName = review.vehicles 
                                            ? `${review.vehicles.year} ${review.vehicles.make} ${review.vehicles.model}`
                                            : "General";
                                        
                                        const statusColors: Record<string, string> = {
                                            pending: "bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
                                            approved: "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(255,191,41,0.2)]",
                                            rejected: "bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
                                        };

                                        return (
                                            <tr key={review.id} className="border-b border-zinc-800/50 hover:bg-white/2 transition-colors group">
                                                <td className="p-6 font-mono text-[10px] text-zinc-500">{review.id.substring(0, 8).toUpperCase()}</td>
                                                <td className="p-6 font-black text-on-surface uppercase tracking-tight">{review.customer_name}</td>
                                                <td className="p-6 text-zinc-400 text-xs font-medium">{vehicleName}</td>
                                                <td className="p-6">
                                                    <div className="flex gap-0.5 text-primary">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i} className={`material-symbols-outlined text-[14px] ${i < review.rating ? 'fill-1' : 'opacity-20'}`}>
                                                                star
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-2.5 py-1 rounded border text-[8px] font-black uppercase tracking-[0.2em] ${statusColors[review.status] || 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                                                        {review.status}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <Link 
                                                        href={`/admin/reviews/${review.id}`}
                                                        className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-primary transition-colors flex items-center justify-end gap-2"
                                                    >
                                                        Details <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
