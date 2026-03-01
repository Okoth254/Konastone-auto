"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
                return;
            }

            // Redirect to the admin dashboard on success
            router.push("/admin");
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#111111] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E53935] opacity-10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFC107] opacity-10 rounded-full blur-[128px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="bg-[#1A1A1A] p-4 rounded-full border border-[#333333]">
                        <Lock className="w-8 h-8 text-[#FFC107]" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-heading tracking-widest uppercase text-[#F5F5F5]">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center text-sm font-mono text-[#9CA3AF]">
                    Sign in to manage inventory
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-[#1A1A1A] py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[#333333]">
                    <form className="space-y-6" onSubmit={handleLogin}>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-mono text-red-500 leading-relaxed">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-mono text-[#D1D5DB] mb-2 uppercase tracking-wider">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-[#6B7280]" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-10 bg-[#111111] border border-[#333333] rounded-md py-3 text-[#F5F5F5] font-mono focus:ring-1 focus:ring-[#FFC107] focus:border-[#FFC107] transition-colors"
                                    placeholder="admin@konastoneautos.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-mono text-[#D1D5DB] mb-2 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[#6B7280]" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-10 bg-[#111111] border border-[#333333] rounded-md py-3 text-[#F5F5F5] font-mono focus:ring-1 focus:ring-[#FFC107] focus:border-[#FFC107] transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md text-sm font-mono uppercase tracking-widest text-[#111111] bg-[#FFC107] hover:bg-[#FFD54F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111111] focus:ring-[#FFC107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Authenticating..." : "Sign in"}
                                {!isLoading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#E53935] via-[#FFC107] to-[#E53935]" />
        </div>
    );
}
