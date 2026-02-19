"use client";

import { useState } from "react";
import { CheckCircle, FileText, User, PenTool, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const { addOrder } = useStore();
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: "",
        kraPin: "",
        email: "",
        phone: "",
        agreedToTerms: false,
        otp: ""
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.phone) {
                toast.error("Please fill in all details");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.agreedToTerms) {
                toast.error("Please agree to the terms");
                return;
            }
            setStep(3);
        }
    };

    const handleConfirm = () => {
        if (formData.otp.length < 6) {
            toast.error("Please enter the complete verification code");
            return;
        }
        addOrder({
            id: Math.random().toString(36).substr(2, 9),
            step: 3,
            status: 'Pending',
            date: new Date().toDateString()
        });
        toast.success("Order Placed Successfully!");
        setTimeout(() => router.push("/account"), 1500);
    };

    const steps = [
        { number: 1, title: "Personal Details", icon: User },
        { number: 2, title: "Review Agreement", icon: FileText },
        { number: 3, title: "Digital Signing", icon: PenTool },
    ];

    const inputClass = "w-full p-3 bg-[#111111] border border-[#2D2D2D] text-[#F5F5F5] font-mono text-sm placeholder:text-[#4B5563] focus:outline-none focus:border-[#FFC107] focus:ring-1 focus:ring-[#FFC107] transition-colors";
    const labelClass = "block font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-2";

    return (
        <div className="min-h-screen bg-[#1A1A1A] py-12">
            <div className="container mx-auto px-4 max-w-3xl">

                {/* Progress Tracker */}
                <div className="mb-12">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-[#2D2D2D] -z-10" />
                        {steps.map((s) => {
                            const Icon = s.icon;
                            const isActive = step >= s.number;
                            const isCurrent = step === s.number;
                            return (
                                <div key={s.number} className="flex flex-col items-center bg-[#1A1A1A] px-4">
                                    <div className={cn(
                                        "w-12 h-12 flex items-center justify-center mb-2 border-2 transition-colors",
                                        isActive
                                            ? "bg-[#FFC107] border-[#FFC107] text-black"
                                            : "bg-[#1E1E1E] border-[#2D2D2D] text-[#4B5563]"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={cn(
                                        "font-mono text-[10px] uppercase tracking-widest",
                                        isCurrent ? "text-[#FFC107]" : "text-[#4B5563]"
                                    )}>
                                        {s.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Card */}
                <div className="bg-[#1E1E1E] border border-[#2D2D2D] p-8">
                    {/* Yellow top accent */}
                    <div className="h-[3px] bg-[#FFC107] -mt-8 mb-8 -mx-8" />

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="font-heading text-3xl uppercase text-[#F5F5F5]">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input type="text" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} className={inputClass} placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className={labelClass}>KRA PIN</label>
                                    <input type="text" value={formData.kraPin} onChange={(e) => handleChange("kraPin", e.target.value)} className={inputClass} placeholder="A00..." />
                                </div>
                                <div>
                                    <label className={labelClass}>Email Address</label>
                                    <input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass} placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className={labelClass}>Phone Number</label>
                                    <input type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass} placeholder="+254 7..." />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button onClick={handleNext} size="lg">Continue to Agreement</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="font-heading text-3xl uppercase text-[#F5F5F5]">Review Terms</h2>
                            <div className="bg-[#111111] border border-[#2D2D2D] p-6 h-64 overflow-y-auto text-sm text-[#9CA3AF] font-mono leading-relaxed">
                                <p><strong className="text-[#F5F5F5]">1. HIRE PURCHASE AGREEMENT</strong></p>
                                <p className="mt-2">This agreement is made between Konastone Motors ("Owner") and the Customer ("Hirer")...</p>
                                <p className="mt-2"><strong className="text-[#F5F5F5]">2. PAYMENT SCHEDULE</strong></p>
                                <p>The Hirer agrees to pay the monthly installments as specified in the schedule...</p>
                                <p className="mt-2"><strong className="text-[#F5F5F5]">3. OWNERSHIP TRANSFER</strong></p>
                                <p>Ownership of the vehicle shall remain with the Owner until the final installment is paid in full...</p>
                                <p className="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <p className="mt-2">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="accept-terms"
                                    checked={formData.agreedToTerms}
                                    onChange={(e) => handleChange("agreedToTerms", e.target.checked)}
                                    className="w-5 h-5 accent-[#FFC107]"
                                />
                                <label htmlFor="accept-terms" className="font-mono text-xs text-[#9CA3AF]">
                                    I have read and agree to the Hire Purchase Terms & Conditions.
                                </label>
                            </div>

                            <div className="pt-4 flex justify-between">
                                <Button onClick={() => setStep(1)} variant="outline">Back</Button>
                                <Button onClick={handleNext} size="lg">Continue to Signing</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                            <div className="mx-auto w-20 h-20 bg-[#FFC107]/10 border border-[#FFC107]/30 flex items-center justify-center text-[#FFC107]">
                                <Lock className="w-10 h-10" />
                            </div>

                            <h2 className="font-heading text-3xl uppercase text-[#F5F5F5]">Secure Digital Signature</h2>
                            <p className="font-mono text-sm text-[#9CA3AF] max-w-md mx-auto">
                                A verification code has been sent to your phone ending in **** {formData.phone.slice(-3) || "892"}. Please enter it below to sign the agreement digitally.
                            </p>

                            <div className="flex justify-center my-8">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={formData.otp}
                                    onChange={(e) => handleChange("otp", e.target.value)}
                                    placeholder="123456"
                                    className="w-48 h-16 text-center text-3xl font-slab font-bold bg-[#111111] border-2 border-[#2D2D2D] text-[#FFC107] focus:border-[#FFC107] focus:outline-none tracking-[0.5em] transition-colors"
                                />
                            </div>

                            <div className="pt-4 flex justify-between">
                                <Button onClick={() => setStep(2)} variant="outline">Back</Button>
                                <Button onClick={handleConfirm} size="lg">Confirm & Sign</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
