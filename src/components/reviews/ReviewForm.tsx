"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import MotionButton from "@/components/ui/MotionButton";
import MotionInput from "@/components/ui/MotionInput";
import { motion, AnimatePresence } from "framer-motion";


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

    const stepLabels = ["Identity", "Rating", "Feedback"];

    const getActiveStep = () => {
        if (!name) return 1;
        if (!comment) return 2;
        return 3;
    };

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

            if (submitError) throw submitError;

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

        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Protocol failure. Please re-attempt.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="text-center mt-24">
                <MotionButton
                    onClick={() => setIsOpen(true)}
                    className="h-16 px-10 shadow-[0_20px_40px_-12px_rgba(255,191,41,0.3)] btn-sweep"
                >
                    <span className="material-symbols-outlined mr-3">rate_review</span>
                    SUBMIT PERFORMANCE LOG
                </MotionButton>
                <p className="text-[10px] text-slate-500 mt-6 font-black uppercase tracking-[0.3em] max-w-md mx-auto">
                    *Reviews undergo 256-bit verification before publishing
                </p>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        {/* Step Progress Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="fixed top-6 left-1/2 -translate-x-1/2 z-200 flex items-center gap-3 bg-surface-dark/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl"
                        >
                            {stepLabels.map((label, i) => {
                                const stepNum = i + 1;
                                const isActive = stepNum === getActiveStep();
                                const isComplete = stepNum < getActiveStep();
                                return (
                                    <div key={label} className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                                            isComplete ? "bg-primary text-black" :
                                            isActive ? "bg-primary/20 text-primary border border-primary/50" :
                                            "bg-white/5 text-slate-600"
                                        }`}>
                                            {isComplete ? "✓" : stepNum}
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-slate-600"}`}>{label}</span>
                                        {i < stepLabels.length - 1 && <div className={`w-6 h-0.5 rounded-full ${isComplete ? "bg-primary" : "bg-white/10"}`} />}
                                    </div>
                                );
                            })}
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background-dark/95 backdrop-blur-xl" 
                            onClick={() => setIsOpen(false)}
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative bg-surface-dark border border-border-subtle rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-10 border-b border-white/5 bg-white/2">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-heading text-slate-100 uppercase tracking-tighter leading-none">Experience Intake</h3>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Customer Performance Log</p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="p-10 overflow-y-auto custom-scrollbar">
                                {success ? (
                                    <div className="text-center py-12 space-y-8">
                                        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto shadow-[0_20px_40px_-10px_rgba(255,191,41,0.5)]">
                                            <span className="material-symbols-outlined text-background-dark text-5xl font-black">verified</span>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-3xl font-heading text-white uppercase tracking-tighter">Log Transmitted</h4>
                                            <p className="text-slate-500 text-xs font-medium max-w-[280px] mx-auto leading-relaxed">Your performance feedback has been queued for verification and will be live shortly.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <MotionInput
                                            required
                                            label="Full Pilot Name"
                                            placeholder="E.g. Alexander Pierce"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-14 bg-background-dark/50 border-white/5"
                                        />
                                        
                                        <div className="grid grid-cols-2 gap-6">
                                            <MotionInput
                                                label="Machine Make"
                                                placeholder="Toyota"
                                                value={make}
                                                onChange={(e) => setMake(e.target.value)}
                                                className="h-14 bg-background-dark/50 border-white/5"
                                            />
                                            <MotionInput
                                                label="Machine Model"
                                                placeholder="Prado"
                                                value={model}
                                                onChange={(e) => setModel(e.target.value)}
                                                className="h-14 bg-background-dark/50 border-white/5"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Satisfaction Metric</label>
                                            <div className="flex gap-4 bg-background-dark/50 p-4 rounded-2xl border border-white/5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className="group relative"
                                                    >
                                                        <span className={`material-symbols-outlined text-4xl leading-none transition-all ${rating >= star ? 'text-primary scale-110' : 'text-slate-800'}`}>
                                                            star
                                                        </span>
                                                        {rating >= star && (
                                                            <motion.div layoutId="rating-glow" className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Detail Experience</label>
                                            <textarea 
                                                required 
                                                value={comment} 
                                                onChange={(e) => setComment(e.target.value)} 
                                                rows={4} 
                                                className="w-full bg-background-dark/50 border border-white/5 rounded-2xl p-6 text-sm text-slate-100 focus:outline-none focus:border-primary/30 transition-all font-medium placeholder:text-slate-800 resize-none" 
                                                placeholder="Document your journey with Konastone Autos..."
                                            />
                                        </div>

                                        {error && (
                                            <motion.p initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} className="text-accent-red text-[10px] font-black uppercase tracking-widest text-center">
                                                {error}
                                            </motion.p>
                                        )}

                                        <MotionButton
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full h-18 text-lg btn-sweep mt-4"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-6 h-6 border-2 border-background-dark border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined mr-3">send</span>
                                                    SUBMIT LOG
                                                </>
                                            )}
                                        </MotionButton>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}