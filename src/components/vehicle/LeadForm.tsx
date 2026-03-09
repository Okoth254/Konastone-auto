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
        } catch (err: any) {
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
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-100 placeholder-slate-500"
                    placeholder="Your Name"
                    type="text"
                />
                <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-100 placeholder-slate-500"
                    placeholder="Phone Number"
                    type="tel"
                />
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-100 placeholder-slate-500"
                    placeholder="Message (Optional)"
                    rows={2}
                ></textarea>

                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

                <button
                    disabled={isSubmitting}
                    className="w-full rounded-lg h-10 bg-primary text-background-dark font-bold hover:bg-yellow-500 transition-colors mt-2 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center"
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
