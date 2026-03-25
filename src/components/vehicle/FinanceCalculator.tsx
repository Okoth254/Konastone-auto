"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";
import MotionButton from "@/components/ui/MotionButton";

export default function FinanceCalculator({ price }: { price: number }) {
    const [depositPercent, setDepositPercent] = useState(siteConfig.finance.defaultDepositPercent);
    const [tenure, setTenure] = useState(siteConfig.finance.tenureOptions[1]);

    const depositAmount = (price * depositPercent) / 100;
    const loanAmount = price - depositAmount;
    const interestRate = siteConfig.finance.interestRate;
    const totalInterest = loanAmount * interestRate * (tenure / 12);
    const totalLoan = loanAmount + totalInterest;
    const monthlyPayment = totalLoan / tenure;

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `Ksh ${(amount / 1000000).toFixed(2)}M`;
        }
        return `Ksh ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    };

    return (
        <div className="bg-surface-dark rounded-[2rem] p-8 border border-border-subtle shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/5 blur-3xl rounded-full" />
            
            <h3 className="text-2xl font-heading tracking-tight mb-8 flex items-center gap-3 text-slate-100">
                <span className="w-10 h-10 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal">
                    <span className="material-symbols-outlined text-xl">payments</span>
                </span>
                Finance Logic
            </h3>

            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Initial Deposit</span>
                        <motion.span 
                            key={depositPercent}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-lg font-heading text-primary"
                        >
                            {depositPercent}% <span className="text-slate-500 text-xs ml-1">({formatCurrency(depositAmount)})</span>
                        </motion.span>
                    </div>
                    <div className="relative h-6 flex items-center group/slider">
                        <input
                            className="w-full h-1.5 bg-background-dark/50 rounded-full appearance-none cursor-pointer accent-primary border border-white/5"
                            max={siteConfig.finance.maxDepositPercent}
                            min={siteConfig.finance.minDepositPercent}
                            step="5"
                            type="range"
                            value={depositPercent}
                            onChange={(e) => setDepositPercent(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">Repayment Tenure</label>
                    <div className="grid grid-cols-3 gap-3">
                        {siteConfig.finance.tenureOptions.map((months) => (
                            <button
                                key={months}
                                onClick={() => setTenure(months)}
                                className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tenure === months
                                    ? "bg-primary text-background-dark shadow-[0_8px_16px_-4px_rgba(255,191,41,0.4)]"
                                    : "bg-background-dark/50 border border-border-subtle text-slate-400 hover:border-primary/50"
                                    }`}
                            >
                                {months} Months
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div 
                    layout
                    className="bg-background-dark/80 backdrop-blur-md rounded-2xl p-6 border border-border-subtle flex flex-col items-center gap-1 shadow-inner"
                >
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Estimated Monthly</p>
                    <motion.p 
                        key={monthlyPayment}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl font-heading tracking-tighter text-primary"
                    >
                        {formatCurrency(monthlyPayment)}
                    </motion.p>
                    <div className="w-full h-px bg-white/5 my-3" />
                    <p className="text-[8px] text-slate-600 font-medium uppercase tracking-widest italic text-center">
                        *Subject to bank approval & credit assessment
                    </p>
                </motion.div>
                
                <MotionButton 
                    className="w-full h-14 btn-sweep text-[10px] font-black tracking-widest"
                    variant="secondary"
                >
                    Get Pre-Approved
                </MotionButton>
            </div>
        </div>
    );
}
