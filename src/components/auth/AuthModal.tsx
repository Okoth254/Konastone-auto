"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockUser = {
            name: isLogin ? "John Doe" : name,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        login(mockUser);
        toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
        setIsLoading(false);
        onClose();
    };

    const inputClass = "w-full pl-12 pr-4 py-3 bg-[#111111] border border-[#2D2D2D] text-[#F5F5F5] font-mono text-sm placeholder:text-[#4B5563] focus:outline-none focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] transition-colors";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#1E1E1E] border border-[#2D2D2D] shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-8 animate-in zoom-in-95 duration-200">

                {/* Yellow top accent */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FFC107]" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-[#6B7280] hover:text-[#FFC107] hover:bg-[#FFC107]/10 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <h2 className="font-heading text-3xl uppercase text-[#F5F5F5] mb-1">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="font-mono text-xs text-[#6B7280] uppercase tracking-widest">
                        {isLogin
                            ? "Enter your details to access your account"
                            : "Join Konastone for a premium experience"
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputClass}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClass}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Please wait...
                            </>
                        ) : (
                            isLogin ? "Sign In" : "Create Account"
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="font-mono text-xs text-[#6B7280]">
                        {isLogin ? "No account? " : "Already registered? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#FFC107] font-bold hover:underline"
                        >
                            {isLogin ? "Sign up" : "Log in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
