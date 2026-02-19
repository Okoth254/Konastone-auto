"use client";

import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HirePurchasePanelProps {
    isActive?: boolean;
}

export function HirePurchasePanel({ isActive }: HirePurchasePanelProps) {
    return (
        <div className="max-w-xl text-white space-y-8">
            {/* Eyebrow label */}
            <div className="flex items-center gap-2 text-[#26C6DA] font-mono text-xs uppercase tracking-[0.25em]">
                <FileText className="w-4 h-4" />
                <span>Konastone Hire Purchase</span>
            </div>

            {/* Big headline */}
            <h1 className="font-heading text-grunge text-6xl md:text-8xl leading-[0.9] uppercase">
                Drive Now. <br />
                <span className="text-[#FFC107]">Pay Over Time.</span>
            </h1>

            <p className="font-mono text-sm text-[#9CA3AF] max-w-md leading-relaxed tracking-wide">
                Structured ownership with transparent monthly payments. No hidden fees. Digital approval in minutes.
            </p>

            {/* Estimator card */}
            <div className="bg-[#1A1A1A] border border-[#FFC107]/25 p-6 md:min-w-[400px]">
                <h3 className="font-heading text-xl uppercase tracking-widest text-[#F5F5F5] mb-5">
                    Quick Estimator
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-mono text-[#6B7280] uppercase tracking-widest block mb-2">
                            Monthly Budget
                        </label>
                        <input
                            type="range"
                            min="20000"
                            max="150000"
                            step="5000"
                            className="w-full h-2 bg-[#2D2D2D] rounded-none appearance-none cursor-pointer accent-[#FFC107]"
                        />
                        <div className="flex justify-between text-xs font-mono mt-2 text-[#6B7280]">
                            <span>KES 20k</span>
                            <span className="font-bold text-[#FFC107]">KES 45,000</span>
                            <span>KES 150k</span>
                        </div>
                    </div>

                    <Link href="/inventory?mode=hire" className="block w-full">
                        <Button size="lg"
                            className="w-full justify-between group bg-[#FFC107] hover:bg-[#E6AC00] text-black font-heading uppercase tracking-widest rounded-sm border-0 shadow-[0_0_20px_rgba(255,193,7,0.2)]">
                            Start Hire Purchase Plan
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
