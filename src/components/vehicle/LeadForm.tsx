"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import MotionInput from "@/components/ui/MotionInput";
import MotionButton from "@/components/ui/MotionButton";

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
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-12 text-center flex flex-col items-center gap-8 shadow-2xl"
            >
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-background-dark shadow-[0_20px_40px_-10px_rgba(255,191,41,0.5)]">
                    <motion.span 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="material-symbols-outlined text-5xl font-black"
                    >
                        verified
                    </motion.span>
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-heading text-slate-100 uppercase tracking-tighter">Inquiry Secured</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-[240px] mx-auto italic">Our executive team has been notified of your interest. Expect a response shortly.</p>
                </div>
                <MotionButton
                    onClick={() => setStatus("idle")}
                    variant="outline"
                    className="h-12 border-white/5 text-slate-500 hover:text-primary hover:border-primary/20"
                >
                    Return to Listing
                </MotionButton>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={formRef}
            className="bg-surface-dark/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-border-subtle shadow-2xl relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl pointer-events-none rounded-full" />
            
            <div className="mb-10 space-y-2">
                <h3 className="text-3xl font-heading text-slate-100 uppercase tracking-tighter leading-none">Command Interest</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Personalized Concierge Request</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <MotionInput
                    required
                    label="Full Name"
                    placeholder="E.g. Alexander Pierce"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 rounded-2xl bg-background-dark/50 border-white/5 focus:border-primary/30"
                />

                <div className="grid grid-cols-1 gap-6">
                    <MotionInput
                        required
                        type="email"
                        label="Email Address"
                        placeholder="alexander@luxury.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-14 rounded-2xl bg-background-dark/50 border-white/5 focus:border-primary/30"
                    />

                    <MotionInput
                        required
                        type="tel"
                        label="Phone Number"
                        placeholder="+254 7..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-14 rounded-2xl bg-background-dark/50 border-white/5 focus:border-primary/30"
                    />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase ml-1">Message</label>
                    <textarea
                        rows={3}
                        placeholder="Inquire about history, viewing times, or finance..."
                        className="w-full bg-background-dark/50 border border-white/5 rounded-2xl p-5 text-sm text-slate-100 focus:outline-none focus:border-primary/30 transition-all font-medium placeholder:text-slate-800 resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>

                <MotionButton
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full h-16 btn-sweep shadow-[0_20px_40px_-10px_rgba(255,191,41,0.2)]"
                >
                    {status === "submitting" ? (
                        <>
                            <span className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin mr-3" />
                            Transmitting...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined mr-2">send</span>
                            Secure Inquiry
                        </>
                    )}
                </MotionButton>

                {status === "error" && (
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-accent-red text-[10px] font-black uppercase tracking-widest mt-4"
                    >
                        Protocol failure. Please re-attempt.
                    </motion.p>
                )}
            </form>
        </motion.div>
    );
}
