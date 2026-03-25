"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LeadForm({ vehicleId }: { vehicleId: string }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const { error: submitError } = await supabase
                .from('leads')
                .insert([
                    {
                        client_name: name,
                        client_phone: phone,
                        client_message: message || null,
                        vehicle_id: vehicleId,
                        status: 'new'
                    }
                ]);

            if (submitError) {
                throw submitError;
            }

            setSuccess(true);
            setName("");
            setPhone("");
            setMessage("");
        } catch (err) {
            console.error("Error submitting lead:", err);
            setError("Failed to submit. Please try again or contact us directly on WhatsApp.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-surface-dark rounded-xl p-6 border border-primary/50 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
                </div>
                <h3 className="text-xl font-heading tracking-wide text-slate-100">Request Sent!</h3>
                <p className="text-sm text-slate-400">Our sales team will contact you shortly.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-sm text-primary hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <div className="bg-surface-dark rounded-xl p-6 border border-border-subtle">
            <h3 className="text-xl font-heading tracking-wide mb-4 text-slate-100">Interested?</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        id="lead-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="peer w-full bg-background-dark border border-border-subtle rounded-lg px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-100 placeholder-transparent transition-colors"
                        placeholder="Your Name"
                        type="text"
                    />
                    <label htmlFor="lead-name" className="absolute left-4 top-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary pointer-events-none">
                        Your Name
                    </label>
                </div>

                <div className="relative">
                    <input
                        id="lead-phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="peer w-full bg-background-dark border border-border-subtle rounded-lg px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-100 placeholder-transparent transition-colors"
                        placeholder="Phone Number"
                        type="tel"
                    />
                    <label htmlFor="lead-phone" className="absolute left-4 top-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary pointer-events-none">
                        Phone Number
                    </label>
                </div>

                <div className="relative">
                    <textarea
                        id="lead-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="peer w-full bg-background-dark border border-border-subtle rounded-lg px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-100 placeholder-transparent transition-colors"
                        placeholder="Message (Optional)"
                        rows={2}
                    ></textarea>
                    <label htmlFor="lead-message" className="absolute left-4 top-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-primary pointer-events-none">
                        Message (Optional)
                    </label>
                </div>

                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

                <button
                    disabled={isSubmitting}
                    className="w-full rounded-lg h-12 bg-primary text-background-dark font-display tracking-widest uppercase font-bold transition-all mt-4 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center btn-sweep shadow-[0_4px_14px_rgba(234,179,8,0.3)] hover:shadow-primary/50"
                    type="submit"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Book Viewing"
                    )}
                </button>
            </form>
        </div>
    );
}
