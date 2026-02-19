"use client";

import { SlidersHorizontal } from "lucide-react";

export function InventoryFilters({ mode }: { mode: "hire" | "buy" }) {
    const rangeClass = "w-full accent-[#FFC107]";
    const checkClass = "rounded-none accent-[#FFC107]";
    const labelClass = "font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-3 block";
    const subLabelClass = "font-mono text-[9px] text-[#4B5563] uppercase tracking-widest";

    return (
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-8 pr-8 border-r border-[#2D2D2D]">
            <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FFC107]" />
                <h3 className="font-heading text-xl uppercase text-[#F5F5F5]">Filters</h3>
            </div>

            {mode === "hire" && (
                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>Monthly Budget</label>
                        <input type="range" className={rangeClass} />
                        <div className="flex justify-between mt-1">
                            <span className={subLabelClass}>20k</span>
                            <span className={subLabelClass}>150k+</span>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Deposit Available</label>
                        <input type="range" className={rangeClass} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="hp-insurance" className={checkClass} />
                        <label htmlFor="hp-insurance" className="font-mono text-xs text-[#9CA3AF]">Insurance Included</label>
                    </div>
                </div>
            )}

            {mode === "buy" && (
                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>Price Range</label>
                        <input type="range" className={rangeClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Mileage</label>
                        <input type="range" className={rangeClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Year</label>
                        <select className="w-full bg-[#111111] border border-[#2D2D2D] text-[#D1D5DB] font-mono text-xs p-2 focus:outline-none focus:border-[#FFC107] transition-colors">
                            <option>Any Year</option>
                            <option>2022+</option>
                            <option>2020+</option>
                            <option>2018+</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
