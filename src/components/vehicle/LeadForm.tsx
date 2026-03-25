"use client";

import { useState } from "react";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface LeadFormProps {
    vehicleId: string;
}

export default function LeadForm({ vehicleId }: LeadFormProps) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const formRef = useRef(null);
    const isInView = useInView(formRef, { once: true, margin: "-100px" });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1,
                ease: "easeOut",
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const { error } = await supabase.from("leads").insert([
                {
                    vehicle_id: vehicleId,
                    full_name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                },
            ]);

            if (error) throw error;
            setStatus("success");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (err) {
            console.error("Error submitting lead:", err);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-12 text-center flex flex-col items-center gap-6 shadow-2xl shadow-primary/5"
            >
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-background-dark shadow-xl shadow-primary/20">
                    <motion.span 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="material-symbols-outlined text-4xl font-black"
                    >
                        done_all
                    </motion.span>
                </div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-heading text-slate-100 uppercase tracking-tight">Inquiry Received</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">A Konastone executive will reach out shortly to discuss your automotive selection.</p>
                </div>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-8 py-3 rounded-full bg-surface-dark border border-border-subtle text-xs font-black uppercase tracking-widest text-slate-300 hover:text-primary transition-all shadow-lg"
                >
                    Inquire Again
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={formRef}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="bg-surface-dark/40 backdrop-blur-md rounded-3xl p-8 border border-border-subtle shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />
            
            <div className="mb-8 space-y-1">
                <h3 className="text-2xl font-heading text-slate-100 uppercase tracking-tight">Experience Excellence</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Request a Private Showing</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2 group">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Full Name</label>
                    <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full h-14 bg-background-dark/50 border border-border-subtle rounded-xl px-4 text-slate-100 focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-slate-700"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants} className="space-y-2 group">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="john@example.com"
                            className="w-full h-14 bg-background-dark/50 border border-border-subtle rounded-xl px-4 text-slate-100 focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-slate-700"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2 group">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Phone Number</label>
                        <input
                            required
                            type="tel"
                            placeholder="+254 7..."
                            className="w-full h-14 bg-background-dark/50 border border-border-subtle rounded-xl px-4 text-slate-100 focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-slate-700"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="space-y-2 group">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Personal Message</label>
                    <textarea
                        rows={4}
                        placeholder="I would like to schedule a viewing..."
                        className="w-full bg-background-dark/50 border border-border-subtle rounded-xl p-4 text-slate-100 focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-slate-700 resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </motion.div>

                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === "submitting"}
                    className="w-full h-16 bg-primary text-background-dark font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/10 transition-all hover:bg-primary/90 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    {status === "submitting" ? (
                        <>
                            <span className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-xl">send</span>
                            Finalize Inquiry
                        </>
                    )}
                </motion.button>

                {status === "error" && (
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-accent-red text-[10px] font-black uppercase tracking-widest"
                    >
                        Submission failed. Please try again.
                    </motion.p>
                )}
            </form>
        </motion.div>
    );
}
