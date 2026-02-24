"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Vehicle } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

interface HPCalculatorProps {
    vehicle: Vehicle;
}

export function HPCalculator({ vehicle }: HPCalculatorProps) {
    const [deposit, setDeposit] = useState(vehicle.minDeposit || 0);
    const [term, setTerm] = useState(36);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        const principal = vehicle.price - deposit;
        const rate = 0.12;
        const interest = principal * rate * (term / 12);
        const totalPayable = principal + interest;
        setMonthlyPayment(Math.ceil(totalPayable / term));
    }, [deposit, term, vehicle.price]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(val).replace(".00", "");

    const { addFinanceApp, user } = useStore();
    const router = useRouter();

    const handleStartApplication = async () => {
        const { error } = await (supabase
            .from('hire_purchase_applications') as any)
            .insert({
                car_id: vehicle.id,
                full_name: user?.name || "Anonymous Applicant",
                phone: "0700000000", // Placeholder
                email: user?.email || null,
                deposit_amount: deposit,
                requested_duration: term,
                monthly_income: 0, // Placeholder
                application_status: 'pending'
            });

        if (error) {
            console.error('HP Submission error:', error);
            toast.error("Failed to start application. Please check your connection.");
            return;
        }

        addFinanceApp({
            id: Math.random().toString(36).substr(2, 9),
            vehicleId: vehicle.id,
            vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            deposit,
            term,
            monthlyPayment,
            status: "Review",
            date: new Date().toDateString(),
        });

        toast.success("Application Received", {
            description: "We've received your financing request. Redirecting to your dashboard...",
            duration: 2000,
        });
        setTimeout(() => router.push("/account"), 1500);
    };

    return (
        <div className="bg-[#111111] border border-[#FFC107]/20 p-6 space-y-6">
            {/* Header */}
            <div>
                <p className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">Finance Calculator</p>
                <h3 className="font-heading text-2xl uppercase text-[#F5F5F5]">Customize Plan</h3>
                <p className="font-mono text-xs text-[#4B5563] mt-1">Adjust settings to fit your monthly budget.</p>
            </div>

            {/* Deposit Slider */}
            <div>
                <div className="flex justify-between items-end mb-3">
                    <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest">Initial Deposit</label>
                    <span className="font-slab text-xl font-bold text-[#FFC107] tabular-nums">
                        {formatCurrency(deposit)}
                    </span>
                </div>
                <input
                    type="range"
                    min={vehicle.minDeposit || 0}
                    max={vehicle.price * 0.5}
                    step={50000}
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full h-1 bg-[#2D2D2D] appearance-none cursor-pointer accent-[#FFC107]"
                />
                <div className="flex justify-between mt-1">
                    <span className="font-mono text-[9px] text-[#4B5563] uppercase">Min: {formatCurrency(vehicle.minDeposit || 0)}</span>
                    <span className="font-mono text-[9px] text-[#4B5563] uppercase">Max: 50%</span>
                </div>
            </div>

            {/* Term Selector */}
            <div>
                <label className="font-mono text-[10px] text-[#6B7280] uppercase tracking-widest block mb-3">Repayment Period</label>
                <div className="grid grid-cols-4 gap-2">
                    {[12, 24, 36, 48].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTerm(t)}
                            className={cn(
                                "py-3 font-heading uppercase text-sm tracking-widest border transition-all",
                                term === t
                                    ? "bg-[#FFC107] border-[#FFC107] text-black"
                                    : "bg-[#1A1A1A] border-[#2D2D2D] text-[#4B5563] hover:border-[#FFC107]/40 hover:text-[#9CA3AF]"
                            )}
                        >
                            {t}<span className="text-[9px] ml-0.5 opacity-60">mo</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Result Panel */}
            <div className="bg-[#1A1A1A] border border-[#FFC107]/30 p-5">
                <p className="font-mono text-[9px] text-[#4B5563] uppercase tracking-widest mb-2">Estimated Monthly Payment</p>
                <div className="flex items-baseline gap-2">
                    <p className="font-slab text-4xl font-bold text-[#FFC107] tabular-nums tracking-tight">
                        {formatCurrency(monthlyPayment)}
                    </p>
                    <span className="font-mono text-xs text-[#4B5563]">/mo</span>
                </div>
                <div className="mt-4 pt-4 border-t border-[#2D2D2D] flex justify-between font-mono text-[10px] text-[#4B5563] uppercase tracking-widest">
                    <span>Total Cost of Credit</span>
                    <span className="text-[#9CA3AF]">+12% p.a.</span>
                </div>
            </div>

            <Button onClick={handleStartApplication} size="lg" className="w-full">
                Start Application
            </Button>

            <p className="font-mono text-[9px] text-center text-[#4B5563] leading-relaxed max-w-xs mx-auto">
                *Estimates are indicative. Final rates subject to credit assessment.
            </p>
        </div>
    );
}
