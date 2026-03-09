"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReviewForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const { error: submitError } = await supabase
                .from('customer_reviews')
                .insert([
                    {
                        reviewer_name: name,
                        vehicle_make: make || null,
                        vehicle_model: model || null,
                        rating,
                        comment,
                        is_approved: false // Requires admin approval
                    }
                ]);

            if (submitError) {
                throw submitError;
            }

            setSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setSuccess(false);
                setName("");
                setMake("");
                setModel("");
                setRating(5);
                setComment("");
            }, 3000);

        } catch (err: any) {
            console.error("Error submitting review:", err);
            setError("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="text-center mt-16">
                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary text-background-dark hover:bg-yellow-400 px-8 py-4 rounded font-display tracking-widest text-lg transition-colors shadow-[0_4px_14px_rgba(234,179,8,0.3)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)]"
                >
                    <span className="material-symbols-outlined font-bold text-background-dark">rate_review</span>
                    SHARE YOUR EXPERIENCE
                </button>
                <p className="text-slate-500 mt-4 text-sm max-w-md mx-auto">
                    Note: All reviews are securely verified before being published to maintain community quality.
                </p>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
                    <div className="relative bg-surface-dark border border-border-subtle rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-border-subtle">
                            <h3 className="text-2xl font-display text-slate-100 tracking-wider">Write a Review</h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {success ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                                    </div>
                                    <h4 className="text-xl font-heading text-white mb-2">Review Submitted!</h4>
                                    <p className="text-slate-400">Thank you for sharing your experience. Your review will be visible once approved.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Your Name *</label>
                                        <input required value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary text-white" placeholder="John Doe" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Vehicle Make (Optional)</label>
                                            <input value={make} onChange={(e) => setMake(e.target.value)} type="text" className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary text-white" placeholder="e.g. Toyota" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Vehicle Model (Optional)</label>
                                            <input value={model} onChange={(e) => setModel(e.target.value)} type="text" className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary text-white" placeholder="e.g. Prado" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Rating *</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="focus:outline-none"
                                                >
                                                    <span className={`material-symbols-outlined text-3xl ${rating >= star ? 'text-primary' : 'text-slate-600'} hover:text-primary transition-colors`}>
                                                        star
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Your Review *</label>
                                        <textarea required value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary text-white resize-none" placeholder="Tell us about your experience with Konastone Autos..."></textarea>
                                    </div>

                                    {error && <p className="text-red-400 text-sm">{error}</p>}

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg mt-2 hover:bg-yellow-500 transition-colors disabled:bg-primary/50 flex items-center justify-center"
                                    >
                                        {isSubmitting ? <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div> : "Submit Review"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
