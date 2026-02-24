"use client";

import { SlidersHorizontal } from "lucide-react";

interface InventoryFiltersProps {
    mode: "hire" | "buy";
    maxPrice: number;
    setMaxPrice: (val: number) => void;
    maxMileage: number;
    setMaxMileage: (val: number) => void;
    minYear: number;
    setMinYear: (val: number) => void;
}

export function InventoryFilters({
    mode,
    maxPrice,
    setMaxPrice,
    maxMileage,
    setMaxMileage,
    minYear,
    setMinYear
}: InventoryFiltersProps) {
    const rangeClass = "w-full h-1 bg-[#2D2D2D] appearance-none cursor-pointer accent-[#FFC107] transition-all";
    const checkClass = "rounded-none accent-[#FFC107]";
    const labelClass = "font-mono text-[10px] text-[#6B7280] uppercase tracking-widest mb-3 block";
    const subLabelClass = "font-mono text-[9px] text-[#4B5563] uppercase tracking-widest";

    const formatPrice = (val: number) =>
        new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(val).replace(".00", "");

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
                        <div className="flex justify-between items-end mb-2">
                            <label className={labelClass}>Max Price</label>
                            <span className="font-mono text-[11px] text-[#FFC107]">{formatPrice(maxPrice)}</span>
                        </div>
                        <input
                            type="range"
                            min={1000000}
                            max={10000000}
                            step={100000}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className={rangeClass}
                        />
                        <div className="flex justify-between mt-1">
                            <span className={subLabelClass}>1M</span>
                            <span className={subLabelClass}>10M</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className={labelClass}>Max Mileage</label>
                            <span className="font-mono text-[11px] text-[#FFC107]">{maxMileage.toLocaleString()} km</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={200000}
                            step={5000}
                            value={maxMileage}
                            onChange={(e) => setMaxMileage(Number(e.target.value))}
                            className={rangeClass}
                        />
                        <div className="flex justify-between mt-1">
                            <span className={subLabelClass}>0</span>
                            <span className={subLabelClass}>200k+</span>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Min Year</label>
                        <select
                            value={minYear}
                            onChange={(e) => setMinYear(Number(e.target.value))}
                            className="w-full bg-[#111111] border border-[#2D2D2D] text-[#D1D5DB] font-mono text-xs p-2 focus:outline-none focus:border-[#FFC107] transition-colors"
                        >
                            <option value={2010}>Any Year</option>
                            <option value={2022}>2022+</option>
                            <option value={2020}>2020+</option>
                            <option value={2018}>2018+</option>
                            <option value={2015}>2015+</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
