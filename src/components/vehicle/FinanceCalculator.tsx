"use client";

import { useState } from "react";

export default function FinanceCalculator({ price }: { price: number }) {
    const [depositPercent, setDepositPercent] = useState(30);
    const [tenure, setTenure] = useState(24);

    const depositAmount = (price * depositPercent) / 100;
    const loanAmount = price - depositAmount;
    const interestRate = 0.14; // 14% flat rate for simplicity
    const totalInterest = loanAmount * interestRate * (tenure / 12);
    const totalLoan = loanAmount + totalInterest;
    const monthlyPayment = totalLoan / tenure;

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `KES ${(amount / 1000000).toFixed(2)}M`;
        }
        return `KES ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    };

    return (
        <div className="bg-surface-dark rounded-xl p-6 border border-border-subtle">
            <h3 className="text-xl font-heading tracking-wide mb-4 flex items-center gap-2 text-slate-100">
                <span className="material-symbols-outlined text-accent-teal">payments</span> Finance Options
            </h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Deposit ({depositPercent}%)</span>
                        <span className="font-bold text-slate-200">{formatCurrency(depositAmount)}</span>
                    </div>
                    <input
                        className="w-full accent-primary"
                        max="80"
                        min="10"
                        step="5"
                        type="range"
                        value={depositPercent}
                        onChange={(e) => setDepositPercent(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="text-sm text-slate-400 block mb-2">Tenure</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[12, 24, 36].map((months) => (
                            <button
                                key={months}
                                onClick={() => setTenure(months)}
                                className={`py-2 rounded-lg text-sm transition-colors ${tenure === months
                                        ? "border border-primary bg-primary/20 font-bold text-primary"
                                        : "border border-border-subtle hover:bg-background-dark text-slate-300"
                                    }`}
                            >
                                {months} Mo
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-background-dark rounded-lg p-4 mt-4 text-center border border-border-subtle">
                    <p className="text-sm text-slate-400 mb-1">Estimated Monthly</p>
                    <p className="text-2xl font-heading tracking-wide text-primary">{formatCurrency(monthlyPayment)}</p>
                </div>
            </div>
        </div>
    );
}
